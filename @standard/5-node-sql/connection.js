// structure
// CREATE TABLE students (
//   id INT AUTO_INCREMENT PRIMARY KEY,
//   first_name VARCHAR(255) NOT NULL,
//   last_name VARCHAR(255) NOT NULL,
//   telephone VARCHAR(20) NOT NULL,
//   email VARCHAR(255) NOT NULL UNIQUE
// );


// get the client
import mysql from 'mysql2/promise'

// create the connection to database
const connection = await mysql.createConnection({
  host: '127.0.0.1',
  database: 'midgard',
  user: 'root',
  password: 'root'
})

const [rows, fields] = await connection.query('select * from students')

console.warn(rows)

await connection.destroy()