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
  host: 'localhost',
  database: 'ismv4',
  user: 'app1',
  password: 'welcome123'
})

await connection.execute('insert into students (first_name, last_name, telephone, email) values (?, ?, ?, ?)', ['clara', 'smith', '111', 'clara@etc.com'])

let [rows, fields] = await connection.query('select * from students')

console.warn(rows)

await connection.execute('delete from students where first_name = ?', ['clara']);

[rows, fields] = await connection.query('select * from students')

console.warn(rows)

await connection.destroy( )