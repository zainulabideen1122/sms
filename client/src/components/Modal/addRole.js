import axios from "axios";
import { useState } from "react";
import Modal from "../Common/Modal";
import apiClient from "../config/axios";
import { useNavigate } from "react-router-dom";
import isUnAuth from "../../utils/checkUnAuth";

function AddRole({show, close, setRoles}) {

    const jwtToken = localStorage.getItem('token')
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const [roleDetail, setRoleDetail] = useState({
        NAME : '',
        DESCRIPTION : ''
    })
    const updateRoleDetail = (e)=>
        {
            const {name, value} = e.target
            setRoleDetail(prevData=>({
                ...prevData,
                [name]:value
            }))
        }

    const clearForm = ()=>{
        setRoleDetail({
            NAME : '',
            DESCRIPTION : ''
        })
    }
    const addRoleHandle = async()=>{
        await axios.post('/settings/addRole', roleDetail)
        .then(res=>{
            setRoles(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })
        clearForm()
        close()
    }

    return ( 
        <Modal show={show} close={close}>
            <input type="text" placeholder="Name" name="NAME" onChange={updateRoleDetail} value={roleDetail.NAME}/>
            <input type="text" placeholder="Description" name="DESCRIPTION" onChange={updateRoleDetail} value={roleDetail.DESCRIPTION}/>
            <input 
                type="submit" 
                value="Add"
                className="addTeacherBtn" 
                onClick={addRoleHandle}
            />
        </Modal>
         );
}

export default AddRole;