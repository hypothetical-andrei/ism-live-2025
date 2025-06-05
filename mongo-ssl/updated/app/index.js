import { MongoClient } from "mongodb";
import fs from "fs";

// const ca = fs.readFileSync("../certs/ca.pem");

const uri = "mongodb://ssluser:sslpass@localhost:27017/?tls=true&authSource=admin";

const client = new MongoClient(uri, {
  tlsCAFile: "../certs/ca.pem",
});

try {
  console.group('Trying to connect')
  await client.connect();
  console.log("✅ Connected successfully over SSL!");
  const dbs = await client.db().admin().listDatabases();
  console.log("📦 Databases:", dbs.databases.map(db => db.name));
} catch (err) {
  console.error("❌ Connection error:", err);
} finally {
  await client.close();
}
