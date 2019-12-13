const constructor = require('../core/base/controller')
let { actions, model, asyncMiddleware } = constructor('Agency')

/**
 * Adding new action here
 */

moreFunction = {
  handleYourSelf: asyncMiddleware(async (req, res, next) => {
    if (+req.user.adminType === 0) {
      next()
    } else if (+req.user.adminType === 1) {
      const agency = await model.findOne({_id: req.params.id, users: req.user.id})
      if(agency) {
        next()
      }
    } else {
      const e = new APIError(403, 'This user do not have permission!')
      throw e
    }
  })
}

module.exports = {...actions, ...moreFunction}
