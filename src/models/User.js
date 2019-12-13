// External Dependancies
const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  phone: {
    type: String,
    default: ''
  },
  birthday: {
    type: String
  },
  agencies:[
    { type: mongoose.Schema.Types.ObjectId, ref: 'Agency' }
  ],
  adminType: {
    type: Number
  },
  createdAt: { 
    type: Date, required: true, default: Date.now 
  },
  updatedAt: { type: Date }
})

module.exports = User = mongoose.model('User', UserSchema)

UserSchema.pre('save', function(next) {
  this.updated_at = Date.now()
  next();
})

module.exports.aboutMe = async function(id) {
  let user = await User.aggregate([
    {
      $lookup: {
        from: 'agencies',
        localField: `agencies._id`,
        foreignField: '_id',
        as: `agenciesInfo`
      }
    },
    { 
      $match : {
        _id: mongoose.Types.ObjectId(id)
      }
    }
  ])
  return user[0]
}
