const router = require("express").Router()
const attendanceController = require('../Controller/academic')

router.post('/markAttendance', attendanceController.markStudentsAttendance)


module.exports = router