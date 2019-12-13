const express = require('express')
const router = express.Router()
const validate = require('express-validation')
// const Validation = require('../lib/Validation')
const controller = require('../controllers/auth.controller')


/* User Login */
router.post('/login', controller.login)

// router.get('/', controller.check)

module.exports = router