import { useState } from "react";
import Modal from "../Common/Modal";

function ChangeRole({show,close, role, setUserDetail}) {
    const [teacherDetail, setTeacherDetail] = useState({
        DEPARTMENT : "",
        EXPERIENCE : "",
        QUALIFICATION : ""
    })
    const [studentDetail, setStudentDetail] = useState({
        DEPARTMENT : '',
        ROLLNUM : '',
        BATCH : ''
    })

    function clearForm()
    {
        role !== "Teacher" ? setTeacherDetail({
            DEPARTMENT : "",
            EXPERIENCE : "",
            QUALIFICATION : ""
        })
        :
        setStudentDetail({
            DEPARTMENT : '',
            ROLLNUM : '',
            BATCH : ''
        })
    }

    const updateUserDetail = (e)=>
        {
            const {name, value} = e.target
            if(role !== "Teacher")
            {
                setTeacherDetail(prevData=>({
                    ...prevData,
                    [name]:value
                }))
            }
            else
            {
                setStudentDetail(prevData=>({
                    ...prevData,
                    [name]:value
                }))
            }
        }

        const submitHandle = ()=>{
            role !== "Teacher" ? setUserDetail(teacherDetail) : setUserDetail(studentDetail)
            clearForm()
            close()
        }


    return ( 
        <Modal show={show} close={close}>
            {role === "Student" ? <>
                <input type="text" placeholder="Department" name="DEPARTMENT" onChange={updateUserDetail} value={teacherDetail.DEPARTMENT}/>
                <input type="text" placeholder="Experience" name="EXPERIENCE" onChange={updateUserDetail} value={teacherDetail.EXPERIENCE}/>
                <input type="text" placeholder="Qualification" name="QUALIFICATION" onChange={updateUserDetail} value={teacherDetail.QUALIFICATION}/>
            </>:
            <>
                <input type="text" placeholder="Department" name="DEPARTMENT" onChange={updateUserDetail} value={studentDetail.DEPARTMENT}/>
                <input type="text" placeholder="Roll Number" name="ROLLNUM" onChange={updateUserDetail} value={studentDetail.ROLLNUM}/>
                <input type="text" placeholder="Batch" name="BATCH" onChange={updateUserDetail} value={studentDetail.BATCH}/>
            </>
            }
            <input type="submit" className="addTeacherBtn" value={"Submit"} onClick={submitHandle} />
        </Modal>
     );
}

export default ChangeRole;