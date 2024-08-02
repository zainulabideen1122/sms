const router = require("express").Router()
const attendanceController = require('../Controller/academic')
const marksController = require('../Controller/academic')

//attendance routes
router.post('/markAttendance', attendanceController.markStudentsAttendance)
router.get('/getStudentsAttendance/:id', attendanceController.getStudentsAttendance)

//marks routes

//teachers
router.get('/marks/getStudentsList/:id', marksController.getStudentsMarksList)
router.post('/getStudentMarks', marksController.getStudentDetails)
router.post('/addStudentMarks', marksController.addStudentMarks)
router.post('/addMarks', marksController.getStudentsMarksList)
router.post('/updateMarks', marksController.getStudentsMarksList)
router.post('/updateMarksSection', marksController.updateStudentMarksSection)

//students
router.post('/student/getStudentMarks', marksController.getStudentMarks)

module.exports = router