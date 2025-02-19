import {
  encryptMessage,
  decryptMessage,
} from "../../../lib/functions/cryptoProviders.js";
import { error, json } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import dotenv from 'dotenv';

dotenv.config();

export const POST = async ({ cookies, request }) => {
  // Create client
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    ssl:process.env.SSL_ENABLED ? {
        ca: process.env.SSL_CA,
      }: false,
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
    const day = new Date();

    insertQuery = "SELECT lv, encryptedlist FROM tasks WHERE user_id = $1 AND task_day = $2";
    insertParams = [id, day];
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
