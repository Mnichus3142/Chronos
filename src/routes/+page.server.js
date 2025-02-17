import { cookies } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import { redirect } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import dotenv from 'dotenv';
dotenv.config();

export async function load({ cookies }) {
  // Create cookie
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
    // If cookie exist then go to main page
    if (cookie_value != undefined) {
      await client.connect();
      const insertQuery =
        "SELECT cookie_value FROM cookies WHERE cookie_value = $1";
      const insertParams = [cookie_value];
      const check = await client.query(insertQuery, insertParams);

      // If cookie do not exist in database go to landing page
      if (check.rowCount === 1) {
        throw redirect(302, "/main");
      }
    }

    // If not create a cookie
    else if (cookie_value == undefined) {
      cookies.set("sessionId", undefined, {
        path: "/",
      });
    }
  } finally {
    await client.end();
  }
}
