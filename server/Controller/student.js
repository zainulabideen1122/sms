const { where } = require('sequelize')
const db = require('../models')

const Student = db.Student
const User = db.User
const UserRole = db.UserRole



    //get all teachers
    const getAllStudents = async(req, res)=>{
        try {
            const students = await Student.findAll({
                include : {
                    model : User,
                    include : {
                        model : db.Role,
                        attributes : ['ID', 'NAME', 'DESCRIPTION']
                    }
                }
            })
            return res.status(200).send(students)
        } catch (error) {
            console.log(error)
        }
    }


    //adding
    const addStudent = async(req, res)=>{
        await db.sequalize.transaction(async(transaction)=>{
            const createdUser = await User.create({
                NAME : req.body.NAME,
                EMAIL : req.body.EMAIL,
                PASSWORD : req.body.PASSWORD
            }, {transaction})

            const student = await Student.create({
                DEPARTMENT : req.body.DEPARTMENT,
                ROLLNUM : req.body.ROLLNUM,
                BATCH : req.body.BATCH,
                USER_ID : createdUser.ID,
                CURRENT_SEMESTER: 'FALL-'+req.body.BATCH
            },{transaction})

            const userRole = await UserRole.create({
                USER_ID : createdUser.ID,
                ROLE_ID : 2
            }, {transaction})
    
        })
        getAllStudents(req, res)
    }



const getStudent = async(req, res)=>{
    const {email} = req.params
    const student = await Student.findOne({
        include : {
            model : User,
            where : {EMAIL: email}
        }
    })

    res.status(200).json(student)
}

const updateStudent = async(req, res)=>{
    const {id} = req.params
    try {
        await db.sequalize.transaction( async transaction=>{
            const student = await Student.findOne({
                where : {ID : id},
                include : {
                    model : User
                }
            }, {transaction})
            if (!student) {
                console.log('Student not found');
                await transaction.rollback();
                return res.status(404).json({ message: 'Stuednt not found' });
              }

            const updateData = Object.keys(req.body).reduce((acc, key) => {
                if (req.body[key] !== '') {
                  acc[key] = req.body[key];
                }
                return acc;
              }, {});

            await student.update(updateData, {transaction})
            if(req.body.NAME || req.body.PASSWORD || req.body.EMAIL)
            {
                const userID = student.USER_ID
                await User.update(updateData, {where : {ID : userID}})
            }
        })

        getAllStudents(req, res)
    } catch (error) {
        console.log(error)
    }

}

const deleteStudent = async(req, res)=>{
    const {id} = req.params
    try {
        await db.sequalize.transaction(async transaction=>{
            const student = await Student.findOne({
                where: {ID:id},
                include : {
                    model : User
                }
            })

            if (!student) {
                console.log('Stuednt not found');
                await transaction.rollback();
                return res.status(404).json({ message: 'Student not found' });
              }
            
            const userID = student.USER_ID
              console.log(userID)
            await Student.destroy({
                where : {ID : id}
            })

            await UserRole.destroy({
                where : {USER_ID : userID}
            })

            await User.destroy({
                where : {ID : userID}
            })
            
        })
        getAllStudents(req, res)
    } catch (error) {
        console.log(error)
    }
}


const addStudentToCourseSection = async(req, res)=>{
    const {sectionID, studentID} = req.body
    const section = await db.Section.findByPk(sectionID)
    const student = await Student.findByPk(studentID)
    await section.addStudent(student)
    section.NUM_OF_STUDENTS +=1
    await section.save()
    console.log(section, student)
    
    res.status(200).json({msg:"Added!"})
}

const addStudentsToCourseSection = async(req, res)=>{
    const {sectionID, students} = req.body

    const studentSections = students.map((student) => {
        return { SECTION_ID:sectionID, USER_ID: student.ID };
    });
    const length = studentSections.length

    try {
        await db.StudentSection.bulkCreate(studentSections)
        const section = await db.Section.findByPk(sectionID)
        section.NUM_OF_STUDENTS +=length
        await section.save()

        const updated = await db.Section.findOne({
            where : {ID:sectionID},
            include : {
                model : db.Student,
                include : {
                    model : db.User
                }
            }
        })

        res.status(200).json(updated)
    } catch (error) {
        throw error
    }
}

const unrollStudenFromSection = async (req, res)=>{
    const {sectionID, studentID} = req.body

    await db.StudentSection.destroy({
        where : {SECTION_ID:sectionID, USER_ID:studentID}
    })
    const section = await db.Section.findByPk(sectionID)
    section.NUM_OF_STUDENTS -=1
    await section.save()

    const updated = await db.Section.findOne({
        where : {ID:sectionID},
        include : {
            model : db.Student,
            include : {
                model : db.User
            }
        }
    })
    //console.log(sectionID, studentID)
    res.status(200).json(updated)
}

const getStudentCoursesAndSections = async(req, res)=>{
    const {studentEmail} = req.body
    const teacher = await db.Student.findOne({
        include:[{
            model : db.User,
            where : {EMAIL : studentEmail}
        },
        {
            model : db.Section,
            include : {
                model : db.Course
            }
        }
        ]
    })
    res.status(200).json(teacher)
}

const enrollStudentToCourses = async(req, res)=>{
    const {studentID, courses} = req.body
    const studentSections = Object.keys(courses).map((courseID) => {
        return {
          USER_ID: studentID,
          SECTION_ID: courses[courseID],
        };
      });
    console.log(studentSections)

    const data = await db.StudentSection.bulkCreate(studentSections)

    if(data)
    {
        await Promise.all(
            Object.keys(courses).map((courseID) => {
              return db.Section.increment("NUM_OF_STUDENTS", {
                where: {
                  ID: courses[courseID],
                },
              });
            })
          );
          res.status(200).json(data)
    }
        
    res.status(200)
}

module.exports = {
    addStudent,
    getAllStudents, 
    getStudent, 
    updateStudent, 
    deleteStudent, 
    addStudentToCourseSection, 
    addStudentsToCourseSection, 
    unrollStudenFromSection,
    getStudentCoursesAndSections,
    enrollStudentToCourses
}