const express = require('express')
const router = express.Router()
const {getAllRoles, getUserPermissions, getUserRole, updateUserRole, addRole} = require('../Controller/role')

router.get('/roles', getAllRoles)
router.get('/getUserRole/:id', getUserRole)
router.post('/updateUserRole/:id', updateUserRole)
router.post('/addRole', addRole)


module.exports = router