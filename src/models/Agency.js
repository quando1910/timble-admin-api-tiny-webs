// External Dependancies
const mongoose = require('mongoose')

const AgencySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  desc: String,
  domain: String,
  avatar: String,
  phone: Number,
  address: String,
  firebaseConfig: Object,
  public: {
    type: Boolean,
    default: true
  },
  expireDate: {
    type: Date
  },
  users: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  createdAt: { 
    type: Date, required: true, default: Date.now 
  },
  updatedAt: { 
    type: Date 
  }
})

module.exports = mongoose.model('Agency', AgencySchema)

AgencySchema.pre('save', function(next) {
  this.updated_at = Date.now()
  next();
})
