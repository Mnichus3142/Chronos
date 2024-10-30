import { cookies } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import { redirect } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";
import fs from "fs/promises";
import path from "path";

export async function load({ cookies }) {
  // Create cookie
  const cookie_value = cookies.get("sessionId");

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
