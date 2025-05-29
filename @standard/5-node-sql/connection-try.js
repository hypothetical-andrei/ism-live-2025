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
let connection
try {
  connection = await mysql.createConnection({
    host: 'localhost',
    // host: '172.18.0.2',
    database: 'role_examples',
    user: 'user2',
    password: 'ism'
  })
  console.warn('connected')
} catch (error) {
  console.warn(error)
} finally {  
  if (connection) {
    await connection.destroy()
  }
}