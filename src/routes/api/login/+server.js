import { error, json } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import { sha256 } from "$lib/functions/sha256.js";
import { generateUniqueData } from "../../../lib/functions/generateUniqueData.js";
import fs from "fs/promises";
import path from "path";
import { generateKeys } from "../../../lib/functions/cryptoProviders.js";

export const POST = async ({ request, cookies }) => {
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
    // Get variables from form
    const { user, hashed, rememberMe } = await request.json();

    // Connect to database
    await client.connect();

    // Check if user exist
    let insertQuery = "SELECT * FROM users WHERE username = $1";
    let insertParams = [user];
    const res = await client.query(insertQuery, insertParams);

    if (res.rows.length == 1) {
      // Check if password is equal in database and this from user
      if (res.rows[0]["password"] === hashed) {
        // Get user id
        insertQuery = "SELECT id FROM users WHERE username = $1";
        insertParams = [user];
        const res = await client.query(insertQuery, insertParams);
        const user_id = res.rows[0].id;

        // Delete old cookies
        insertQuery = "DELETE FROM cookies WHERE user_id = $1";
        insertParams = [user_id];
        await client.query(insertQuery, insertParams);

        // Createe cookie
        const uniqueData = await generateUniqueData(user);
        const cookieValue = await sha256(uniqueData);

        // Create keys
        const keyData = await sha256(`${hashed} + ${user}`);
        const { publicKey, privateKey } = generateKeys(keyData);

        // Cookie if we want to remember
        if (rememberMe) {
          cookies.set("sessionId", cookieValue, {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365 * 100,
          });

          cookies.set("privateKey", privateKey, {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365 * 100,
          });

          cookies.set("publicKey", publicKey, {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 365 * 100,
          });
        }

        // Cookie if we don't want to remember
        else {
          cookies.set("sessionId", cookieValue, {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax",
          });

          cookies.set("privateKey", privateKey, {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax",
          });

          cookies.set("publicKey", publicKey, {
            path: "/",
            httpOnly: false,
            secure: true,
            sameSite: "lax",
          });
        }

        // Add cookie value to database
        insertQuery =
          "INSERT INTO cookies (cookie_value, user_id, remember_me) VALUES ($1, $2, $3)";
        insertParams = [cookieValue, user_id, rememberMe];
        await client.query(insertQuery, insertParams);

        return json({ message: "All good", status: 200 });
      } else {
        return json({ message: "Wrong password", status: 204 });
      }
    } else {
      return json({ message: "User not exists", status: 204 });
    }
  } catch (error) {
    return json({
      message: "Error processing request / User not exist",
      status: 203,
    });
  } finally {
    await client.end();
  }
};
