import { useEffect, useState } from 'react';
import Modal from '../Common/Modal'
import Table from '../Common/Table'
import '../index.css'
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import apiClient from '../config/axios';
import { useNavigate } from 'react-router-dom';
import isUnAuth from '../../utils/checkUnAuth';


function CreateAttendance({show, close, students, sectionID, updateData}) {
    const [startDate, setStartDate] = useState(new Date())
    const [studentsAttendance, setStudentsAttendance] = useState({})
    const jwtToken = localStorage.getItem('token')
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    
    const fillStudentDefaultAttendance = ()=>{
        const initial = {};
        students.forEach(student=>{
            initial[student.ID] = 'Present'
        })
        setStudentsAttendance(initial)
    }

    useEffect(()=>{
        fillStudentDefaultAttendance()

    }, [students])

    const handleChangeAttendance = (studentID, status)=>{
        setStudentsAttendance((prevAttendance) => {
            return { ...prevAttendance, [studentID]: status };
        });
    }

    const handleMarkAttendance = ()=>{
        const data = {
            sectionID : sectionID,
            date : startDate.toLocaleDateString('en-GB'),
            attendance : studentsAttendance
        }
        axios.post('/academic/markAttendance', data)
        .then(res=>{
            console.log(res.data)
            updateData(res.data)
        })
        .catch(err=>{
            console.log(err)
            isUnAuth(err, navigate)
        })
        fillStudentDefaultAttendance()
        close()
    }

    return ( 
        <>
            <Modal show={show} close={close} width={'70%'}>
            <div className="teacherManagement-header">
                <h1>Mark attendance</h1>
                <span className="teacherManagement-leftHeader">
                    <DatePicker selected={startDate} onChange={(date)=>setStartDate(date)}/>
                </span>
            </div>
            <div className="teacherManagement-content">
                <Table titles={['Sr.','Name','','','','']}>
                    {students.map((student,indx)=>{
                        return(
                            <tr key={student.ID}>
                                <td>{indx+1}</td>
                                <td>{student.User.NAME}</td>
                                <td>
                                    <select className='attendanceChoices' onChange={(e)=>handleChangeAttendance(student.ID, e.target.value)}>
                                        <option value="Present">P</option>
                                        <option value="Absent">A</option>
                                        <option value="Late">L</option>
                                    </select>
                                </td>
                            </tr>
                        )
                    })}
                </Table>
            </div>
            <button className='addBtn' onClick={handleMarkAttendance}>Mark</button>
            </Modal>
        </>
     );
}

export default CreateAttendance;