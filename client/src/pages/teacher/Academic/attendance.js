import { useEffect, useState } from 'react';
import './index.css'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import CreateAttendance from '../../../components/Modal/createAttendance';

function Attendance() {
    const userEmail = jwtDecode(localStorage.getItem('token')).email
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState({})
    const [sendCourse, setSendCourse] = useState({})
    const jwtToken = localStorage.getItem('token')
    const [createAttendanceModal, setCreateAttendanceModal] = useState(false)
    const [students, setStudents] = useState([])

    function toggleAttendanceModal(){
        setCreateAttendanceModal(!createAttendanceModal)
    }

    useEffect(()=>{
        const data = {teacherEmail : userEmail}
        axios.post('http://localhost:5000/user/getTeacherCoursesAndSections', data,{
            headers : {
                'token' : jwtToken
            }
        })
        .then(res=>{
            const courses = res.data.Sections.reduce((acc, section) => {
                const existingCourse = acc.find((course) => course.id === section.Course.ID);
                if (existingCourse) {
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
        })
    }, [])

    useEffect(()=>{
        console.log(selectedCourse)
    }, [selectedCourse])


    const handleSelectedData = (e)=>{
        if(selectedCourse && selectedCourse.sections)
        {
            const selectedSection = selectedCourse.sections.filter((section) => section.id === parseInt(e.target.value))[0];
            setSendCourse({
                id : selectedCourse.id,
                name : selectedCourse.name,
                section : selectedSection
            })
        }
    }

    useEffect(() => {
        //console.log('seeeeeeeeeeeeeeeeeeeeeeeeeeending',sendCourse);
        if(sendCourse && Object.keys(sendCourse).length > 0)
        {
            console.log('seeeeeeeeeeeeeeeeeeeeeeeeeeending',sendCourse);
            axios.post('http://localhost:5000/user/getAttendanceList', sendCourse, {
                headers : {
                    'token' : jwtToken
                }
            })
            .then(res=>{
                console.log(res.data)
                setStudents(res.data[0].Students)
            })
            .catch(err=>{
                //console.log
            })
        }
    }, [sendCourse]);

    return ( 
        <>
           <div className="attendance_container">
                <div className="teacherManagement-header">
                    <h1>Attendance</h1>
                    <span className="teacherManagement-leftHeader">
                        <select name="teacher_searchProperty" onChange={(e) => setSelectedCourse(courses.find((course) => course.id === parseInt(e.target.value)))}>
                            <option>Course</option>
                            {courses.map(course=>{
                                return(
                                    <option key={course.id} value={course.id}>{course.name}</option>
                                )
                            })}
                        </select>
                        <select name="teacher_searchProperty" onChange={handleSelectedData}>
                            <option>Section</option>
                            { selectedCourse && selectedCourse.sections !== undefined ? selectedCourse.sections.map(section=>{
                                return(
                                    <option key={section.id} value={section.id} >{section.name}</option>
                                )
                            }): ''}
                        </select>
                        <button className='btnStyle' disabled={Object.keys(sendCourse).length <= 0} style={Object.keys(sendCourse).length <= 0?{background:'gray'}:{}}  onClick={()=>setCreateAttendanceModal(true)} >New Attendance</button>
                    </span>
                </div>

                <CreateAttendance show={createAttendanceModal} close={toggleAttendanceModal} students={students} sectionID={sendCourse.section ? sendCourse.section.id: null}/>

           </div>
        </>
     );
}

export default Attendance;