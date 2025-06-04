import mongoose from 'mongoose'
import crypto from 'crypto'
const algorithm = 'aes-256-ctr'
const secretKey = 'supersecret'

// Define the schema
const secretsSchema = new mongoose.Schema({
  encryptedContent: {
    type: String,
    required: true
  }
})

// Define the encryption hook for 'save' event
secretsSchema.pre('save', function (next) {
  const cipher = crypto.createCipher(algorithm, secretKey)
  let encrypted = cipher.update(this.encryptedContent, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  this.encryptedContent = encrypted
  next()
})

// Define the decryption hook for 'find' event
secretsSchema.post('find', function (docs, next) {
  const decipher = crypto.createDecipher(algorithm, secretKey)
  docs.forEach((doc) => {
    let decrypted = decipher.update(doc.encryptedContent, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    doc.encryptedContent = decrypted
  })
  next()
})

// Create the model
const Secret = mongoose.model('Secrets', secretsSchema)

try {
  await mongoose.connect('mongodb://localhost:27017/ismv4')
  const secret = new Secret({
    encryptedContent: 'somecontent'
  })
  await secret.save()
  const secrets = await Secret.find({})
  console.log(secrets)
  await mongoose.disconnect()
} catch (error) {
  console.log(error)
}