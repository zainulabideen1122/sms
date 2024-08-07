import { useNavigate } from "react-router-dom";
import apiClient from "../../components/config/axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Table from "../../components/Common/Table";
import './index.css'
import isUnAuth from "../../utils/checkUnAuth";

function CourseRegistration() {
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const studentEmail = jwtDecode(localStorage.getItem('token')).email
    const [offeredCourses, SetOfferedCourses] = useState([])
    const [selected, setSelected] = useState({
        course : '',
        section: ''
    })
    useEffect(()=>{
        
        axios.post('/courses/getStudentOfferedCourses', {studentEmail})
        .then(res=>{
            console.log(res.data)
            SetOfferedCourses(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })

        // axios.post('/')

    }, [])

    const handleEnrollCourse = (courseID)=>{
        if(selected.section == "-1" || selected.section == "" ||  selected.course !== courseID)
        {
            alert('Please Select section first!')
            console.log(courseID, selected)
        }else{
            console.log(courseID, selected)
        }
    }

    return ( 
        <>
            <h1>Offered Courses: </h1>
            <div className="teacherManagement-content">
                <Table titles={['Code', 'Name','Sections','']}>
                    {offeredCourses.map(course=>{
                        return(
                            <tr key={course.COURSE_ID}>
                                <td>{course.Course.CODE}</td>
                                <td>{course.Course.NAME}</td>
                                <td>
                                    <select className="sectionSelect" onChange={(e)=>setSelected({...selected,course:course.COURSE_ID,section:e.target.value })}>
                                        <option value={-1}>Select</option>
                                        {course.sections.map(section=>{
                                            return(
                                                <option key={section.ID} value={section.ID}>{section.NAME}</option>
                                            )
                                        })}
                                    </select>
                                </td>
                                <td><button className="btnStyle" onClick={()=>handleEnrollCourse(course.COURSE_ID)}>Enroll</button></td>
                            </tr>
                        )
                    })}
                </Table>
            </div>
        </>
     );
}

export default CourseRegistration;