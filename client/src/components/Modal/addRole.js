import axios from "axios";
import { useState } from "react";
import Modal from "../Common/Modal";

function AddRole({show, close, setRoles}) {

    const jwtToken = localStorage.getItem('token')
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
        await axios.post('http://localhost:5000/settings/addRole', roleDetail,{
            headers : {
                'token': `${jwtToken}`
            }
        })
        .then(res=>{
            setRoles(res.data)
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