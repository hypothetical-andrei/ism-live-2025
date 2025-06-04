// TODO: not working on 23
import mongoose from 'mongoose'
import crypto from 'crypto'
const algorithm = 'aes-256-cbc'
// const secretKey = 'supersecret'

const secretsSchema = new mongoose.Schema({
  encryptedContent: {
    type: String,
    required: true
  }
})

const secretKey = Buffer.from(crypto.randomBytes(32))

secretsSchema.pre('save', function (next) {
  const cipher = crypto.createCipheriv(algorithm, secretKey, crypto.randomBytes(16))
  let encrypted = cipher.update(this.encryptedContent, 'utf8', 'hex')
  encrypted += cipher.final('hex')
  this.encryptedContent = encrypted
  next()
})

secretsSchema.post('find', function (docs, next) {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, crypto.randomBytes(16))
  docs.forEach((doc) => {
    let decrypted = decipher.update(doc.encryptedContent, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    doc.encryptedContent = decrypted
  })
  next()
})

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