import { MongoClient } from 'mongodb';
import Joi from 'joi';

const uri = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'users';

const usernameInput = process.argv[2];
const passwordInput = process.argv[3];
// assumed input: node nosql-joi.js alice apple123
// hostile input: node nosql-joi.js '{ "$ne": null }' '{ "$ne": null }'

if (!usernameInput || !passwordInput) {
  console.error("Usage: node nosql_safe_login_joi.js <username> <password>");
  process.exit(1);
}

// ✅ Define schema
const schema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(3).max(50).required()
});

// ✅ Validate input
const { error, value } = schema.validate({
  username: usernameInput,
  password: passwordInput
});

if (error) {
  console.error("❌ Invalid input:", error.message);
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

// Safe query using validated strings
const query = {
  name: value.username,
  password: value.password
};

console.log("🔍 Running query:", query);

const user = await users.findOne(query);

if (user) {
  console.log("✅ Login successful:", user.name);
} else {
  console.log("❌ Login failed");
}

await client.close();
