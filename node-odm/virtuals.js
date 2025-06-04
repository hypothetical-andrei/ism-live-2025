import mongoose from 'mongoose'
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: String,
  lastName: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

userSchema.virtual('fullName').get(function () {
  return this.firstName + ' ' + this.lastName
})

const User = mongoose.model('User', userSchema)

await mongoose.connect('mongodb://localhost:27017/ismv4')

const user = new User({ firstName: 'John', lastName: 'Doe' })
await user.save()
console.log(user.fullName) 

await mongoose.disconnect()