import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import apiClient from "../../../../components/config/axios";
import { useNavigate } from "react-router-dom";
import isUnAuth from "../../../../utils/checkUnAuth";

function GetTeacherCourseSec({setSendCourse, query}) {
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState({})
    const userEmail = jwtDecode(localStorage.getItem('token')).email
    const jwtToken = localStorage.getItem('token')
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const getTeacherData = async(data)=>{
        await axios.post('/user/getTeacherCoursesAndSections', data)
        .then(res=>{
            console.log(res.data)
            const courses = res.data.Sections.reduce((acc, section) => {
                const existingCourse = acc.find((course) => course.id === section.Course.ID);
                if(existingCourse) {
                    existingCourse.sections.push({ id: section.ID, name: section.NAME });
                } else {
                  acc.push({
                    id: section.Course.ID,
                    name: section.Course.NAME,
                    sections: [{ id: section.ID, name: section.NAME }],
                  });
                }
                return acc;
              }, []);
            setCourses(courses)
        })
        .catch(err=>{
            console.log(err)
            isUnAuth(err, navigate)
        })
    }

    useEffect(()=>{
        const data = {teacherEmail : userEmail}
        getTeacherData(data)    
    }, [])

    useEffect(() => {
        if (selectedCourse && selectedCourse.sections) {
          const firstSection = selectedCourse.sections[0];
          setSendCourse({
            id: selectedCourse.id,
            name: selectedCourse.name,
            section: firstSection,
          });
        }
      }, [selectedCourse]);

      const handleSelectedData = (e) => {
        if (selectedCourse && selectedCourse.sections) {
          const selectedSection = selectedCourse.sections.find((section) => section.id === parseInt(e.target.value));
          setSendCourse({
            id: selectedCourse.id,
            name: selectedCourse.name,
            section: selectedSection,
          });
        }
      };

    
    return ( 
        <>
                <select name="teacher_searchProperty" onChange={(e) => setSelectedCourse(courses.find((course) => course.id === parseInt(e.target.value)))}>
                <option value="" disabled selected>Course</option>
                    {courses.map(course=>{
                        return(
                            <option key={course.id} value={course.id}>{course.name}</option>
                        )
                    })}
                </select>
                <select name="teacher_searchProperty" onChange={handleSelectedData} className={`${!selectedCourse || Object.keys(selectedCourse).length <= 0 ? 'display-none':''}`}>
                  {console.log('----> ',selectedCourse)}
                    { selectedCourse && selectedCourse.sections !== undefined ? selectedCourse.sections.map(section=>{
                        return(
                            <option key={section.id} value={section.id} >{section.name}</option>
                        )
                    }): ''}
                </select>
        </>
     );
}

export default GetTeacherCourseSec;