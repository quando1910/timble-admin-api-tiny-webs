const constructor = require('../core/base/controller')
let { actions, asyncMiddleware, model } = constructor('User')
let { model: AuthModel } = constructor('Auth')


/**
 * Adding new action here
 */

actions.new = asyncMiddleware(async (req, res, next) => {
  const user = {
    email: req.body.email,
    phone: req.body.phone,
    name:  req.body.name,
    birthday: req.body.birthday,
    adminType: 1
  }
  if (req.body.agencyId) {
    user[agencies]= [req.body.agencyId];
  }
  const userRes = await new model(user).save()
  // Do what needs to be done and then:
  const auth = new AuthModel({
    provider: 'email',
    uid: req.body.email,
    password: req.body.password,
    userId: userRes._id,
    avatar: null,
    info: null
  })
  return await AuthModel.saveAuth(auth);
})


moreFunction = {
  aboutMe: asyncMiddleware(async (req, res, next) => {
    let user = await User.findOne({_id: req.user.id});
    let agencies = await User.find({users: req.user.id});
    return {user, agencies}
  }),
  editMe: asyncMiddleware(async (req, res, next) => {
    const user = await model.findByIdAndUpdate({_id: req.user.id}, req.body)
    return user
  }),
  newAdmin: asyncMiddleware(async (req, res, next) => {
    const user = new model({
      email: 'superadmin@timble.vn',
      phone: '0773420210',
      name: 'Do Hong Quan',
      birthday: '19/10/1995',
      adminType: 0
    })
    try {
      const userRes = await user.save()
      // Do what needs to be done and then:
      const auth = new AuthModel({
        provider: 'email',
        uid: 'superadmin@timble.vn',
        password: 'timble123',
        userId: userRes._id,
        avatar: null,
        info: null
      })
      return await AuthModel.saveAuth(auth);
    } catch (err) {
      res.send(err)
    }
  })
}

module.exports = {...actions, ...moreFunction}
