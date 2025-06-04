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

User.addHook('beforeValidate', (instance) => {
  instance.email = 'secretemail@a.com'
})

try {
  await connection.sync({ force: true })
  await User.create({
    username: 'someuser'
  })
} catch (error) {
  console.warn(error)
} finally {
  if (connection) {
    await connection.close()
  }
}