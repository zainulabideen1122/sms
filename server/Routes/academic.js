const router = require("express").Router()
const attendanceController = require('../Controller/academic')
const marksController = require('../Controller/academic')

//attendance routes
router.post('/markAttendance', attendanceController.markStudentsAttendance)
router.get('/getStudentsAttendance/:id', attendanceController.getStudentsAttendance)

//marks routes
router.get('/marks/getStudentsList/:id', marksController.getStudentsMarksList)
router.post('/getStudentMarks', marksController.getStudentMarks)
router.post('/addStudentMarks', marksController.addStudentMarks)
router.post('/addMarks', marksController.getStudentsMarksList)
router.post('/updateMarks', marksController.getStudentsMarksList)
router.post('/updateMarksSection', marksController.updateStudentMarksSection)

module.exports = router