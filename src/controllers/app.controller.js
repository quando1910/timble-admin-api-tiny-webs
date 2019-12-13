var mongoose = require('mongoose')
const constructor = require('../core/base/controller')
let { asyncMiddleware, model } = constructor('User')
const APIError = require('../lib/apiError')

module.exports = {
  check: async (req, res, next) =>  {
    try {
      const user = await model.findOne({_id: req.user.id})
      if (user.agencies.length > 0) {
        const team = user.agencies.filter(x => x.default === true)[0]
        req.info = {team_id: team._id, web: team.web, role: team.role};
        console.log('Auth is OK')
        next()
      }
    } catch (e) {
      res.send(e)
    }
  },
  checkSuperAdminRole: asyncMiddleware(async (req, res, next) =>  {
    if (+req.user.adminType === 0) {
      next()
    } else {
      const e = new APIError(403, 'This user do not have permission!')
      throw e
    }
  })
}
