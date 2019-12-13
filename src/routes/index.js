// Import routes

const agencyRoutes = require('./agency.routes')
const authRoutes = require('./auth.routes')
const userRoutes = require('./user.routes')

const express = require('express')
const router = express.Router()

const appCtrl = require('../controllers/app.controller')
const userController = require(`../controllers/user.controller`)
const expressjwt = require('express-jwt')

const jwtCheck = expressjwt({
  secret: 'timblekey'
});

/** GET / - Check service health */
router.get('/api', (req, res) =>
  res.send('Congratulation! API Works!!!!!!!!!!')
)

router.get('/api/checkLogin', jwtCheck, (req, res) =>
  res.status(200).send('Login Successful')
)

router.use('/api/auth', authRoutes)
router.use('/api/users', jwtCheck, userRoutes)
router.use('/api/agencys', jwtCheck, agencyRoutes)

// /* Create an admin timble. */
router.post('/api/admins', userController.newAdmin)

module.exports = router
