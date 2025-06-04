import Sequelize from 'sequelize'

const connection = new Sequelize({
  dialect: 'mysql',
  database: 'test',
  username: 'root',
  password: 'root',
  host: 'localhost'
})

const User = connection.define('user', {
  username: Sequelize.STRING(20),
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: true
    }
  }
}, {
  timestamps: false
})

try {
  await connection.sync({ force: true })
} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.close()
  }
}