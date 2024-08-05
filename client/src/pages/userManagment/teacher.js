import { useEffect, useMemo, useState } from "react";
import './index.css'
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import AddTeacher from "../../components/Modal/addTeacher";
import Table from "../../components/Common/Table";
import { useNavigate } from "react-router-dom";
import isUnAuth from "../../utils/checkUnAuth";
import apiClient from "../../components/config/axios";

function TeacherManagement() {
    // const [state, setState] = React.useState({teacher: [], student: [], searchTeacher: ''})
    const [searchTeacher, setSearchTeacher] = useState('')
    const [searchTeacherProperty, setSearchTeacherProperty] = useState('NAME')
    const [teachers, setTeachers] = useState([])
    const [updatedTeachers, setUpdatedTeachers] = useState([]);
    const [addTeacherModal, setAddTeacherModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false)
    const jwtToken = localStorage.getItem('token')
    const navigate = useNavigate()
    const axios = apiClient(localStorage.getItem('token'))

    const getAllTeachers = ()=>{
        axios.get('/user/getAllTeachers',{
            headers : {
                'token' : localStorage.getItem('token')
            }
        })
        .then((res)=>{
            console.log(res)
            setTeachers(res.data)
        })
        .catch(err=>{
            console.log(err.response)
            isUnAuth(err, navigate)
        })
    }

    useEffect(()=>{
        // setState((st)=>({...st, teacher:['Ahmed', 'Zain']}))
        getAllTeachers()
    }, [])

    useEffect(() => {
        if (teachers.length > 0) {
          setUpdatedTeachers(teachers);
        }
      }, [teachers]);
    useEffect(()=>{
        if(searchTeacher.length > 0)
        {
            const updated = teachers.filter(teacher=>{
                if(searchTeacherProperty == "DEPARTMENT")
                {
                    return teacher[searchTeacherProperty].toLowerCase().includes(searchTeacher.toLowerCase())
                }
                else
                {
                    return teacher['User'][searchTeacherProperty].toLowerCase().includes(searchTeacher.toLowerCase())
                }
            })
            setUpdatedTeachers(updated)
        }
        else{
            setUpdatedTeachers(teachers)
        }
    }, [searchTeacher])


    const handleDeleteUser = (id)=>{
        const confirmDelete = window.confirm(`Are you sure you want to delete? ${id}`)
        if(confirmDelete === true)
        {
            console.log('Deleted successfully!')
            axios.delete(`/user/deleteTeacher/${id}`)
            .then((res)=>{
                setTeachers(res.data)
            })
            .catch(err=>{
                console.log(err)
                isUnAuth(err, navigate)
            })
        }
    }
    const toggleAddTeacher = ()=>{
        setAddTeacherModal(!addTeacherModal)
        if(isEditModal)
        {
            setIsEditModal(false)
            setEditUserID('')
        }
        
    }
    const [editUserID , setEditUserID] = useState('');
    
    const handleEditUser = (userID)=>{
        setEditUserID(userID)
        setIsEditModal(!isEditModal);
        toggleAddTeacher()
    }

    return ( 
        <>
            <div className="teacherManagement-container">
                <div className="teacherManagement-header">
                    <h1>Teacher Management</h1>
                    <span className="teacherManagement-leftHeader">
                        <input type="text" value={searchTeacher} onChange={e=>{setSearchTeacher(e.target.value)}} placeholder="Search Teachers.."/>
                        <select name="teacher_searchProperty" onChange={(e)=>{setSearchTeacherProperty(e.target.value)}} value={searchTeacherProperty}>
                            <option value="NAME">Name</option>
                            <option value="EMAIL">Email</option>
                            <option value="DEPARTMENT">Department</option>
                        </select>
                        <button onClick={()=>setAddTeacherModal(!addTeacherModal)}>+ Teacher</button>
                    </span>
                </div>
                <div className="teacherManagement-content">
                    <Table titles={['Name','Email','Department','Role','']}>
                        {updatedTeachers.map((teacher)=>{
                            return(
                                <tr key={teacher.ID}>
                                    <td>{teacher.User.NAME}</td>
                                    <td>{teacher.User.EMAIL}</td>
                                    <td>{teacher.DEPARTMENT}</td>
                                    <td>{teacher.User.Roles[0] ? teacher.User.Roles[0].NAME : ''}</td>
                                    <td className="table-btns">
                                        <span className="table-editBtn" onClick={()=>handleEditUser(teacher.ID)}>
                                            <MdEdit size={25}/>
                                        </span>
                                        <span className="table-deleteBtn" style={{marginLeft:"10px"}} onClick={()=>handleDeleteUser(teacher.ID)}>
                                            <MdDelete size={25} />
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                    </Table>
                    <AddTeacher show={addTeacherModal} close={toggleAddTeacher} isEdit={isEditModal} setTeachers={setTeachers} userID={editUserID} />
                </div>
            </div>
        </>
     );
}

export default TeacherManagement;