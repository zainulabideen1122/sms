import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "./config/axios";

function ChangePassword() {
    const [passwords, setPasswords] = useState({
        old:'',
        new:'',
        confirm:''
    })
    const navigate = useNavigate()
    const axios = apiClient(localStorage.getItem('token'))

    const handleOnChangePassword = (e)=>{
        const {name, value} = e.target

        setPasswords({
            ...passwords,
            [name] : value
        })
    }

    const handleChangePassword = ()=>{
        if(passwords.new !== passwords.confirm)
        {
            alert("New and Confirm passwords doesn't match!")
        }
        else{
            
        }
    }

    return ( 
        <>
            <div className="changePass_Container">
                <button className="btnStyle" onClick={()=>navigate('/')}>Back</button>
                <div className="changePass_div">
                    <input type="password" name="old" value={passwords.old} onChange={handleOnChangePassword} placeholder="Old Password"/>
                    <input type="password" name="new" value={passwords.new} onChange={handleOnChangePassword} placeholder="New Password"/>
                    <input type="password" name="confirm" value={passwords.confirm} onChange={handleOnChangePassword} placeholder="Confirm New Password"/>
                    <button className="addBtn" onClick={handleChangePassword}>Change</button>
                </div>
            </div>
        </>
     );
}

export default ChangePassword;