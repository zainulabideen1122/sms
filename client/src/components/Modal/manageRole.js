import { Link, useNavigate, useParams } from 'react-router-dom';
import '../index.css'
import { useEffect, useReducer, useState } from 'react';
import { ImCheckboxChecked , ImCheckboxUnchecked } from "react-icons/im";
import axios from 'axios';
import ChangeRole from './changeRole';
import apiClient from '../config/axios';
import isUnAuth from '../../utils/checkUnAuth';

function ManageRoles({selectedUser}) {
    const jwtToken = localStorage.getItem('token')
    const {id}= useParams()
    const [roles, setRoles] = useState([])
    const [userRole, setUserRole] = useState({
        ID : selectedUser.Roles[0].ID,
        NAME : selectedUser.Roles[0].NAME
    })
    const [changeUserModalStatus, setChangeUserModalStatus] = useState(false)
    const [userExtraDetail, setUserExtraDetail] = useState('')
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()

    const getRoles = async()=>{
        await axios.get('/settings/roles')
        .then((res)=>{
            setRoles(res.data)
        })
        .catch(err=>{
            console.log(err.response.data.message)
            isUnAuth(err, navigate)
        })
    }

    useEffect(()=>{
        getRoles()
    }, [])

    useEffect(()=>{
        if(changeUserModalStatus==false && userExtraDetail)
        {
            const changeR = userRole.NAME=="Teacher" ? "Student" : "Teacher"
            setUserRole({...userRole, NAME:changeR})
            axios.post(`/settings/updateUserRole/${id}`,{
                        roleID:userRole.ID,
                        deleteFrom : userRole.NAME,
                        insertTo: changeR,
                        userDetail : userExtraDetail
                    })
                    .then(res=>{
                        console.log(res)
                    })
                    .catch(err=>{
                        isUnAuth(err, navigate)
                    })

        }
    }, [changeUserModalStatus])

    const handleChangeRole = async(URole, roleID)=>{
        if(userRole.NAME.toLowerCase() === 'Admin')
        {
            alert("You cannot change the role of an admin!")
        }
        else if (URole != userRole.NAME)
        {
            setUserRole({...userRole, ID:roleID})
            setChangeUserModalStatus(true)
        }

    }

    const toggleChangeRoleModal = ()=>{
        setChangeUserModalStatus(!changeUserModalStatus)
    }

    return ( 
        <>
            <div className="manageRoles_container">
                <div className="manageRoles_header">
                    <Link to='/systemSettings/roleManagement'><button className='black'>{'<'} back</button></Link>
                    <Link to='/systemSettings/roles'><button className='lightGray'>Role based permissions</button></Link>
                </div>

                <div className='manageRoles_content'>
                    {roles.map((role)=>{
                        return(
                            <div key={role.ID} className={`manageRoles_card ${userRole.NAME === role.NAME ? 'green':'manageRoles_cardHover'}`}>
                                <div onClick={()=>handleChangeRole(role.NAME, role.ID)}>
                                    <h2 className='manageRoles_card_header'>
                                        {userRole.NAME === role.NAME && <ImCheckboxChecked size={15} className='checkbox_checkedIcon'/>}
                                        {userRole.NAME !== role.NAME && <ImCheckboxUnchecked size={15} className='checkbox_uncheckedIcon'/>}
                                        {role.NAME}
                                    </h2>
                                    <p>{role.DESCRIPTION}</p>
                                </div>
                                <Link to='/systemSettings/roles'>See permissions</Link>
                            </div>
                        )
                    })}

                    {/* {<ChangeRole changeUserModalStatus={changeUserModalStatus} role={userRole} />}  */}
                    {<ChangeRole show={changeUserModalStatus} close={toggleChangeRoleModal} role={userRole.NAME} setUserDetail={setUserExtraDetail} />}
                </div>
            </div>
        </>
     );
}


export default ManageRoles;