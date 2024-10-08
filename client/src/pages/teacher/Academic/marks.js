import { useState, useEffect } from "react";
import GetTeacherCourseSec from "./common/getTeacherCourseSec";
import axios from "axios";
import Table from "../../../components/Common/Table";
import ManageStudentMarks from "../../../components/Modal/manageStudentMarks";
import apiClient from "../../../components/config/axios";
import { useNavigate } from "react-router-dom";
import isUnAuth from "../../../utils/checkUnAuth";

function MarksManagement() {
    const [sendCourse, setSendCourse] = useState({})
    const [students, setStudents] = useState([])
    const jwtToken = localStorage.getItem('token')
    const [selectedStudent, setSelectedStudent] = useState({})
    const [manageStudentMarksModal, setManageStudentMarksModal] = useState(false)
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    useEffect(() => {
        if(sendCourse && Object.keys(sendCourse).length > 0)
        {
            axios.get(`/academic/marks/getStudentsList/${sendCourse.section.id}`)
            .then(res=>{
                console.log(res.data)
                setStudents(res.data.Students)
            })
            .catch(err=>{
                console.log(err)
                isUnAuth(err, navigate)
            })

        }
    }, [sendCourse]);

    const toggleManageStudentMarks = ()=>{
        setManageStudentMarksModal(!manageStudentMarksModal)
    }

    return ( 
        <>
        <div className="attendance_container">
            <div className="teacherManagement-header">
                <h1>Marks Management</h1>
                <span className="teacherManagement-leftHeader">
                    <GetTeacherCourseSec setSendCourse={setSendCourse}/>
                </span>
            </div>
            <div className="teacherManagement-content">
                <Table titles={['Sr.', 'Student Name', '']}>
                    {students.map((student, idx)=>{
                        return(
                            <tr key={student.ID}>
                                <td>{idx+1}</td>
                                <td>{student.User.NAME}</td>
                                <td><button className="btnStyle" onClick={()=>{setSelectedStudent(student);setManageStudentMarksModal(true)}}>Manage Marks</button></td>
                            </tr>
                        )
                    })}
                </Table>
            </div>
            <ManageStudentMarks show={manageStudentMarksModal} close={toggleManageStudentMarks} student={selectedStudent}/>
        </div>
        </>
     );
}

export default MarksManagement;