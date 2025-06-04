import { MongoClient } from 'mongodb'

const url = 'mongodb://localhost:27017'
const dbName = 'ism'

let client

try {
  client = await MongoClient.connect(url)
  console.log("Connected successfully to server")
  const db = client.db(dbName)
} catch (err) {
  console.log(err.stack)
} finally {
	if (client) {
		client.close()
	}
}
