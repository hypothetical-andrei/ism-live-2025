import { MongoClient } from 'mongodb'
const url = 'mongodb://localhost:27017'
const dbName = 'ismv4'

const insertStudent = async function(db, student) {
  try {
    const collection = db.collection('students')
    const result = await collection.insertOne(student)
    return result
  } catch (err) {
    console.log(err.stack)
  }
}

const findStudent = async function(db, name) {
  try {
    const collection = db.collection('students')
    const doc = await collection.findOne({
      name
    })
    return doc
  } catch (err) {
    console.log(err.stack)
  }
}

const updateStudent = async function(db, query, update) {
  try {
    const collection = db.collection('students')
    const result = await collection.updateOne(query, update)
    return result
  } catch (err) {
    console.log(err.stack)
  }
}

const deleteStudent = async function(db, query) {
  try {
    const collection = db.collection('students')
    const result = await collection.deleteOne(query)
    return result
  } catch (err) {
    console.log(err.stack)
  }
}

try {
  const client = await MongoClient.connect(url)
  console.log("Connected successfully to server")
  const db = client.db(dbName)
  let result = await insertStudent(db, {
    name: 'jim jones',
    email: 'jim@nowhere.net',
    grades: [{
      'mathematics': 8,
      'computer programming': 7
    }]
  })
  console.log(result)

  result =  await findStudent(db, 'jim jones')
  console.log(result)

  result = await updateStudent(db, {
      name: 'jim jones'
    }, {
    $set: {
      grades: [{
        'mathematics': 6,
        'computer programming': 6
      }]
    }
  })
  console.log(result)

  result = await findStudent(db, 'jim jones')
  console.log(result)

  result = await deleteStudent(db, { name: 'jim jones' })
  console.log(result)

  result = await findStudent(db, 'jim jones')
  console.log(result)

  client.close()
} catch (err) {
  console.log(err.stack)
}
