import axios from "axios";
import { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";
import Modal from "../Common/Modal";

function AddTeacher({show, close, isEdit, setTeachers, userID}) {

    const jwtToken = localStorage.getItem('token')
    const [teacherDetail, setTeacherDetail] = useState({
        NAME : "",
        EMAIL : "",
        PASSWORD : "",
        DEPARTMENT : "",
        EXPERIENCE : "",
        QUALIFICATION : ""
    })


    const updateTeacherDetail = (e)=>
    {
        const {name, value} = e.target
        setTeacherDetail(prevData=>({
            ...prevData,
            [name]:value
        }))
    }
    function clearForm()
    {
        setTeacherDetail({
            NAME : '',
            EMAIL : '',
            PASSWORD : '',
            DEPARTMENT : '',
            EXPERIENCE : '',
            QUALIFICATION : ''
        })
    }
    const AddTeacherHandle = async()=>{
    
        const {NAME, EMAIL, PASSWORD, DEPARTMENT, EXPERIENCE, QUALIFICATION} = teacherDetail
        if(NAME && EMAIL && PASSWORD && DEPARTMENT && EXPERIENCE && QUALIFICATION)
        {
            await axios.post('http://localhost:5000/user/addTeacher', teacherDetail, {
                headers: {
                    'token': `${jwtToken}`
                }
            })
            .then((res)=>{
                setTeachers(res.data)
            })
            .catch(err=>{
                alert(err.response.data.message)
            })
            clearForm()
            close()
        }
        else
        {
            alert("Please fill all fields!")
        }
        
    }

    const EditTeacherHandle = async()=>{
        await axios.post(`http://localhost:5000/user/editTeacher/${userID}`, teacherDetail, {
            headers: {
                'token': `${jwtToken}`
            }
        }).then((res)=>{
            setTeachers(res.data)
        }).catch((err)=>{
            console.log(err)
        })
        clearForm()
        close()

    }

    return ( 
        <Modal show={show} close={close}>
            <h2 style={{paddingBottom:'0.7rem'}}>{isEdit ? 'Edit':'Add'} a teacher</h2>
            <input type="text" placeholder="Name" name="NAME" onChange={updateTeacherDetail} value={teacherDetail.NAME}/>
            <input type="text" placeholder="Email" name="EMAIL" pattern="^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$" inputMode="email" onChange={updateTeacherDetail} value={teacherDetail.EMAIL}/>
            <input type="password" placeholder="Password" name="PASSWORD" onChange={updateTeacherDetail} value={teacherDetail.PASSWORD}/>
            <input type="text" placeholder="Department" name="DEPARTMENT" onChange={updateTeacherDetail} value={teacherDetail.DEPARTMENT}/>
            <input type="text" placeholder="Experience" name="EXPERIENCE" onChange={updateTeacherDetail} value={teacherDetail.EXPERIENCE}/>
            <input type="text" placeholder="Qualification" name="QUALIFICATION" onChange={updateTeacherDetail} value={teacherDetail.QUALIFICATION}/>
                        
            <input 
                type="submit" 
                value={`${isEdit ?'Save':'Add'}`} 
                className="addTeacherBtn" 
                onClick={!isEdit ? AddTeacherHandle:EditTeacherHandle}
            />
        </Modal>
     );
}

export default AddTeacher;