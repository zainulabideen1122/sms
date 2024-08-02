import { useEffect, useMemo, useState } from "react";
import Modal from "../Common/Modal";
import axios from "axios";
import AssignmentSection from "./addAssignmentSection";
import AssignmentMarks from "./addAssignmentMarks";
import Table from "../Common/Table";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

function ManageStudentMarks({show, close, student}) {
    const [sectionNameModal, setSectionNameModal] = useState(false)
    const [sectionMarksModal, setSectionMarksModal] = useState(false)
    const [studentData, setStudentData] = useState({})
    const [selectedSection, setSelecetedSection] = useState({})
    const [initialStudentData, setInitialStudentData] = useState({})
    const [selectedAction, setSelectedAction] = useState('addMarks')
    const [selectedMarkId, setSelectedMarkId] = useState('')

    const jwtToken = localStorage.getItem('token')

    console.log(student)
    const handleSetSection = (obj)=>{
        //console.log(name)
        const {name, percentage} = obj
        setStudentData({
            ...studentData,
            [name] : {
                percentage : percentage,
                marks :  []
            }
        })
    }
    function toggleSectionName(){
        setSectionNameModal(!sectionNameModal)
        
    }
    function toggleSectionMarks(){
        setSectionMarksModal(!sectionMarksModal)
    }
    useEffect(()=>{
        if(show)
        {
            const data = {
                sectionID : student.SectionStudent ? student.SectionStudent.SECTION_ID:'',
                studentID : student.ID
            }
            axios.post('http://localhost:5000/academic/getStudentMarks',data,{
                headers : {
                    'token'  : jwtToken
                }
            })
            .then(res=>{
                //console.log(res)
                if(res.data==null)
                {
                   setStudentData({})
                   setInitialStudentData({}) 
                }else{
                    setStudentData(res.data.MARKS_DATA)
                    setInitialStudentData(res.data.MARKS_DATA)
                }
            
            })
        }
    }, [show])

    const handleDisableBtn = ()=>{
        const initStudentData = JSON.stringify(initialStudentData);
        const currentStudentData = JSON.stringify(studentData);
        return (initStudentData === currentStudentData)
    }
    const isDisabled = useMemo(() => handleDisableBtn(), [studentData])

    const handleSaveMarks = ()=>{
        if(!handleDisableBtn())
        {
            const data = {
                sectionID : student.SectionStudent ? student.SectionStudent.SECTION_ID:'',
                studentID : student.ID,
                marksData : studentData
            }
            axios.post('http://localhost:5000/academic/addStudentMarks', data, {
                headers:{
                    'token' : jwtToken
                }
            })
            .then(res=>{
                console.log(res.data)
                setStudentData(res.data.MARKS_DATA)
                setInitialStudentData(res.data.MARKS_DATA)
            }).catch(err=>{
                //console.log
            })
        }
    }
    function dummyFunction(){}
    const handleCloseModal = ()=>
    {
        if(!handleDisableBtn())
        {
            if(window.confirm('There are unsaved changes, are you sure you want to close?'))
            {
                return close()
            }
            else{
                return dummyFunction()
            }
        }
        else{
            return close()
        }
    }


    const handleEditMarkItem = (mark, section)=>{
        setSelectedMarkId(mark.id)
        setSelectedAction('editMarks');
        setSectionMarksModal(true); 
        setSelecetedSection({key: section, value: studentData[section]})
    }

    const handleDeleteMark = (section, markID)=>{
        const updatedMarks = studentData[section].marks.filter(mark => mark.id !== markID);
        // setSection({
        //     ...allSections,
        //     [section.key]: {
        //     ...section.value,
        //     marks: updatedMarks
        //     }
        // });
        setStudentData({
            ...studentData,
            [section] : {
                ...studentData[section],
                marks : updatedMarks
            }
        })
    }

    return ( 
        <div className="testingZ" style={{height:"30vh !important"}}>
        <Modal show={show} close={handleCloseModal} width={'70%'}>
            <div className="assignStudent-header">
                <h1>{student.User && student.User.NAME} Marks</h1>
                <span className="teacherManagement-leftHeader">
                    <button className="btnStyle" onClick={()=>{setSelectedAction('addSection');setSectionNameModal(true)}}>Add New Section</button>
                </span>
            </div>
            <div className="teacherManagement-content">
                {Object.keys(studentData).length <= 0 && <h1 style={{textAlign:'center'}}>No data to show</h1>}
                {Object.keys(studentData).length > 0 && Object.keys(studentData).map(section=>{
                    return(
                        <div style={{display:'flex',flexDirection:'column'}} key={section}>
                        <span className="marksSectionBtns">
                            <button onClick={()=>{setSelectedAction('addMarks');setSectionMarksModal(true);setSelectedAction('addSection');setSelecetedSection({key: section, value: studentData[section]})}} className="btnStyle" style={{width:'100%'}}>Add {section} marks</button>
                            <span className="table-editBtn" style={{cursor:'pointer'}}>
                                <MdEdit size={25} onClick={()=>{setSectionNameModal(true);setSelecetedSection({ secId:student.SectionStudent.SECTION_ID, studentId:student.ID , key: section, value: studentData[section]}); setSelectedAction('editSection')}} />
                            </span>
                        </span>
                        <fieldset className="marksFieldSet">
                            <legend>{section}:  (Total Marks: {studentData[section].percentage}) </legend>
                            {studentData[section].marks.length <= 0 ? <h1 style={{textAlign:'center', padding:'1rem 1rem 1.5rem'}}>No data to show</h1> :
                            <Table titles={['Sr.', 'Obt.','Total','']}>
                                {studentData[section].marks && studentData[section].marks.map((mark, idx)=>{
                                    return(
                                        <tr key={mark.id}>
                                            <td>{mark.id}</td>
                                            <td>{mark.obtained}</td>
                                            <td>{mark.total}</td>
                                            <td className="table-btns">
                                                <span className="table-editBtn">
                                                    <MdEdit size={25} onClick={()=>{handleEditMarkItem(mark, section)}}/>
                                                </span>
                                                <span className="table-deleteBtn" style={{marginLeft:"10px"}} onClick={()=>handleDeleteMark(section, mark.id)} >
                                                    <MdDelete size={25} />
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </Table>
                            }
                            
                        </fieldset>
                        </div>
                    )
                })}
                <button onClick={handleSaveMarks} disabled={isDisabled} className="addBtn" style={isDisabled?{background:'gray'} : {}}>Save</button>
            </div>
            <AssignmentSection show={sectionNameModal} close={toggleSectionName} setSection={handleSetSection} selectedSecion={selectedSection} action={selectedAction} setUpdatedData={setStudentData} setInitial={setInitialStudentData}/>
            <AssignmentMarks show={sectionMarksModal} close={toggleSectionMarks} section={selectedSection} allSections={studentData} setSection={setStudentData} action={selectedAction} markId={selectedMarkId}/>
        </Modal>
        </div>
     );
}

export default ManageStudentMarks;