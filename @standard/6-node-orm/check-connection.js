import Sequelize from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '172.18.0.2',
  username: 'app1',
  password: 'welcome123',
  database: 'ism_v4'
})

try {
  await sequelize.authenticate()
  console.log('we are connected')
} catch (error) {
  console.warn(error)  
} finally {
  await sequelize.close()
}