import Sequelize from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app1',
  password: 'welcome123',
  database: 'ismv4'
})

const Author = sequelize.define('author', {
	name: Sequelize.STRING,
	email: Sequelize.STRING
})

try {
  // won't do anything if the table already exists
  // can be circumvented with {force: true}
  await sequelize.sync()
  console.log('created')
} catch (error) {
  console.warn(error)  
} finally {
  sequelize.close()
}
