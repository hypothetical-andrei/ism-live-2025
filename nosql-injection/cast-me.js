import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'users';

const usernameInput = process.argv[2];
const passwordInput = process.argv[3];
// assumed input: node nosql-cast.js alice apple123
// hostile input: node nosql-cast.js '{ "$ne": null }' '{ "$ne": null }'

if (!usernameInput || !passwordInput) {
  console.error("Usage: node nosql_safe_login_cast.js <username> <password>");
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

// ✅ Cast user input to strings before using in the query
const query = {
  name: `${usernameInput}`,
  password: `${passwordInput}`
};

console.log("🔍 Running query:", query);

const user = await users.findOne(query);

if (user) {
  console.log("✅ Login successful:", user.name);
} else {
  console.log("❌ Login failed");
}

await client.close();
