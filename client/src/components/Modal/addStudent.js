import axios from "axios";
import { useState } from "react"
import Modal from "../Common/Modal";
import apiClient from "../config/axios";
import isUnAuth from "../../utils/checkUnAuth";
import { useNavigate } from "react-router-dom";

function AddStudent({show, close, isEdit, setStudents, userID}) {
    const jwtToken = localStorage.getItem('token')
    const navigate = useNavigate()
    const axios = apiClient(localStorage.getItem('token'))
    const [studentDetail, setStudentDetail] = useState({
        NAME : '',
        EMAIL : '',
        PASSWORD : '',
        DEPARTMENT : '',
        ROLLNUM : '',
        BATCH : ''
    })



    const updateStudentDetail = (e)=>
    {
        const {name, value} = e.target
        setStudentDetail(prevData=>({
            ...prevData,
            [name]:value
        }))
    }
    function clearForm()
    {
        setStudentDetail({
            NAME : '',
            EMAIL : '',
            PASSWORD : '',
            DEPARTMENT : '',
            ROLLNUM : '',
            BATCH : '',
        })
    }

    const AddStudentHandle = async()=>{
        const {NAME, EMAIL, PASSWORD, DEPARTMENT, ROLLNUM, BATCH} = studentDetail
        if(NAME && EMAIL && PASSWORD && DEPARTMENT  && ROLLNUM && BATCH){
            await axios.post('/user/addStudent', studentDetail)
            .then((res)=>{
                setStudents(res.data)
            })
            .catch(err=>{
                alert(err.response)
                isUnAuth(err, navigate)
            })
            clearForm()
            close()
        }
        else{
            
            alert("Please fill all fields!")
        }
        
    }
    
    const EditStudentHandle = async()=>{
        await axios.post(`/user/editStudent/${userID}`, studentDetail)
        .then((res)=>{
            setStudents(res.data)
        }).catch((err)=>{
            console.log(err)
            isUnAuth(err, navigate)
        })
        clearForm()
        close()
    }

    return ( 
        <Modal show={show} close={close}>
            <h2 style={{paddingBottom:'0.7rem'}}>{isEdit ? 'Edit':'Add'} a Student</h2>
            <input type="text" placeholder="Name" name="NAME" onChange={updateStudentDetail} value={studentDetail.NAME}/>
            <input type="text" placeholder="Email" name="EMAIL" onChange={updateStudentDetail} value={studentDetail.EMAIL}/>
            <input type="password" placeholder="Password" name="PASSWORD" onChange={updateStudentDetail} value={studentDetail.PASSWORD}/>
            <input type="text" placeholder="Department" name="DEPARTMENT" onChange={updateStudentDetail} value={studentDetail.DEPARTMENT}/>
            <input type="text" placeholder="Roll Number" name="ROLLNUM" onChange={updateStudentDetail} value={studentDetail.ROLLNUM}/>
            <input type="text" placeholder="Batch" name="BATCH" onChange={updateStudentDetail} value={studentDetail.BATCH}/>                        
            <input 
                type="submit" 
                value={`${isEdit ?'Save':'Add'}`} 
                className="addTeacherBtn" 
                onClick={!isEdit ? AddStudentHandle:EditStudentHandle}
            />
        </Modal>
     );
}

export default AddStudent;