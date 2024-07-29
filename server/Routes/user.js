const express = require('express')
const router = express.Router()
const {getAllUsers, getAllTeachers, deleteTeacher, addTeacher, editTeacher, getAllStudents, deleteStudent, addStudent, editStudent} = require('../Controller/user')

const teacherRouter = require('../Controller/teacher')
const studentRouter = require('../Controller/student')

//all users
router.get('/getAllUsers', getAllUsers)

//teacher routers
router.get('/getAllTeachers', teacherRouter.getAllTeachers)
router.delete('/deleteTeacher/:id', teacherRouter.deleteTeacher)
router.post('/addTeacher', teacherRouter.addTeacher)
router.post('/editTeacher/:id', teacherRouter.updateTeacher)
router.post('/addTeacherToSection', teacherRouter.addTeacherToSection)
router.get('/unAssignTeacherFromSection/:id', teacherRouter.unAssignTeacher)

// student routers
router.get('/getAllStudents', studentRouter.getAllStudents)
router.delete('/deleteStudent/:id', studentRouter.deleteStudent)
router.post('/addStudent', studentRouter.addStudent)
router.post('/editStudent/:id', studentRouter.updateStudent)
router.post('/addStudentToSection', studentRouter.addStudentToCourseSection)
router.post('/addStudentsToSection', studentRouter.addStudentsToCourseSection)
router.post('/unrollStudenFromSection', studentRouter.unrollStudenFromSection)

module.exports = router;