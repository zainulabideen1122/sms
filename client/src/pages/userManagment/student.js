import axios from "axios";
import { useState, useEffect } from "react";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import AddStudent from "../../components/Modal/addStudent";
import Table from "../../components/Common/Table";

function StudentManagement() {

    const [searchStudent, setSearchStudent] = useState('')
    const [searchStudentProperty, setSearchStudentProperty] = useState('NAME')
    const [students, setStudents] = useState([])
    const [updatedStudents, setUpdatedStudents] = useState([]);
    const [addStudentModal, setAddStudentModal] = useState(false);
    const [isEditModal, setIsEditModal] = useState(false)
    const jwtToken = localStorage.getItem('token')
    useEffect(()=>{
        // setState((st)=>({...st, teacher:['Ahmed', 'Zain']}))
        axios.get('http://localhost:5000/user/getAllStudents',{
            headers: {
                'token': `${jwtToken}`
            }
        })
        .then((res)=>{
            console.log(res.data)
            setStudents(res.data)
        })
        .catch(err=>{
            console.log(err.response.data.message)
        })
    }, [])

    useEffect(() => {
        if (students.length > 0) {
          setUpdatedStudents(students);
        }
      }, [students]);
    useEffect(()=>{
        if(searchStudent.length > 0)
        {
            const updated = students.filter(student=>{
                if(searchStudentProperty == "DEPARTMENT")
                {
                    return student[searchStudentProperty].toLowerCase().includes(searchStudent.toLowerCase())
                }
                else
                {
                    return student['User'][searchStudentProperty].toLowerCase().includes(searchStudent.toLowerCase())
                }
            })
            setUpdatedStudents(updated)
        }
        else{
            setUpdatedStudents(students)
        }
    }, [searchStudent])

    const handleDeleteUser = (id)=>{
        const confirmDelete = window.confirm("Are you sure you want to delete?")
        if(confirmDelete === true)
        {
            console.log('Deleted successfully!')
            axios.delete(`http://localhost:5000/user/deleteStudent/${id}`,{
                headers: {
                    'token': `${jwtToken}`
                }
            })
            .then((res)=>{
                setStudents(res.data)
            })
            .catch(err=>{
                console.log(err)
            })
        }
    }

    const toggleAddStudent = ()=>{
        setAddStudentModal(!addStudentModal)
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
        toggleAddStudent()
    }

    return ( 
        <>
            <div className="studentManagement-container">
                <div className="teacherManagement-header">
                    <h1>Student Management</h1>
                    <span className="teacherManagement-leftHeader">
                        <input type="text" value={searchStudent} onChange={e=>{setSearchStudent(e.target.value)}} placeholder="Search Teachers.."/>
                        <select name="teacher_searchProperty" onChange={(e)=>{setSearchStudentProperty(e.target.value)}} value={searchStudentProperty}>
                            <option value="NAME">Name</option>
                            <option value="EMAIL">Email</option>
                            <option value="DEPARTMENT">Department</option>
                        </select>
                        <button onClick={()=>setAddStudentModal(!addStudentModal)}>+ Student</button>
                    </span>
                </div>

                <div className="teacherManagement-content">
                    <Table titles={['Name', 'Email','Roll Num','Department','Role','']}>
                        {updatedStudents.map((student)=>{
                            return(
                                <tr key={student.User.ID}>
                                    <td>{student.User.NAME}</td>
                                    <td>{student.User.EMAIL}</td>
                                    <td>{student.ROLLNUM}</td>
                                    <td>{student.DEPARTMENT}</td>
                                    <td>{student.User.Roles[0] ? student.User.Roles[0].NAME : ''}</td>
                                    <td className="table-btns">
                                        <span className="table-editBtn" onClick={()=>handleEditUser(student.ID)}>
                                            <MdEdit size={25}/>
                                        </span>
                                        <span className="table-deleteBtn" style={{marginLeft:"10px"}} onClick={()=>handleDeleteUser(student.ID)} >
                                            <MdDelete size={25} />
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                        
                    </Table>
                    <AddStudent show={addStudentModal} close={toggleAddStudent} isEdit={isEditModal} setStudents={setStudents} userID={editUserID} />
                </div>

            </div>
        </>
     );
}

export default StudentManagement;