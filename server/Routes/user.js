const express = require('express')
const router = express.Router()
const {getAllUsers, getAllTeachers, deleteTeacher, addTeacher, editTeacher, getAllStudents, deleteStudent, addStudent, editStudent} = require('../Controller/user')

const teacherRouter = require('../Controller/teacher')
const studentRouter = require('../Controller/student')
const verifyRoles = require('../middleware/verifyRoles')

//all users
router.get('/getAllUsers',verifyRoles('Admin'), getAllUsers)

//teacher routers
router.get('/getAllTeachers',verifyRoles('Admin'), teacherRouter.getAllTeachers)
router.delete('/deleteTeacher/:id',verifyRoles('Admin'),teacherRouter.deleteTeacher)
router.post('/addTeacher',verifyRoles('Admin'), teacherRouter.addTeacher)
router.post('/editTeacher/:id', verifyRoles('Admin', 'Teacher'),teacherRouter.updateTeacher)
router.post('/addTeacherToSection', verifyRoles('Admin'),teacherRouter.addTeacherToSection)
router.get('/unAssignTeacherFromSection/:id', verifyRoles('Admin'),teacherRouter.unAssignTeacher)
router.post('/getTeacherCoursesAndSections', verifyRoles('Teacher'),teacherRouter.getTeacherCoursesAndSections)
router.post('/getAttendanceList',verifyRoles('Admin', 'Teacher', 'Student'), teacherRouter.getAttendanceList)

// student routers
router.get('/getAllStudents',verifyRoles('Admin', 'Teacher'), studentRouter.getAllStudents)
router.get('/getStudent/:email', verifyRoles('Admin', 'Student'), studentRouter.getStudent)
router.delete('/deleteStudent/:id',verifyRoles('Admin'), studentRouter.deleteStudent)
router.post('/addStudent',verifyRoles('Admin'), studentRouter.addStudent)
router.post('/editStudent/:id',verifyRoles('Admin', 'Student'), studentRouter.updateStudent)
router.post('/addStudentToSection',verifyRoles('Admin', 'Student'), studentRouter.addStudentToCourseSection)
router.post('/enrollStudentToCourses', verifyRoles('Student'), studentRouter.enrollStudentToCourses)
router.post('/addStudentsToSection',verifyRoles('Admin'), studentRouter.addStudentsToCourseSection)
router.post('/unrollStudenFromSection',verifyRoles('Admin','Student'), studentRouter.unrollStudenFromSection)
router.post('/getStudentCoursesAndSections',verifyRoles('Student'), studentRouter.getStudentCoursesAndSections)
// router.post('/getStudentRegisterCourses', verifyRoles('Student'), studentRouter)

module.exports = router;