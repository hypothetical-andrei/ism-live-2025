import mongoose from 'mongoose'
const Schema = mongoose.Schema

const UserSchema = new Schema({
  firstName: String,
  lastName: String
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
})

UserSchema.virtual('tags', {
  ref: 'Tag',
  localField: '_id',
  foreignField: 'forResource',
  justOne: false
})

const TagSchema = new mongoose.Schema({
  forResource: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'onModel'
  },
  tagName: String
}, {
  timestamps: true
})


const User = mongoose.model('User', UserSchema)
const Tag = mongoose.model('Tag', TagSchema)

await mongoose.connect('mongodb://localhost:27017/ismv4')

let user = new User({
  firstName: 'John',
  lastName: 'Smith'
})
await user.save()

const tag = new Tag({
  tagName: 'special',
  forResource: user
})
await tag.save()

user = await User.findById(user._id).populate({ path: 'tags' }).lean()
console.log(user)

await mongoose.disconnect()