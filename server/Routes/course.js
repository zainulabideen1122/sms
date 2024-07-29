const router = require("express").Router()
const courseController = require('../Controller/course')

router.get('/',courseController.getAllCourses)
router.post('/addCourse', courseController.addCourse)
router.get('/getAllSections', courseController.getAllSections)
router.post('/addSectionToCourse', courseController.addSectionToCourse)
router.delete('/deleteCourseSection/:id', courseController.deleteCourseSection)

module.exports = router