const db = require('../models')



const markStudentsAttendance = async(req, res)=>{
    const {sectionID, date, attendance} = req.body
    for(const studentID in attendance)
    {
        const status = attendance[studentID]
        const existingAttendance = await db.Attendance.findOne({
            where: {
              STUDENT_ID: studentID,
              SECTION_ID: sectionID,
            },
        });

        if(existingAttendance)
        {
            if(!existingAttendance.ATTENDANCE_DATA[date])
            {
                console.log("this attendance doesnot exists")
                existingAttendance.ATTENDANCE_DATA = {
                    ...existingAttendance.ATTENDANCE_DATA,
                    [date]: status,
                };
                await existingAttendance.save();
            }
        }else{
            await db.Attendance.create({
                STUDENT_ID: studentID,
                SECTION_ID: sectionID,
                ATTENDANCE_DATA: { [date]: status },
            })
        }
    }

    const studentAttendance = await db.Attendance.findAll({
        where : {SECTION_ID : sectionID},
        include : {
            model : db.Student,
            include : {
                model : db.User
            }
        }
    })

    res.status(200).json(studentAttendance)
}


const getStudentsAttendance = async(req, res)=>{
    const {id} = req.params
    console.log(id)
    const studentAttendance = await db.Attendance.findAll({
        where : {SECTION_ID : id},
        include : {
            model : db.Student,
            include : {
                model : db.User
            }
        }
    })

    res.status(200).json(studentAttendance)
}

const getStudentsMarksList = async(req, res)=>{
    //console.log()
    const {id} = req.params
    const list = await db.Section.findOne({
        where : {ID : id},
        include : {
            model : db.Student,
            include : {
                model : db.User
            }
        }
    })
    res.status(200).json(list)

}

const getStudentDetails = async(req, res)=>{
    const {sectionID, studentID} = req.body
    console.log(sectionID, studentID)
    const s = await db.Mark.findOne({
        where : {
            STUDENT_ID : studentID,
            SECTION_ID : sectionID
        }
    });
    
    const allStudents = await db.Mark.findOne({
        where : {
            SECTION_ID : sectionID
        }
    })
    //console.log(allStudents)

    res.status(200).json(s)
}

const addStudentMarks = async(req, res)=>{
    const {sectionID, studentID, marksData} = req.body
    const existingMarks = await db.Mark.findOne({
        where : {
            STUDENT_ID : studentID,
            SECTION_ID : sectionID
        }
    })

    if(existingMarks)
    {
        existingMarks.MARKS_DATA = marksData
        await existingMarks.save()
        return res.status(200).json(existingMarks)
    }else
    {
        await db.Mark.create({
            STUDENT_ID : studentID,
            SECTION_ID : sectionID,
            MARKS_DATA : marksData
        })
        const data = await db.Mark.findOne({
            where : {
                STUDENT_ID : studentID,
                SECTION_ID : sectionID
            }
        })
        return res.status(200).json(data)
    }


    res.status(200)
}


const updateStudentMarksSection = async(req,res)=>{
    const body = req.body
    console.log(body)
    const section = await db.Mark.findOne({
        where : {STUDENT_ID : body.studentID, SECTION_ID : body.sectionID}
    })

   
        const updated_marks_data = Object.entries(section.MARKS_DATA).reduce((acc, [key, value]) => {
            if(body.prevName !== body.new.name)
            {
                const new_key = key === body.prevName ? body.new.name : key;
                acc[new_key] = value;
                if(new_key==body.new.name)
                {
                    acc[new_key] = {...value, percentage: body.new.percentage}
                }
            }
            else{
                acc[key] = value;
                if(key==body.prevName)
                {
                    acc[key] = {...value, percentage: body.new.percentage}
                }
            }
                
            return acc;
          }, {});
        section.MARKS_DATA = updated_marks_data
        await section.save()

        const data = await db.Mark.findOne({
            where : {
                STUDENT_ID : body.studentID,
                SECTION_ID : body.sectionID
            }
        })

    res.status(200).json(data)
}

const getStudentMarks = async(req, res)=>{
    const {sectionID, studentID} = req.body

    const data = await db.Mark.findOne({
        where:{
            SECTION_ID : sectionID,
            STUDENT_ID : studentID
        }
    })
    res.status(200).json(data)
}

const getStudentAttendance = async(req, res)=>{
    const {sectionID, studentID} = req.body
    const studentAttendance = await db.Attendance.findOne({
        where : {
            SECTION_ID : sectionID,
            STUDENT_ID : studentID
        }
    })

    res.status(200).json(studentAttendance)
}

const getStudentAllAttendances = async(req, res)=>{
    const {email} = req.params
    

    const user = await db.Student.findOne({
        include:{
            model : db.User,
            where : {EMAIL: email}
        }
    })

    const data = await db.Attendance.findAll({
        where: {STUDENT_ID: user.dataValues.ID},
        include:{
            model: db.Section,
            include:{
                model: db.Course
            }
        }
    })

    return res.status(200).json(data)
}

module.exports = {
    markStudentsAttendance,
    getStudentsAttendance,
    getStudentsMarksList, 
    getStudentDetails, 
    addStudentMarks, 
    updateStudentMarksSection,
    getStudentMarks,
    getStudentAttendance,
    getStudentAllAttendances
}