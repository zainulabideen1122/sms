const express = require('express')

const router = express.Router()
const {Login , Register} = require('../Controller/auth')


router.post('/login', Login)
router.post('/register', Register)
// router.post('/changePasswords', changePassword)

module.exports = router