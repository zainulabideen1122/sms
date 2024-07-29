import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import './index.css'
import AddRole from "../../components/Modal/addRole";
import Table from "../../components/Common/Table";

function Roles() {
    const [searchRole, setSearchRole] = useState('')
    const [updatedRoles, setUpdatedRoles] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const jwtToken = localStorage.getItem('token')
    const [userRole, setUserRole] = useState()
    const [showPermissions, setShowPermissions] = useState(false);
    const [addRoleModal, setAddRoleModal] = useState(false)


    useEffect(()=>{
        axios.get('http://localhost:5000/settings/roles',{
            headers: {
                'token': `${jwtToken}`
            }
        })
        .then((res)=>{
            console.log(res.data)
            setRoles(res.data)
            //setPermissions(res.data.Permissions)
        })
        .catch(err=>{
            console.log(err.response.data.message)
        })
    }, [])

    useEffect(()=>{
        setUpdatedRoles(roles);
    }, [roles])

    function fetchPermissions(user)
    {
        try {
             axios.get(`http://localhost:5000/userPermission/${user}`,{
                headers: {
                    'token': `${jwtToken}`
                }
            })
            .then((res)=>{
                setPermissions(res.data)
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleShowPermissions = (user)=>{
        
        setUserRole(user)
        setShowPermissions(true)
        if(user==userRole)
        {
            if(!showPermissions)
            {
                    console.log("=>",userRole)
                    // fetchPermissions(user)
            }else{
                setUserRole('')
            }
            setShowPermissions(!showPermissions)
        }
        else
        {
            const u = roles.filter((uu)=>{
                return uu.NAME == user
            })
            setPermissions(u[0].Permissions)
        }
    }
    const handleDeletePermission = ()=>{

    }

    const addModalToggle = ()=>{
        setAddRoleModal(!addRoleModal)
    }
     
    return ( 
        <>
            <div className="roles_container">
                <div className="teacherManagement-header">
                    <h1>Roles</h1>
                    <span className="teacherManagement-leftHeader">
                        <input type="text" value={searchRole} onChange={e=>{setSearchRole(e.target.value)}} placeholder="Search Roles.."/>
                        <button onClick={()=>setAddRoleModal(true)}>+ New Role</button>
                    </span>
                </div>

                <div className="teacherManagement-content">
                    <Table titles={['Role Name','Description','Actions']}>
                        {updatedRoles.map((role)=>{
                            return(
                                <tr key={role.ID}>
                                    <td>{role.NAME}</td>
                                    <td>{role.DESCRIPTION}</td>
                                    <td className="showPermissionBtn" onClick={()=>handleShowPermissions(role.NAME)}>{userRole===role.NAME? 'Hide':'See'} permissions</td>
                                </tr>
                            )
                        })}
                        
                    </Table>
                   

                    { showPermissions && <div>
                    <span className="teacherManagement-leftHeader" style={{float:"right", margin:"0.5rem 0"}}>   
                        <button>New Permission  </button>
                    </span>
                    <Table titles={['No.','Permission','Description','']}>
                        {permissions.map((per, index)=>{
                            return(
                                <tr key={per.ID}>
                                    <td>{per.ID}</td>
                                    <td>{per.NAME}</td>
                                    <td>{per.DESCRIPTION}</td>
                                    <td>
                                        <span className="table-deleteBtn" onClick={()=>handleDeletePermission(per.ID)} >
                                            <MdDelete size={25} />
                                        </span>
                                    </td>
                                </tr>
                            )
                        })}
                        
                    </Table>  
                        
                    </div>}
                <AddRole show={addRoleModal} close={addModalToggle} setRoles={setRoles}/>
                </div>

            </div>
        </>
     );
}

export default Roles;