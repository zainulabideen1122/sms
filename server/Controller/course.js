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

module.exports = {
    addCourse, getAllCourses, getAllSections, addSectionToCourse, deleteCourseSection
}