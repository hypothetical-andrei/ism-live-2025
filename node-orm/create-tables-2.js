import Sequelize from 'sequelize'

const connection = new Sequelize({
  dialect: 'mysql',
  database: 'test',
  username: 'root',
  password: 'root',
  host: 'localhost'
})

const Student = connection.define('student', {
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
  await connection.sync({ force: true })
  let student = new Student({
    firstName: 'aaa',
    lastName: 'aaa',
    phone: '+40123456789',
    email: 'aaa@b.com'
  })
  await student.save()
  student = new Student({
    firstName: 'aaa',
    lastName: 'aaa',
    phone: '+40123456789',
    email: 'aaa@b.com'
  })
  await student.save()
  console.log('created')
} catch (error) {
  console.warn(error)  
} finally {
  connection.close()
}
