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
    const { listActual, mode, day } = await request.json();

    await client.connect();

    const cookie_value = cookies.get("sessionId");
    const privateKey = cookies.get("privateKey");
    const publicKey = cookies.get("publicKey");

    let insertQuery = "SELECT user_id FROM cookies WHERE cookie_value = $1";
    let insertParams = [cookie_value];
    let res = await client.query(insertQuery, insertParams);
    const id = res.rows[0].user_id;

    if (mode === "SET") {
      const { encryptedMessage, iv } = encryptMessage(
        publicKey,
        listActual,
        privateKey,
      );

      insertQuery = "SELECT * FROM tasks WHERE user_id = $1 AND task_day = $2";
      insertParams = [id, day];
      res = await client.query(insertQuery, insertParams);
      const rowsCount = res.rows.length;

      if (rowsCount === 0) {
        //TODO: I made a mistake in database, so there is lv as column name, i will change it in the future
        insertQuery =
          "INSERT INTO tasks (user_id, task_day, encryptedlist, lv) VALUES ($1, $2, $4, $3)";
        insertParams = [id, day, iv, encryptedMessage];
        await client.query(insertQuery, insertParams);
      } else {
        insertQuery =
          "UPDATE tasks SET encryptedlist = $1, lv = $2 WHERE user_id = $3 AND task_day = $4";
        insertParams = [encryptedMessage, iv, id, day];
        await client.query(insertQuery, insertParams);
      }

      return json({ status: 200 });
    } else if (mode == "GET") {
      insertQuery = "SELECT lv, encryptedlist FROM tasks WHERE user_id = $1 AND task_day = $2";
      insertParams = [id, day];
      res = await client.query(insertQuery, insertParams);

      let decryptedMessage;

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
      }

      return json({ decryptedMessage: decryptedMessage, status: 200 });
    }
  } catch (error) {
    console.log(error);
    return json({ error: error, status: 201 });
  } finally {
    await client.end();
  }
};
