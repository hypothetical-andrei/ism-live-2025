import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'users';

const usernameInput = process.argv[2];
const passwordInput = process.argv[3];
// assumed input: node nosql-noparse.js alice apple123
// hostile input: node nosql-noparse.js '{ "$ne": null }' '{ "$ne": null }'

if (!usernameInput || !passwordInput) {
  console.error("Usage: node nosql_safe_login.js <username> <password>");
  process.exit(1);
}

const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
const db = client.db(dbName);
const users = db.collection(collectionName);

// Ensure test user exists
const existing = await users.findOne({ name: 'alice' });
if (!existing) {
  await users.insertOne({ name: 'alice', password: 'apple123' });
  console.log("✅ Inserted test user: alice / apple123");
}

// ✅ Secure version: always treat input as strings
const query = {
  name: String(usernameInput),
  password: String(passwordInput)
};

console.log("🔍 Running query:", query);

const user = await users.findOne(query);

if (user) {
  console.log("✅ Login successful:", user.name);
} else {
  console.log("❌ Login failed");
}

await client.close();
