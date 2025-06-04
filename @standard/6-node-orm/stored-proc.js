import { Sequelize, DataTypes, fn, col } from 'sequelize'

// Create the sequelize object
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app1',
  password: 'welcome123',
  database: 'ismv4'
})


// DELIMITER $$
// CREATE PROCEDURE concatenate_with_date(IN str VARCHAR(255), OUT result VARCHAR(255))
// BEGIN
//   SET result = CONCAT(str, ' - ', DATE_FORMAT(NOW(), '%Y-%m-%d'));
// END $$
// DELIMITER ;

// Declare the stored procedure
try {

const sp = 'CALL concatenate_with_date(?, @result)'
const input = 'Hello, world!'

// Execute the stored procedure call
await sequelize.query(sp, { replacements: [input], type: sequelize.QueryTypes.RAW })
const result = await sequelize.query('SELECT @result AS result', { plain: true })

console.log('Result:', result.result)
} catch (error) {
  console.warn(error)  
}
