const router = require("express").Router()
const courseController = require('../Controller/course')
const verifyRoles = require('../middleware/verifyRoles')

router.get('/',verifyRoles('Admin'),courseController.getAllCourses)
router.post('/addCourse',verifyRoles('Admin'), courseController.addCourse)
router.get('/getAllSections',verifyRoles('Admin'), courseController.getAllSections)
router.post('/addSectionToCourse',verifyRoles('Admin'), courseController.addSectionToCourse)
router.delete('/deleteCourseSection/:id',verifyRoles('Admin'), courseController.deleteCourseSection)

module.exports = router