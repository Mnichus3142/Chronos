/** @type {import('./$types').PageServerLoad} */
import { cookies } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import { redirect } from "@sveltejs/kit";
import dotenv from 'dotenv';
dotenv.config();

export async function load({ cookies }) {
  // Get cookie value
  const cookie_value = cookies.get("sessionId");

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
    if (cookie_value === undefined) {
      throw redirect(302, "/");
    }

    await client.connect();
    const result = await client.query(
      "SELECT * FROM cookies WHERE cookie_value = $1",
      [cookie_value],
    );

    if (result.rowCount === 0) {
      throw redirect(302, "/");
    }
  } finally {
    await client.end();
  }
}
