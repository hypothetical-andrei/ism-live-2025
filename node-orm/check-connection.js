import Sequelize from 'sequelize'

const connection = new Sequelize({
  dialect: 'mysql',
  database: 'test',
  username: 'root',
  password: 'root',
  host: 'localhost'
})

try {
  await connection.authenticate()
  console.log('we are connected')
} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.close()
  }
}