import {
  encryptMessage,
  decryptMessage,
} from "../../../lib/functions/cryptoProviders.js";
import { error, json } from "@sveltejs/kit";
import path from "path";
import fs from "fs/promises";
import pkg from "pg";
const { Client } = pkg;

export const POST = async ({ cookies, request }) => {
  // Get connection params
  const filePath = path.resolve("src/connectionParameters.json");
  const fileContent = await fs.readFile(filePath, "utf8");
  const data = JSON.parse(fileContent);

  // Create client
  const client = new Client({
    user: data.user,
    host: data.host,
    database: data.database,
    password: data.password,
    port: data.port,
    ssl:
      data.ssl && data.ssl.ca
        ? {
            ca: data.ssl.ca,
          }
        : false,
  });

  try {
    await client.connect();

    const cookie_value = cookies.get("sessionId");
    const privateKey = cookies.get("privateKey");
    const publicKey = cookies.get("publicKey");

    let insertQuery = "SELECT user_id FROM cookies WHERE cookie_value = $1";
    let insertParams = [cookie_value];
    let res = await client.query(insertQuery, insertParams);
    const id = res.rows[0].user_id;

    insertQuery = "SELECT lv, encryptedlist FROM tasks WHERE user_id = $1";
    insertParams = [id];
    res = await client.query(insertQuery, insertParams);

    let decryptedMessage;

    let counterCompleted = 0;
    let counterAll = 0;

    if (res.rows.length !== 0) {
        const values = res.rows[0];
        const iv = values.lv;
        const encryptedMessage = values.encryptedlist;

        decryptedMessage = decryptMessage(
            privateKey,
            encryptedMessage,
            iv,
            publicKey,
        );

        decryptedMessage = JSON.parse(decryptedMessage);
        decryptedMessage.forEach(element => {
            if(element.task.completed === true){
                counterCompleted++;
            }
            counterAll++;
        });
    }

    return json({ counterAll: counterAll, counterCompleted: counterCompleted, status: 200 });

  } catch (error) {
    console.log(error);
    return json({ error: error, status: 201 });
  } finally {
    await client.end();
  }
};
