import { Sequelize, DataTypes, fn, col } from 'sequelize'

// DELIMITER $$
// CREATE PROCEDURE concatenate_with_date(IN str VARCHAR(255), OUT result VARCHAR(255))
// BEGIN
//   SET result = CONCAT(str, ' - ', DATE_FORMAT(NOW(), '%Y-%m-%d'));
// END $$
// DELIMITER ;

const connection = new Sequelize({
  dialect: 'mysql',
  database: 'test',
  username: 'root',
  password: 'root',
  host: 'localhost'
})


try {
  const sp = 'CALL concatenate_with_date(?, @result)'
  const input = 'Hello, world!'

  // Execute the stored procedure call
  await connection.query(sp, { replacements: [input], type: connection.QueryTypes.RAW })
  const result = await connection.query('SELECT @result AS result', { plain: true })

  console.log('Result:', result.result)
} catch (error) {
  console.warn(error)  
}
