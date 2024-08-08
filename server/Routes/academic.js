const router = require("express").Router()
const verifyRoles = require('../middleware/verifyRoles')
const attendanceController = require('../Controller/academic')
const marksController = require('../Controller/academic')

//attendance routes
router.post('/markAttendance', attendanceController.markStudentsAttendance)
router.get('/getStudentsAttendance/:id', verifyRoles('Teacher'), attendanceController.getStudentsAttendance)
router.post('/getStudentAttendance', verifyRoles('Student'), attendanceController.getStudentAttendance)
//marks routes
 
//teachers
router.get('/marks/getStudentsList/:id', marksController.getStudentsMarksList)
router.post('/getStudentMarks',verifyRoles('Teacher'), marksController.getStudentDetails)
router.post('/addStudentMarks', marksController.addStudentMarks)
router.post('/addMarks', marksController.getStudentsMarksList)
router.post('/updateMarks', marksController.getStudentsMarksList)
router.post('/updateMarksSection', marksController.updateStudentMarksSection)

//students
router.post('/student/getStudentMarks',verifyRoles('Student'), marksController.getStudentMarks)
router.get('/student/getStudentAllAttendance/:email', verifyRoles('Student'), attendanceController.getStudentAllAttendances)
module.exports = router