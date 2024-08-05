import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import SectionStudents from "../viewSectionStudents";
import axios from "axios";
import Table from "../Common/Table";
import AssignTeacher from './assignTeacher'
import { useNavigate } from "react-router-dom";
import isUnAuth from "../../utils/checkUnAuth";
import apiClient from "../config/axios";

function ShowSection({show, close, section, setCourses, setSelectedSection}) {
    const [sectionStudentsListStatus, setSectionStudentListStatus] = useState(false)
    const [assignTeacherModal, setAssignTeacherModal] = useState(false)
    const jwtToken = localStorage.getItem('token')
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const handleShowStudentsList = ()=>{
        setSectionStudentListStatus(!sectionStudentsListStatus)
    }
    console.log(section)
    
    function toggleAssignTeacherModal()
    {
        setAssignTeacherModal(!assignTeacherModal)
    }

    const handleDeleteSection = ()=>{
        axios.delete(`/courses/deleteCourseSection/${section.ID}`)
        .then(res=>{
            setCourses(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })
        close()
    }

    const handleTeacherActionBtns = (action)=>{
        if(action == 'assignTeacher')
        {
            setAssignTeacherModal(true);
            setSectionStudentListStatus(true)
        }
        else if(action == 'unAssignTeacher')
        {
            console.log('unAssign')
            console.log(section.ID)
            axios.get(`/user/unAssignTeacherFromSection/${section.ID}`)
            .then(res=>{
                console.log(res.data)
                setSelectedSection(res.data)
            })
            .catch(err=>{
                console.log(err)
                isUnAuth(err, navigate)
            })
        }
    }

    return (
        <>
        {show ? <div className="background_focus">
            <div className="showSection_Container">
                <MdOutlineCancel size={25} className="addTeacher_cancelBtn" onClick={()=>{setSectionStudentListStatus(false);close()}}/>
                <div className="showSection-header">
                    <h1>Course Section</h1>
                    <span className="teacherManagement-leftHeader">
                        <input type="text" placeholder="Search Students..." />
                    </span>
                </div>
                <div className="teacherManagement-content">
                    <Table titles={['Name', 'No. of Students','Teacher', '']}>
                        <tr>
                            <td>{section.NAME}</td>
                            <td>{section.NUM_OF_STUDENTS}</td>
                            <td>{section.Teacher ? section.Teacher.User.EMAIL : 'None'}</td>
                            <td className="sectionsToggle underlineText flexDisplay">
                                <a style={{marginRight:"1rem"}} onClick={handleShowStudentsList}>{sectionStudentsListStatus ? 'Hide' : 'View'} Students</a>
                                <button className="btnStyle" onClick={()=>{section.Teacher? handleTeacherActionBtns('unAssignTeacher'):handleTeacherActionBtns('assignTeacher') }}>{section.Teacher? 'UnAssign':'Assign'} teacher</button>
                                <span className="table-deleteBtn" >
                                    <MdDelete size={25} onClick={handleDeleteSection} />
                                </span>
                            </td>
                        </tr>
                    </Table>
                </div>
                <SectionStudents show={sectionStudentsListStatus} section={section} setSelectedSection={setSelectedSection} />
                <AssignTeacher show={assignTeacherModal} close={toggleAssignTeacherModal} section={section} setSelectedSection={setSelectedSection}/>
            </div>
        </div>
        : null}
        </>
     );
}

export default ShowSection;