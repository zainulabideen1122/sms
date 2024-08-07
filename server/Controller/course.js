const { where } = require('sequelize')
const db = require('../models')

const Course = db.Course

const addCourse = async(req, res)=>{
    const {CODE, NAME, DEPARTMENT} = req.body
    const course = await Course.findAll({
        where : {CODE : CODE}
    })

    if(course.length > 0)
    {
        return res.status(200).json({msg:"Course Already Exists!", course:course})
    }
    else
    {
        const course = await Course.create({
            CODE:CODE,
            NAME : NAME,
            DEPARTMENT : DEPARTMENT
        })
        getAllCourses(req, res)
    }
}

const getAllCourses = async(req, res)=>{
    const courses = await Course.findAll({
        include : {
            model : db.Section,
            order : [ ['NAME', 'ASC'] ],
            separate: true,
            include : [
                {
                    model : db.Student,
                    include : {
                        model : db.User
                    }
                },
                {
                    model : db.Teacher,
                    include : {
                        model : db.User
                    }
                }
            ]
        }
    })
    return res.status(200).json(courses)
}

const getAllSections = async(req, res)=>{
    const sections = await db.Section.findAll({
        include : {
            model : db.Student,
            include : {
                model : db.User
            }
        }
    })
    return res.status(200).json(sections)
}

const addSectionToCourse = async(req, res)=>{
    const {courseID, NAME} = req.body;
    console.log(courseID, NAME)
    const course = await Course.findByPk(courseID)
    const section = await course.createSection({
        NAME : NAME,
    })
    getAllCourses(req, res)
}

const deleteCourseSection = async(req, res)=>{
    const {id} = req.params
    try {
        await db.sequalize.transaction(async transaction=>{
            await db.StudentSection.destroy({
                where : {SECTION_ID: id}
            },{transaction})

            await db.Section.destroy({
                where : {ID: id}
            },{transaction})
        })
        getAllCourses(req, res)
    } catch (error) {
        throw error
    }
}

const offerCourse = async(req, res)=>{
    const {courseID, allowed_students} = req.body

    let course = await db.OfferCourses.findOne({
        where : {COURSE_ID : courseID}
    })

    if(!course)
    {
        course = await db.OfferCourses.create({
            STATUS: 'Active',
            COURSE_ID: courseID,
            ALLOWED: allowed_students
        })

        return res.status(200).json(course)
    }else{
        return res.status(500).send('For update, Go to offer Courses page!')
    }
}

const getOfferedCourses = async(req, res)=>{
    const offeredCourses = await db.OfferCourses.findAll({
        include:{
            model : db.Course
        }
    })

    return res.status(200).json(offeredCourses)
}

const updateOfferedCourses = async(req, res)=>{
    const {courseID, allowed_students, status} = req.body
    console.log(req.body)
    const course = await db.OfferCourses.findOne({
        where: {COURSE_ID: courseID}
    })

    if(course)
    {
        course.ALLOWED = allowed_students
        if(course.STATUS !== status)
        {
            course.STATUS = status
        }
        await course.save()

        const offeredCourses = await db.OfferCourses.findAll({
            include:{
                model : db.Course
            }
        })
    
        return res.status(200).json(offeredCourses)
    }

    res.status(200).json(course)
}

const getStudentOfferedCourses = async(req, res)=>{
    const {studentEmail} = req.body
    const student = await db.Student.findOne({
        include : {
            model : db.User,
            where : {
                EMAIL : studentEmail
            }
        }
    })
    const batch = student.dataValues.batch
    const Dept = student.dataValues.DEPARTMENT
    let offered = []
    const offeredCourses = await db.OfferCourses.findAll({
        include:{
            model: db.Course
        }
    })

    offeredCourses.map(course=>{
        if(course.dataValues.ALLOWED.batches.includes(batch) || course.dataValues.ALLOWED.departments.includes(Dept))
        {
            offered.push(course)
        }
    })

    

    const allSections = await db.Section.findAll({
        include:{
            model : db.Course
        }
    })

    offered = offered.map(course=>{
        const sections = allSections.filter(section=>section.dataValues.COURSE_ID==course.dataValues.COURSE_ID)
        return Object.assign(course.dataValues, {sections})
    })

    return res.status(200).json(offered)

}

module.exports = {
    addCourse, 
    getAllCourses, 
    getAllSections, 
    addSectionToCourse, 
    deleteCourseSection, 
    offerCourse,
    getOfferedCourses, 
    updateOfferedCourses,
    getStudentOfferedCourses
}