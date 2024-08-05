import Modal from "../Common/Modal";
import { useEffect, useState } from "react";
import Table from "../Common/Table";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import apiClient from "../config/axios";
import isUnAuth from "../../utils/checkUnAuth";
import { useNavigate } from "react-router-dom";

function AssignTeacher({show, close, section, setSelectedSection}) {

    const [teachers, setTeachers] = useState([])
    const [updatedTeachers, setUpdatedTeachers] = useState([])
    const [filters, setFilters] = useState({
        nameSearch : '',
        departments : []
    })
    const jwtToken = localStorage.getItem('token')
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    useEffect(()=>{
        axios.get('/user/getAllTeachers')
        .then(res=>{
            setTeachers(res.data)
            setUpdatedTeachers(res.data)
        })
        .catch(err=>{
            console.log(err)
            isUnAuth(err, navigate)
        })
    }, [])

    useEffect(()=>{
        const updated = teachers.filter(teacher=>{
            const nameMatch = filters.nameSearch.length === 0 || teacher['User']['NAME'].toLowerCase().includes(filters.nameSearch.toLowerCase());
            const departmentMatch = filters.departments.length === 0 || filters.departments.includes(teacher['DEPARTMENT'].toString());
            return nameMatch && departmentMatch;
        })
        setUpdatedTeachers(updated)
    }, [filters])

    const handleNameSearch = (e)=>{
        setFilters({
            ...filters,
            nameSearch : e.target.value
        })
    }

    const handleAddDepartmentTag = (e)=>{
        if(e.key == 'Enter')
        {
            setFilters({
                ...filters,
                departments: [...filters.departments, e.target.value.trim().toUpperCase()]
            })
            e.target.value = null
        }
    }

    const handleRemoveDepartmentTag = (index)=>{
        setFilters({
            ...filters,
            departments: filters.departments.filter((batch, i) => i !== index)
        });
    }

    const handleAssignTeacher = (teacherID)=>{
        console.log('teacherID: ', teacherID, ', sectionID: ', section.ID)
        const data = {
            sectionID : section.ID,
            teacherID : teacherID
        }
        axios.post('/user/addTeacherToSection',data)
        .then(res=>{
            setSelectedSection(res.data)
            close()
        })
        .catch(err=>{
            console.log(err)
            isUnAuth(err, navigate)
        })
    }

    return ( 
        <>
        <Modal show={show} close={close} width={'80%'}>
            <div className="assignStudent-header">
                <h1>Assign Teachers</h1>
                <div className="assignStudent-filters">
                    <div className="assignStudent-batchFilter">
                        <input type="text" placeholder="Name" value={filters.nameSearch} onChange={handleNameSearch} />
                    </div>
                    <div className="assignStudent-batchFilter">
                        {filters.departments.map((department, index)=>{
                            return(
                                <div className="batchTag" key={index} onClick={()=>handleRemoveDepartmentTag(index)}>
                                    {department}
                                    <IoClose className="deleteAssignTag"/>
                                </div>
                            )
                        })}
                        <input type="text" placeholder="Department" onKeyDown={handleAddDepartmentTag}/>
                    </div>
                    {/* <button className="clearFilters_btn" onClick={clearFilters}>Clear</button> */}
                </div>
            </div>
            <div className="teacherManagement-content showTeacherAssignment">
                <Table titles={['Name', 'Email','Department','']}>
                        {updatedTeachers.map(teacher=>{
                            return(
                                <tr key={teacher.ID}>
                                    <td>{teacher.User.NAME}</td>
                                    <td>{teacher.User.EMAIL}</td>
                                    <td>{teacher.DEPARTMENT}</td>
                                    <td>
                                        <button className="addBtn" onClick={()=>handleAssignTeacher(teacher.ID)}>Assign</button>
                                    </td>
                                </tr>
                            )
                        })}
                </Table>
            </div>
        </Modal>
        </>
     );
}

export default AssignTeacher;