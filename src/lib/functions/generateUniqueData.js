export async function generateUniqueData(username) {
  const timestamp = Date.now();
  const randomString = Array.from(crypto.getRandomValues(new Uint8Array(16)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const data = `${username}-${timestamp}-${randomString}`;
  return data;
}
