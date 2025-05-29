import mysql from 'mysql2/promise'

// DELIMITER $$
// CREATE PROCEDURE concatenate_with_date(IN str VARCHAR(255), OUT result VARCHAR(255))
// BEGIN
//   SET result = CONCAT(str, ' - ', DATE_FORMAT(NOW(), '%Y-%m-%d'));
// END $$
// DELIMITER ;

// create the connection to database
const connection = await mysql.createConnection({
	host: '127.0.0.1',
  database: 'conn_db',
  user: 'root',
  password: 'root'
})

const inputString = 'Hello'

await connection.query('CALL concatenate_with_date(?, @output)', [inputString])

const [rows] = await connection.query('SELECT @output AS result')

console.log('Result: ', rows[0].result)
