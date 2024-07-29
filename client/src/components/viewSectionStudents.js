import { useState } from "react";
import AssignStudent from "./Modal/assignStudent";
import axios from "axios";
import Table from "./Common/Table";

function SectionStudents({show, section, setSelectedSection}) {

    const [assignSectionModal, setAssignSectionModal] = useState(false)
    function toggleAssignStudent(){
        setAssignSectionModal(!assignSectionModal)
    }
    const jwtToken = localStorage.getItem('token')
    
    async function handleUnrollStudent (studentID)
    {
        const data = {sectionID : section.ID, studentID : studentID}
        await axios.post('http://localhost:5000/user/unrollStudenFromSection', data,{
            headers:{
                'token' : jwtToken
            }
        })
        .then(res=>{
            console.log(res.data)
            setSelectedSection(res.data)
        })
    }

    return ( 
        <>
        {show && 
        <div className="teacherManagement-content">
            <button style={{float:"right", marginBottom:"1rem"}} className="btnStyle" onClick={()=>setAssignSectionModal(true)}>Assign Student</button>
            <Table titles={['Name', 'Roll Num', 'Department', '']}>
                {section.Students.map(student=>{
                    return(
                        <tr key={student.ID}>
                            <td>{student.User.NAME}</td>
                            <td>{student.ROLLNUM}</td>
                            <td>{student.DEPARTMENT}</td>
                            <td>
                                <button className="btnStyle" onClick={()=>handleUnrollStudent(student.ID)}>Unroll</button>
                            </td>
                        </tr>
                    )
                })}
            </Table>
            <AssignStudent show={assignSectionModal} close={toggleAssignStudent} sectionId={section.ID} setSelectedSection={setSelectedSection} registeredStudents={section.Students} />
        </div>}
        </>
     );
}

export default SectionStudents;