import { useNavigate } from "react-router-dom";
import apiClient from "../../components/config/axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Table from "../../components/Common/Table";
import './index.css'
import isUnAuth from "../../utils/checkUnAuth";
import getCurrentSemester from "../../utils/getSemester";

function CourseRegistration() {
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const studentEmail = jwtDecode(localStorage.getItem('token')).email
    const [student, setStudent] = useState()
    const [offeredCourses, SetOfferedCourses] = useState([])
    useEffect(()=>{
        var semester = ''
        axios.get(`/user/getStudent/${studentEmail}`)
        .then(res=>{
            console.log(res.data)
            semester = getCurrentSemester(res.data.CURRENT_SEMESTER, res.data.BATCH)
            setStudent(res.data)

            axios.post('/courses/getStudentOfferedCourses', {studentEmail, semester})
            .then(res=>{
                console.log(res.data)
                SetOfferedCourses(res.data)
            })
            .catch(err=>{
                isUnAuth(err, navigate)
            })

        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })
        

        // axios.get('/courses/getAllStudentCourse')
        // .then(res=>{
        //     console.log(res.data)
        // })


    }, [])

    const handleEnrollCourse = ()=>{

        // const data = {
        //     studentID : studentID,
        //     sectionID : selected.section
        // }

        // axios.post('/user/addStudentToSection', data)

        if (offeredCourses.length !== Object.keys(selectedSections).length) {
            console.log("Please select a section for each course");
            return;
          }
        
          const allSectionsSelected = Object.keys(selectedSections).every((courseID) => {
            return selectedSections[courseID] !== -1;
          });
        
          if (allSectionsSelected) {
            //All sections selected
            console.log(selectedSections)
            const data={
                studentID: student.ID,
                courses: selectedSections
            }
            axios.post('/user/enrollStudentToCourses', data)
            .then(res=>{
                console.log(res.data)
            })
            .catch(err=>{
                isUnAuth(err, navigate)
            })
          } else {
            console.log("Please select all sections");
          }
    }

    const [selectedSections, setSelectedSections] = useState({});

    const handleSelectChange = (courseID, sectionID) => {
    setSelectedSections((prev) => ({ ...prev, [courseID]: sectionID }));
    };

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
                                    <select className="sectionSelect" onChange={(e) => handleSelectChange(course.COURSE_ID, e.target.value)}>
                                        <option selected disabled value={-1}>Select</option>
                                        {course.sections.map(section=>{
                                            return(
                                                <option key={section.ID} value={section.ID}>{section.NAME}</option>
                                            )
                                        })}
                                    </select>
                                </td>
                                {/* <td><button className="btnStyle" onClick={()=>handleEnrollCourse(course.COURSE_ID)}>Enroll</button></td> */}
                            </tr>
                        )
                    })}
                </Table>
                <button className="addBtn" onClick={handleEnrollCourse}>Enroll All</button>
            </div>
        </>
     );
}

export default CourseRegistration;