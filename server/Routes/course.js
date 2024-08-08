const router = require("express").Router()
const courseController = require('../Controller/course')
const verifyRoles = require('../middleware/verifyRoles')

router.get('/',verifyRoles('Admin'),courseController.getAllCourses)
router.post('/addCourse',verifyRoles('Admin'), courseController.addCourse)
router.get('/getAllSections',verifyRoles('Admin'), courseController.getAllSections)
router.post('/addSectionToCourse',verifyRoles('Admin'), courseController.addSectionToCourse)
router.delete('/deleteCourseSection/:id',verifyRoles('Admin'), courseController.deleteCourseSection)

router.get('/getAllOfferedCourses', verifyRoles('Admin'), courseController.getOfferedCourses)
router.get('/getAllStudentCourse', verifyRoles('Admin', 'Student'), courseController.getAllStudentSection)
router.post('/offerCourse', verifyRoles('Admin'), courseController.offerCourse)
router.post('/updateOfferedCourse', courseController.updateOfferedCourses)
router.post('/getStudentOfferedCourses', courseController.getStudentOfferedCourses)


module.exports = router