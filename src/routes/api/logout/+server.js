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

    const insertQuery = "DELETE FROM cookies WHERE cookie_value = $1";
    const insertParams = [cookie_value];
    await client.query(insertQuery, insertParams);

    cookies.set("sessionId", undefined, {
      path: "/",
    });

    return json({ message: "All good", status: 200 });
  } catch (error) {
    return json({ message: "Error connecting to database", status: 203 });
  } finally {
    await client.end();
  }
};
