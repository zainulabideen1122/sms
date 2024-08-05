import axios from "axios";
import { useState } from "react";
import Modal from "../Common/Modal";
import isUnAuth from "../../utils/checkUnAuth";
import { useNavigate } from "react-router-dom";
import apiClient from "../config/axios";

function AddCourse({show, close, setCourses}) {
    const [courseDetail, setCourseDetail] = useState({
        CODE: '',
        NAME: '',
        DEPARTMENT: ''
    })
    const jwtToken = localStorage.getItem('token')
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()


    const updateCourseDetail = (e)=>
        {
            const {name, value} = e.target
            setCourseDetail(prevData=>({
                ...prevData,
                [name]:value
            }))
        }
    function clearForm(){
        setCourseDetail({
            CODE: '',
            NAME: '',
            DEPARTMENT: ''
        })
    }
    
    function handleAddCourse(){
        axios.post('/courses/addCourse', courseDetail)
        .then(res=>{
            setCourses(res.data)
        })
        .catch(err=>{
            console.log(err)
            isUnAuth(err, navigate)
        })
        clearForm()
        close()
    }

    return ( 
        <Modal show={show} close={close}>
            <input type="text" placeholder="Course Code" name="CODE" value={courseDetail.CODE} onChange={updateCourseDetail}/>
            <input type="text" placeholder="Course Name" name="NAME" value={courseDetail.NAME} onChange={updateCourseDetail}/>
            <input type="text" placeholder="Department" name="DEPARTMENT" value={courseDetail.DEPARTMENT} onChange={updateCourseDetail}/>
            <br></br>
            <input 
                type="submit" 
                value="Add"
                className="addTeacherBtn" 
                onClick={handleAddCourse}
            />
        </Modal>
     );
}

export default AddCourse;