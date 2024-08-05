const express = require('express')
const router = express.Router()
const verifyRoles = require('../middleware/verifyRoles')
const {getAllRoles, getUserPermissions, getUserRole, updateUserRole, addRole} = require('../Controller/role')

router.get('/roles',verifyRoles('Admin'), getAllRoles)
router.get('/getUserRole/:id',verifyRoles('Admin'), getUserRole)
router.post('/updateUserRole/:id',verifyRoles('Admin'), updateUserRole)
router.post('/addRole',verifyRoles('Admin'), addRole)


module.exports = router