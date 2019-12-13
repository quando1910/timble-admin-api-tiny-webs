// External Dependancies
const mongoose = require('mongoose')
var bcrypt = require('bcrypt')

const AuthSchema = new mongoose.Schema({
  provider: String,
  uid: {
    type: String,
    unique: true
  },
  password:  {
    type: String, bcrypt: true
  },
  accessToken: String,
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  avatar: {
    type: String
  },
  info: {
    type: Object
  },
  createdAt: { 
    type: Date, required: true, default: Date.now 
  },
  updatedAt: { type: Date }
})

module.exports = Auth = mongoose.model('Auth', AuthSchema)

AuthSchema.pre('save', function(next) {
  this.updated_at = Date.now()
  next();
})

module.exports.saveAuth = async auth => {
  if (auth.password) {
    const hash = await bcrypt.hash(auth.password, 10)
    auth.password = hash
    return await auth.save()
  } else {
    return null
  }
}

module.exports.comparePassword = async (candidatePassword, hash) => {
  return await bcrypt.compare(candidatePassword, hash)
}
