import { useEffect, useState } from "react";
import Modal from "../Common/Modal";
import axios from "axios";

function AssignmentSection({show, close, setSection,selectedSecion, action, setUpdatedData, setInitial}) {
    const [sectionDetail, setSectionDetail] = useState({
        name : '',
        percentage : ''
    })
    const [prevSectionName, setPrevSectionName] = useState('')
    const jwtToken = localStorage.getItem('token')
    const handleSectionDetail = (e)=>{
        const {name, value} = e.target
        setSectionDetail({
            ...sectionDetail,
            [name] : value
        })
    }

    useEffect(()=>{
        if(action=='editSection')
        {
            setPrevSectionName(selectedSecion.key)
            setSectionDetail({
                name : selectedSecion.key,
                percentage : selectedSecion.value.percentage
            })
        }
    }, [selectedSecion])

    function updateSectionDetails(){
        const data = {
            studentID: selectedSecion.studentId,
            sectionID: selectedSecion.secId,
            prevName : prevSectionName,
            new : sectionDetail
        }
        axios.post('http://localhost:5000/academic/updateMarksSection', data, {
            headers : {
                'token' : jwtToken
            }
        })
        .then(res=>{
            console.log(res.data)
            setUpdatedData(res.data.MARKS_DATA)
            setInitial(res.data.MARKS_DATA)
        })
        .catch(err=>{
            //console.log
        })
    }

    const handleAddSection= ()=>{
        if(action=='addSection')
        {
            setSection(sectionDetail);
            close()
        }
        else if (action == 'editSection')
        {
            updateSectionDetails()
            close()
            //console.log("zain=>>> ",prevSectionName,sectionDetail, action)
        }
    }

    return ( 
        <>
            <Modal show={show} close={close}>
            <input type="text" placeholder="Section Name" name="name" onChange={handleSectionDetail} value={sectionDetail.name}/>
            <input type="text" placeholder="Percentage (e.g 10 )" name="percentage" onChange={handleSectionDetail} value={sectionDetail.percentage} />
            <br></br>
            <input 
                type="submit"
                value={`${action=='addSection' ? 'Add' : 'Update'}`}
                className="addTeacherBtn"
                onClick={handleAddSection}
            />
            </Modal>
        </>
     );
}

export default AssignmentSection;