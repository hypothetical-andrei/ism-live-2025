import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: String,
  lastName: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

userSchema.pre('save', function(next) {
  if (this.firstName === 'John') {
    throw new Error('John is not allowed')
  } else {
    next()
  }
})

const User = mongoose.model('User', userSchema)

await mongoose.connect('mongodb://localhost:27017/ismv4')

const user = new User({ firstName: 'John', lastName: 'Doe' })
await user.save()

await mongoose.disconnect()