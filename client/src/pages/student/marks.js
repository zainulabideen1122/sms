import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

function StudentMarks() {

    const userEmail = jwtDecode(localStorage.getItem('token')).email
    const jwtToken = localStorage.getItem('token')
    const [studentCourses, setStudentCourses] = useState([])

    useEffect(()=>{
        const data = {studentEmail : userEmail}
        axios.post('http://localhost:5000/user/getStudentCoursesAndSections', data, {
            headers :{
                'token' : jwtToken
            }
        })
        .then(res=>{
            console.log(res)
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
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])

    return ( 
        <>
            Student Marks
        </>
     );
}

export default StudentMarks;