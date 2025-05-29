import fs from 'fs'
import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
  user: 'app1',
  password: 'welcome123',
  database: 'ismv4',
  ssl: {
    key: fs.readFileSync('./certs/client-key.pem'),
    cert: fs.readFileSync('./certs/client-cert.pem'),
    ca: fs.readFileSync('./certs/ca.pem')
  }
});

let results = await connection.query('SELECT 1+1 as test1');
console.log(results[0])