import { error, json } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config();

export const POST = async ({ cookies }) => {
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
    const cookie_value = cookies.get("sessionId");

    await client.connect();

    let insertQuery = "SELECT user_id FROM cookies WHERE cookie_value = $1";
    let insertParams = [cookie_value];
    let res = await client.query(insertQuery, insertParams);
    const user_id = res.rows[0].user_id;

    insertQuery = "SELECT username FROM users WHERE id = $1";
    insertParams = [user_id];
    res = await client.query(insertQuery, insertParams);
    const username = res.rows[0].username;

    return json({ message: `${username}`, id: `${user_id}`,  status: 200 });
  } catch (error) {
    return json({ message: "Error connecting to database", status: 203 });
  } finally {
    await client.end();
  }
};
