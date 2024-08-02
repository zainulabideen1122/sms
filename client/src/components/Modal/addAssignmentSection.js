import { useState } from "react";
import Modal from "../Common/Modal";

function AssignmentSection({show, close, setSection}) {
    const [sectionDetail, setSectionDetail] = useState({
        name : '',
        percentage : ''
    })
    const handleSectionDetail = (e)=>{
        const {name, value} = e.target
        setSectionDetail({
            ...sectionDetail,
            [name] : value
        })
    }
    return ( 
        <>
            <Modal show={show} close={close}>
            <input type="text" placeholder="Section Name" name="name" onChange={handleSectionDetail} value={sectionDetail.name}/>
            <input type="text" placeholder="Percentage (e.g 10 )" name="percentage" onChange={handleSectionDetail} value={sectionDetail.percentage} />
            <br></br>
            <input 
                type="submit" 
                value="Add"
                className="addTeacherBtn"
                onClick={()=>{setSection(sectionDetail);close()}}
            />
            </Modal>
        </>
     );
}

export default AssignmentSection;