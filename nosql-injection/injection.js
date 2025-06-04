import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017';
const dbName = 'test';
const collectionName = 'users';

const usernameInput = process.argv[2];
const passwordInput = process.argv[3];

const client = await MongoClient.connect(uri, { useUnifiedTopology: true });
const db = client.db(dbName);
const users = db.collection(collectionName);

const existing = await users.findOne({ name: 'alice' });

if (!existing) {
	await users.insertOne({ name: 'alice', password: 'apple123' });
}

// assumed input: node nosql-injection.js alice apple123
// hostile input: node nosql-injection.js '{ "$ne": null }' '{ "$ne": null }'

let query;
try {
  query = {
    name: JSON.parse(usernameInput),
    password: JSON.parse(passwordInput)
  };
} catch {
  // fallback: treat as string
  query = {
    name: usernameInput,
    password: passwordInput
  };
}

const user = await users.findOne(query);

console.log(user)

await client.close();
