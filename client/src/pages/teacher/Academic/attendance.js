import { useEffect, useState } from 'react';
import './index.css'
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import CreateAttendance from '../../../components/Modal/createAttendance';
import Table from '../../../components/Common/Table';
import GetTeacherCourseSec from './common/getTeacherCourseSec';
import apiClient from '../../../components/config/axios';
import { useNavigate } from 'react-router-dom';
import isUnAuth from '../../../utils/checkUnAuth';

function Attendance() {
    const userEmail = jwtDecode(localStorage.getItem('token')).email
    const [sendCourse, setSendCourse] = useState({})
    const jwtToken = localStorage.getItem('token')
    const [createAttendanceModal, setCreateAttendanceModal] = useState(false)
    const [students, setStudents] = useState([])
    const [studentsAttendance, setStudentsAttendance] = useState([])
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()

    function toggleAttendanceModal(){
        setCreateAttendanceModal(!createAttendanceModal)
    }

    const getStudentsAttendance = async(sectionID)=>{
        //console
        if(sectionID)
        {
            axios.get(`/academic/getStudentsAttendance/${sectionID}`)
            .then(res=>{
                console.log("student attendance=>> ", res.data)
                setStudentsAttendance(res.data)
            })
            .catch(err=>{
                //console.log()
                isUnAuth(err, navigate)
            })
        }
    }

    useEffect(() => {
        console.log(sendCourse)
        if(sendCourse && Object.keys(sendCourse).length > 0)
        {
            axios.post('/user/getAttendanceList', sendCourse)
            .then(res=>{
                console.log(res.data)
                setStudents(res.data[0].Students)
            })
            .catch(err=>{
                //console.log
                isUnAuth(err, navigate)
            })

            getStudentsAttendance(sendCourse.section.id)
        }
    }, [sendCourse]);

    return ( 
        <>
           <div className="attendance_container">
                <div className="teacherManagement-header">
                    <h1>Attendance</h1>
                    <span className="teacherManagement-leftHeader">
                        <GetTeacherCourseSec setSendCourse={setSendCourse}/>
                        <button className='btnStyle' disabled={Object.keys(sendCourse).length <= 0} style={Object.keys(sendCourse).length <= 0?{background:'gray'}:{}}  onClick={()=>setCreateAttendanceModal(true)} >New Attendance</button>
                    </span>
                </div>

                <div className="teacherManagement-content">
                    <Table titles={['Sr.','Student Name',  ...Object.keys(studentsAttendance[0] ? studentsAttendance[0].ATTENDANCE_DATA : {}).slice(-4)]}>
                        {studentsAttendance.map((attendance, idx)=>{
                            return(
                                <tr key={attendance.STUDENT_ID}>
                                    <td>{idx+1}</td>
                                    <td>{attendance.Student.User.NAME}</td>
                                    {Object.keys(attendance.ATTENDANCE_DATA).slice(-4).map((date) => (
                                        <td key={date} className={`${attendance.ATTENDANCE_DATA[date] == 'Present' ? 'greenText' : attendance.ATTENDANCE_DATA[date] == 'Absent' ? 'redText':''}`}>{attendance.ATTENDANCE_DATA[date] == 'Present' ? 'P' : attendance.ATTENDANCE_DATA[date] == 'Absent' ? 'A' : 'L'}</td>
                                    ))}
                                </tr>
                            )
                        })}
                    </Table>
                </div>
                <CreateAttendance show={createAttendanceModal} close={toggleAttendanceModal} students={students} sectionID={sendCourse.section ? sendCourse.section.id: null} setStudentsAttendance={setStudentsAttendance} />
           </div>
        </>
     );
}

export default Attendance;