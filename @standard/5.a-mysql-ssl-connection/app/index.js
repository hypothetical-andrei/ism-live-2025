import mysql from 'mysql2/promise';
import fs from 'fs/promises';

const connection = await mysql.createConnection({
  host: 'localhost',
  user: 'ssluser',
  password: 'sslpass',
  database: 'testdb',
  port: 3306,
  ssl: {
    ca: await fs.readFile('../certs/ca.pem'),
    cert: await fs.readFile('../certs/client-cert.pem'),
    key: await fs.readFile('../certs/client-key.pem'),
  }
});

const [rows] = await connection.query('SELECT NOW() AS now');
console.log('Connected! Time is:', rows[0].now);
await connection.end();
