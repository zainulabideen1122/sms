const { where } = require('sequelize');
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

const getStudentMarks = async(req, res)=>{
    const {sectionID, studentID} = req.body
    console.log(sectionID, studentID)
    const s = await db.Mark.findOne({
        where : {
            STUDENT_ID : studentID,
            SECTION_ID : sectionID
        }
    });
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

module.exports = {
    markStudentsAttendance, getStudentsAttendance,getStudentsMarksList, getStudentMarks, addStudentMarks
}