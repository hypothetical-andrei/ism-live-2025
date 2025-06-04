import Sequelize from 'sequelize'

const sequelize = new Sequelize({
  dialect: 'mysql',
  host: 'localhost',
  username: 'app1',
  password: 'welcome123',
  database: 'ismv4'
})

const Student = sequelize.define('student', {
	firstName: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'first_name'
  },
	lastName: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'last_name'
  },
  phone: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'telephone',
    validate: {
      is: /^\+40\d{9}$/
    }
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    field: 'email',
    unique: true,
    validate: {
      isEmail: true
    }
  }
}, {
  tableName: 'students',
  timestamps: false
})

try {
  // won't do anything if the table already exists
  // can be circumvented with {force: true}
  await sequelize.sync({ force: true })
  console.log('created')
} catch (error) {
  console.warn(error)  
} finally {
  sequelize.close()
}
