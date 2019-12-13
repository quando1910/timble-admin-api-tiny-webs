module.exports = (model) => {
  // External Dependancies
  const asyncMiddleware = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next))
      .then(data => {
        if (data) {
          res.send(data)
        }
      })
      .catch(next => {
        return res.status(next.status).json({
          message: next.message
        });
      })
  }
  // Get Data Models
  let obj = {};
  obj[model] = require(`../../models/${model}`)
  
  return {
    model: obj[model],
    asyncMiddleware: asyncMiddleware,
    actions: {
      test: asyncMiddleware(async (req, res, next) => {
        return `${model} works`
      }),
      index: asyncMiddleware(async (req, res, next) => {
        let cond = {}
        if (req.headers['agency-id']) {
          cond = { agency_id: req.headers['agency-id'] }
        } else if (req.info.team_id) {
          cond = { agency_id: req.info.team_id }
        }
        const queryCond = req.query
        cond = {...cond, ...queryCond}
        const cars = await obj[model].find(cond)
        return cars
      }),
      show: asyncMiddleware(async (req, res, next) => {
        const id = req.params.id
        const car = await obj[model].findById(id)
        return car
      }),
      new: asyncMiddleware(async (req, res, next) => {
        const objectModel = obj[model]
        let ownerInfo = {
          agency_id: req.info.team_id,
          user_id: req.user.id
        }
        let payload = { ...req.body, ...ownerInfo }
        const item = new objectModel(payload)
        return item.save()
      }),
      update: asyncMiddleware(async (req, res, next) => {
        const id = req.params.id
        const car = req.body
        const { ...updateData } = car
        return await obj[model].findOneAndUpdate({ _id: id }, updateData)
      }),
      upsert: asyncMiddleware(async (req, res, next) => {
        const id = req.params.id
        const car = req.body
        const { ...updateData } = car
        console.log(await obj[model].findOneAndUpdate({ _id: id, agency_id: req.info.team_id }, updateData, { new: true }))
        return await obj[model].findOneAndUpdate({ _id: id, agency_id: req.info.team_id }, updateData, { new: true })
      }),
      delete: asyncMiddleware(async (req, res, next) => {
        const id = req.params.id
        return await obj[model].findOneAndRemove({ _id: id, agency_id: req.info.team_id })
      })
    }
  }
}
