import { useEffect, useState } from "react";
import apiClient from "../../components/config/axios";
import StudentMarksView from "../../components/View/studentMarks";
import { useNavigate } from "react-router-dom";
import isUnAuth from "../../utils/checkUnAuth";
import { jwtDecode } from "jwt-decode";
import Table from "../../components/Common/Table";
import './index.css'

function StudentAttendance() {
    const userEmail = jwtDecode(localStorage.getItem('token')).email
    const axios = apiClient(localStorage.getItem('token'))
    const [studentCourses, setStudentCourses] = useState([])
    const [studentDetails, setStudentDetails] = useState({
        studentID : '',
        courseName :''
    })
    const navigate = useNavigate()
    const [studentAttendance, setStudentAttendance] = useState({})

    function showCourseName(sectionID)
    {
        const course = studentCourses.filter(course=>course.section.id==sectionID)
        return (course[0].courseCode+"-"+course[0].name)
    }

    useEffect(()=>{
        const data = {studentEmail : userEmail}
        axios.post('/user/getStudentCoursesAndSections', data)
        .then(res=>{
            setStudentDetails({...studentDetails ,studentID:res.data.ID})
            const courses = res.data.Sections.reduce((acc, section) => {
                const existingCourse = acc.find((course) => course.id === section.Course.ID);
                if(existingCourse) {
                    existingCourse.sections.push({ id: section.ID, name: section.NAME });
                } else {
                  acc.push({
                    id: section.Course.ID,
                    name: section.Course.NAME,
                    courseCode : section.Course.CODE,
                    section: { id: section.ID, name: section.NAME },
                  });
                }
                return acc;
              }, []);
            setStudentCourses(courses)
            //console.log(courses)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })
    }, [])
    
    const handleGetStudentMarks = (selected)=>{
        const data = {
            sectionID : selected,
            studentID : studentDetails.studentID
        }

        axios.post('/academic/getStudentAttendance', data)
        .then(res=>{
            if(res.data==null)
            {
                setStudentAttendance({})
                setStudentDetails({
                    ...studentDetails,
                    courseName : ''
                })
            }else{
                setStudentDetails({
                    ...studentDetails,
                    courseName : showCourseName(selected)
                })
                setStudentAttendance(res.data)
            }
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })
    }

    return ( 
        <>
           <StudentMarksView studentMarks={studentCourses} setStudent={handleGetStudentMarks} selectedCourse={studentDetails.courseName}>
                <div className="teacherManagement-content scrollable">
                    <Table titles={['Date', 'Status']}>
                        { studentAttendance &&  Object.keys(studentAttendance).length > 0 ? Object.keys(studentAttendance.ATTENDANCE_DATA).map(date=>{
                            return(
                                <tr key={date}>
                                    <td>{date}</td>
                                    <td className={`${studentAttendance.ATTENDANCE_DATA[date] == 'Present' ? 'greenText' : studentAttendance.ATTENDANCE_DATA[date] == 'Absent' ? 'redText':''}`}>{studentAttendance.ATTENDANCE_DATA[date] == 'Present' ? 'P' : studentAttendance.ATTENDANCE_DATA[date] == 'Absent' ? 'A' : 'L'}</td>
                                </tr>
                            )
                        }) : ''}
                    </Table>
                </div>
           </StudentMarksView>
        </>
     );
}

export default StudentAttendance;