// structure
// CREATE TABLE students1 (
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
  database: 'conn_db',
  user: 'root',
  password: 'root',
})

let [rows, _] = await connection.query('insert into students (first_name, last_name, telephone, email) value ("jane", "smith", "222-222", "jane4@etc.com")');

console.warn(rows);

[rows, _] = await connection.query('update students set email = "j@etc.com" where email="jane4@etc.com" ');

console.warn(rows);

[rows, _] = await connection.query('select * from students')

console.warn(rows);

[rows, _] = await connection.query('delete from students where email="j@etc.com" ');

console.warn(rows)

await connection.destroy( )
