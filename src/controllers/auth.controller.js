var mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const constructor = require('../core/base/controller')
const APIError = require('../lib/apiError');
let { asyncMiddleware, model } = constructor('Auth')
let { model: User } = constructor('User')

module.exports = {
  login: asyncMiddleware(async (req, res, next) => {
    if (!req.body.uid || !req.body.password) {
      const e = new APIError(404, 'Error. Please enter the correct username and password')
      throw e
    } else {
      const authRecord = await model.findOne({uid: req.body.uid})
      if (authRecord) {
        const compared = await model.comparePassword(req.body.password, authRecord.password)
        if (compared) {
          const user = await User.findOne({_id: authRecord.userId})
          const token = jwt.sign({
            id: user._id,
            email: user.email,
            adminType: user.adminType
          }, 'timblekey');
          return { access_token: token }
        }
        else {
          const e = new APIError(401, 'Password or Email is incorrect')
          throw e
        }
      } else {
        const e = new APIError(401, 'Password or Email is incorrect')
        throw e
      }
    }
  }),
  logout: async (req, res, next) => {
    const user = model.find((u) => {
      return u.username === req.body.username && u.password === req.body.password;
    });
    const token = ''
    return {access_token: token}
  }
}
