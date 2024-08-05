import { useState } from "react";
import Modal from "../Common/Modal";
import axios from "axios";
import apiClient from "../config/axios";
import isUnAuth from "../../utils/checkUnAuth";
import { useNavigate } from "react-router-dom";

function AddSection({show, close, courseID, setCourses}) {
    const [sectionDetail, setSectionDetail] = useState({
        NAME : '',
        courseID : ''
    })
    const jwtToken = localStorage.getItem('token')
    const navigate = useNavigate()
    const axios = apiClient(localStorage.getItem('token'))
    
    const handleAddSection = ()=>{
        // setSectionDetail({courseID : courseID})
        const updatedObj = Object.assign(sectionDetail, {courseID : courseID})
        axios.post('/courses/addSectionToCourse', updatedObj)
        .then(res=>{
            setCourses(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })
        close()
    }

    return ( 
        <Modal show={show} close={close}>
            <input type="text" placeholder="Section Name" name="NAME" onChange={(e)=>setSectionDetail({...sectionDetail, NAME : e.target.value})} value={sectionDetail.NAME}/>
            <br></br>
            <input 
                type="submit" 
                value="Add"
                className="addTeacherBtn"
                onClick={handleAddSection}
            />
        </Modal>
     );
}

export default AddSection;