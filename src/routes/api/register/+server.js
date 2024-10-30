import { error, json } from "@sveltejs/kit";
import pkg from "pg";
const { Client } = pkg;
import fs from "fs/promises";
import path from "path";
import { generateKeys } from "../../../lib/functions/cryptoProviders.js";
import { sha256 } from "../../../lib/functions/sha256.js";
import { generateUniqueData } from "../../../lib/functions/generateUniqueData.js";

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
    const { user, hashed } = await request.json();

    // Connect to database
    await client.connect();

    // Check if user exist
    let insertQuery = "SELECT * FROM users WHERE username = $1";
    let insertParams = [user];
    let res = await client.query(insertQuery, insertParams);

    // If exist then tell user about it
    if (res.rows.length != 0) {
      return json({ message: "User already exists", status: 204 });
    }

    // Create keys
    const keyData = await sha256(`${hashed} + ${user}`);
    const { publicKey, privateKey } = await generateKeys(keyData);

    // Createe cookie
    const uniqueData = await generateUniqueData(user);
    const cookieValue = await sha256(uniqueData);

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

    // Add user to database
    insertQuery =
      "INSERT INTO users (username, password, public_key) VALUES ($1, $2, $3) RETURNING id";
    insertParams = [user, hashed, publicKey];
    res = await client.query(insertQuery, insertParams);
    const user_id = res.rows[0].id;

    // Add cookie value to database
    insertQuery =
      "INSERT INTO cookies (cookie_value, user_id, remember_me) VALUES ($1, $2, $3)";
    insertParams = [cookieValue, user_id, false];
    await client.query(insertQuery, insertParams);

    return json({ message: "User added to database", status: 200 });
  } catch (error) {
    return json({ message: error, status: 201 });
  } finally {
    await client.end();
  }
};
