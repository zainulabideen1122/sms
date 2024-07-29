const db = require('../models')

const Teacher = db.Teacher
const User = db.User
const UserRole = db.UserRole


    //get all teachers
    const getAllTeachers = async(req, res)=>{
        try {
            const teachers = await Teacher.findAll({
                include : {
                    model : User,
                    include : {
                        model : db.Role,
                        attributes : ['ID', 'NAME', 'DESCRIPTION']
                    }
                }
            })
            return res.status(200).send(teachers)
        } catch (error) {
            console.log(error)
        }
    }


    //adding
    const addTeacher = async(req, res)=>{
        await db.sequalize.transaction(async(transaction)=>{
            const createdUser = await User.create({
                NAME : req.body.NAME,
                EMAIL : req.body.EMAIL,
                PASSWORD : req.body.PASSWORD
            }, {transaction})

            const teacher = await Teacher.create({
                DEPARTMENT : req.body.DEPARTMENT,
                EXPERIENCE : req.body.EXPERIENCE,
                QUALIFICATION : req.body.QUALIFICATION,
                USER_ID : createdUser.ID
            },{transaction})

            const userRole = await UserRole.create({
                USER_ID : createdUser.ID,
                ROLE_ID : 3
            }, {transaction})
    
        })
        getAllTeachers(req, res)
    }



const getTeacher = async(req, res)=>{
    const {id} = req.params
    const teacher = await Teacher.findOne({
        where : {ID : id},
        include : {
            model : User,
            attributes : ['ID', 'NAME', 'EMAIL','PASSWORD']
        }
    })

    res.status(200).json(teacher)
}

const updateTeacher = async(req, res)=>{
    const {id} = req.params
    try {
        await db.sequalize.transaction( async transaction=>{
            const teacher = await Teacher.findOne({
                where : {ID : id},
                include : {
                    model : User
                }
            }, {transaction})
            if (!teacher) {
                console.log('Teacher not found');
                await transaction.rollback();
                return res.status(404).json({ message: 'Teacher not found' });
              }

            //filtering out the empty value keys
            const updateData = Object.keys(req.body).reduce((acc, key) => {
                if (req.body[key] !== '') {
                  acc[key] = req.body[key];
                }
                return acc;
              }, {});

            await teacher.update(updateData, {transaction})
            if(req.body.NAME || req.body.PASSWORD || req.body.EMAIL)
            {
                const userID = teacher.USER_ID
                await User.update(updateData, {where : {ID : userID}})
            }
        })

        getAllTeachers(req, res)
    } catch (error) {
        console.log(error)
    }

}

const deleteTeacher = async(req, res)=>{
    const {id} = req.params
    try {
        await db.sequalize.transaction(async transaction=>{
            const teacher = await Teacher.findOne({
                where: {ID:id},
                include : {
                    model : User
                }
            })

            if (!teacher) {
                console.log('Teacher not found');
                await transaction.rollback();
                return res.status(404).json({ message: 'Teacher not found' });
              }
            
            const userID = teacher.USER_ID
              console.log(userID)
            await Teacher.destroy({
                where : {ID : id}
            })

            await UserRole.destroy({
                where  : {USER_ID : userID}
            })

            await User.destroy({
                where : {ID : userID}
            })
        })
        getAllTeachers(req, res)
    } catch (error) {
        console.log(error)
    }
}


const addTeacherToSection  = async(req, res)=>{
    const {sectionID, teacherID} = req.body
    console.log(sectionID, teacherID)
    const section = await db.Section.findByPk(sectionID)
    if(!section)
        res.status(500).send("Section doesn't exists!")
    else{
        section.TEACHER_ID = teacherID
        await section.save()
        const updated = await db.Section.findOne({
            where : {ID:sectionID},
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
        })
        res.status(200).json(updated)
    }
}

const unAssignTeacher = async(req, res)=>{
    const {id} = req.params
    console.log(id)
    const section = await db.Section.findByPk(id)
    if(!section)
        res.status(500).send("Section doesn't exists!")
    else{
        section.TEACHER_ID = null
        await section.save()
        const updated = await db.Section.findOne({
            where : {ID:id},
            include : {
                model : db.Student,
                include : {
                    model : db.User
                }
            }
        })
        res.status(200).json(updated)
    }
}

module.exports = {
    addTeacher, getAllTeachers, getTeacher, updateTeacher, deleteTeacher, addTeacherToSection, unAssignTeacher
}