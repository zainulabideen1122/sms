import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/Common/Table";

function RoleManagement({onSelectUser}) {
    const [searchUser, setSearchUser] = useState('')
    const [searchUserFilter, setSearchUserFilter] = useState('All')
    const [users, setUsers] = useState([])
    const [updatedUsers, setUpdatedUsers] = useState([]);
    const jwtToken = localStorage.getItem('token')


    useEffect(()=>{
            axios.get('http://localhost:5000/user/getAllUsers',{
                headers: {
                    'token': `${jwtToken}`
                }
            })
            .then((res)=>{
                console.log(res.data)
                setUsers(res.data)
            })
            .catch(err=>{
                console.log(err.response.data.message)
            })
    }, [])

    useEffect(()=>{
        if(searchUserFilter == "All")
        {
            setUpdatedUsers(users)
        }
        else if (searchUserFilter == "Teachers")
        {
            const updated = users.filter(user=>{
                if(user.Roles[0] != undefined)
                {
                    return user.Roles[0].NAME == "Teacher"
                }
            })
            console.log(updated)
        }
        else if (searchUserFilter == "Students")
            {
                const neW = []
                users.map(user => {
                    console.log(user)
                    if(user.Roles[0] != undefined)
                    {
                        if(user.Roles[0].NAME == "Student")
                        {
                            neW.push(user)
                            console.log(user)
                        }
                    }
                    
                });
                console.log("neW")
            }
    },[searchUserFilter])

    const userRoleSearchCondition = (user)=>{
        if(user.Roles[0] != undefined)
        {
            return user.Roles[0].NAME.toLowerCase().includes(searchUser.toLowerCase())
        }
        else
        {
            return false
        }
    }

    useEffect(() => {
        
          setUpdatedUsers(users);
        
      }, [users, searchUserFilter]);

    useEffect(()=>{
        if(searchUser.length > 0)
        {
            const updated = users.filter(user=>{
                return (user['NAME'].toLowerCase().includes(searchUser.toLowerCase()) || userRoleSearchCondition(user))
            })
            setUpdatedUsers(updated)
        }
        else{
            setUpdatedUsers(users)
        }
    }, [searchUser])


    return ( 
        <>
            <div className="roleManagement_container">
                <div className="teacherManagement-header">
                    <h1>Role Management</h1>
                    <span className="teacherManagement-leftHeader">
                        <input type="text" value={searchUser} onChange={e=>{setSearchUser(e.target.value)}} placeholder="Search Users.."/>
                        <select name="teacher_searchProperty" onChange={(e)=>{setSearchUserFilter(e.target.value);setUsers([])}} value={searchUserFilter}>
                            <option value="All">All</option>
                            <option value="Teachers">Teachers</option>
                            <option value="Students">Students</option>
                        </select>
                    </span>
                </div>
                <div className="teacherManagement-content">
                    <Table titles={['Id.', 'Name', 'Email', 'Role','']}>
                        {updatedUsers.map((user)=>{
                            return(
                                <tr key={user.ID}>
                                    <td>{ user.ID }</td>
                                    <td>{ user.NAME}</td>
                                    <td>{ user.EMAIL }</td>
                                    <td>{user.Roles[0] ? user.Roles[0].NAME : ''}</td>
                                    <td onClick={()=>onSelectUser(user)}><Link to={`/systemSettings/roleManagement/${user.ID}`}>Manage</Link></td>
                                </tr>
                            )
                        })}
                        
                    </Table>
                    {/* <AddTeacher show={addTeacherModal} close={toggleAddTeacher} isEdit={isEditModal} setTeachers={setTeachers} userID={editUserID} /> */}
                                          
                </div>
            </div>
        </>
     );
}

export default RoleManagement;