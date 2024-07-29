import { useContext, useEffect, useState } from "react";
import Modal from "../Common/Modal";
import { IoClose } from "react-icons/io5";
import axios from "axios";
import Table from "../Common/Table";

function AssignStudent({show, close, sectionId, setSelectedSection, registeredStudents}) {

    console.log(sectionId)
    const [filters, setFilters] = useState({
        batches : [],
        departments : []
    }) 
    const [allStudents, setAllStudents] = useState([])
    const [searchFilter, setSearchFilter] = useState('')
    const [updatedStudents, setUpdatedStudents] = useState([])
    const [selectedStudents, setSelectedStudents] = useState({
        ids : []
    })



    const jwtToken = localStorage.getItem('token')
    console.log(registeredStudents)
    useEffect(()=>{
        const updated = allStudents.filter(student=>{
            const nameMatch = searchFilter.length === 0 || student['User']['NAME'].toLowerCase().includes(searchFilter.toLowerCase());
            const batchMatch = filters.batches.length === 0 || filters.batches.includes(student['BATCH'].toString());
            const departmentMatch = filters.departments.length === 0 || filters.departments.includes(student['DEPARTMENT'].toString());
            return nameMatch && batchMatch && departmentMatch;
        })
        setUpdatedStudents(updated)
            
    },[searchFilter,filters])

    useEffect(()=>{
        {show && axios.get('http://localhost:5000/user/getAllStudents',{
            headers:{
                'token' : jwtToken
            }
        })
        .then(res=>{
            console.log(res.data)
            setAllStudents(res.data)
            setUpdatedStudents(res.data)
        })}
    }, [show])

    const handleAddBatchTag = (e)=>{
        if(e.key == 'Enter')
        {
            const newValue = e.target.value.trim();
            if (!filters.batches.includes(newValue)) {
                setFilters({
                    ...filters,
                    batches: [...filters.batches, newValue]
                });
            }
            e.target.value = '';
            
        }
    }

    const handleRemoveBatchTag = (index)=>{
        setFilters({
            ...filters,
            batches: filters.batches.filter((batch, i) => i !== index)
        });
    }

    const handleAddDepartmentTag = (e)=>{
        if(e.key == 'Enter')
        {
            setFilters({
                ...filters,
                departments: [...filters.departments, e.target.value.trim().toUpperCase()]
            })
            e.target.value = null
        }
    }

    const handleRemoveDepartmentTag = (index)=>{
        setFilters({
            ...filters,
            departments: filters.departments.filter((batch, i) => i !== index)
        });
    }
    function handleAddStudentId(e){
        const value = parseInt(e.target.value)
        if(e.target.checked)
        {
            setSelectedStudents({
                ...selectedStudents,
                ids : [...selectedStudents.ids, value]
            })
        }
        else
        {
            setSelectedStudents({
                ...selectedStudents,
                ids: selectedStudents.ids.filter((id) => id !== value)
            })
        }
    }


    const handleSubmitStudentAssignment = async()=>{
        const students = allStudents.filter((student) =>
            selectedStudents.ids.includes(student.ID)
        );
        
        if(students.length > 0)
        {
            const updated = Object.assign({students:students}, {sectionID: sectionId})
            await axios.post('http://localhost:5000/user/addStudentsToSection',updated,{
                headers : {
                    'token' : jwtToken
                }
            })
            .then(res=>{
                console.log(res)
                setSelectedSection(res.data)
            })            
        }
        else
        {
            alert('No students selected!')
        }
        clearFilters()
        close()
    }

    function clearFilters()
    {
        setSearchFilter('')
        setFilters({
            batches : [],
            departments : []
        })
    }

    return ( 
        <Modal show={show} close={close} width={'100%'}>
            <div className="assignStudent-header">
                <h1>Filters</h1>
                <div className="assignStudent-filters">
                    <div className="assignStudent-batchFilter">
                        <input type="text" placeholder="Name" value={searchFilter} onChange={e=>setSearchFilter(e.target.value)} />
                    </div>
                    <div className="assignStudent-batchFilter">
                        {filters.departments.map((department, index)=>{
                            return(
                                <div className="batchTag" key={index} onClick={()=>handleRemoveDepartmentTag(index)}>
                                    {department}
                                    <IoClose className="deleteAssignTag"/>
                                </div>
                            )
                        })}
                        <input type="text" placeholder="Department" onKeyDown={handleAddDepartmentTag}/>
                    </div>
                    <div className="assignStudent-batchFilter">
                        {filters.batches.map((batch, index)=>{
                            return(
                                <div className="batchTag" key={index} onClick={()=>handleRemoveBatchTag(index)}>
                                    {batch}
                                    <IoClose className="deleteAssignTag"/>
                                </div>
                            )
                        })}
                        <input type="text" placeholder="Batch" onKeyDown={handleAddBatchTag}/>
                    </div>
                    <button className="clearFilters_btn" onClick={clearFilters}>Clear</button>
                </div>
            </div>
            <div className="teacherManagement-content showStudentsAssignment">
                    <Table titles={['Name', 'Email', 'Department', 'Role', 'Status','']}>            
                        {updatedStudents.map((student)=>{
                            return(
                                <tr key={student.ID}>
                                    <td style={{display:'flex'}}>
                                    <input type="checkbox" disabled={registeredStudents.some((a)=>a.ID===student.ID)} checked={registeredStudents.some((a)=>a.ID===student.ID) ? true:null} style={{accentColor:'rebeccapurple'}} value={student.ID} onClick={handleAddStudentId}/>
                                    {student.User.NAME}</td>
                                    <td>{student.User.EMAIL}</td>
                                    <td>{student.DEPARTMENT}</td>
                                    <td>{student.User.Roles[0] ? student.User.Roles[0].NAME : ''}</td>
                                    <td>{registeredStudents.some((a)=>a.ID===student.ID) ? 'Registered':'Not registered'}</td>
                                </tr>
                            )
                        })}
                    </Table>
                    
                </div>
                <button className="addBtn" onClick={handleSubmitStudentAssignment}>Add {selectedStudents.ids.length > 1 ? 'Students' : 'Student'}</button>
        </Modal>
     );
}

export default AssignStudent;