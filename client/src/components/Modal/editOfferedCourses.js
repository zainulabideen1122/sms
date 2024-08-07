import { useNavigate } from "react-router-dom";
import Modal from "../Common/Modal";
import apiClient from "../config/axios";
import { IoClose } from "react-icons/io5";
import { useEffect, useState } from "react";
import isUnAuth from "../../utils/checkUnAuth";

function EditOfferCourses({show, close, course, setCourses}) {
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const [courseStatus, setCourseStatus] = useState('')
    const [filters, setFilters] = useState({
        batches : [],
        departments : []
    }) 

    useEffect(()=>{
        if(course){
            setFilters({
                batches : course.ALLOWED.batches,
                departments: course.ALLOWED.departments
            })
            setCourseStatus(course.STATUS)
        }
    }, [course])

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

    const handleSaveData = ()=>{
        console.log(filters)
        const data = {
            courseID : course.COURSE_ID,
            allowed_students : filters,
            status : courseStatus
        }
        axios.post('/courses/updateOfferedCourse', data)
        .then(res=>{
            // console.log(res)
            setCourses(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })

        close()
    }

    return ( 
        <>
            <Modal show={show} close={close} width={'70%'}>
                <div className="assignStudent-header">
                    <h1>Offers to: </h1>
                    <div className="assignStudent-filters">
                        <div className="assignStudent-batchFilter">
                            {filters.departments.map((department, index)=>{
                                return(
                                    <div className="batchTag" key={index} onClick={()=>handleRemoveDepartmentTag(index)}>
                                        {department}
                                        <IoClose className="deleteAssignTag"/>
                                    </div>
                                )
                            })}
                            <input type="text" placeholder="Departments" onKeyDown={handleAddDepartmentTag}/>
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
                            <input type="text" placeholder="Batches" onKeyDown={handleAddBatchTag}/>
                        </div>
                        <select value={courseStatus} onChange={(e)=>setCourseStatus(e.target.value)} style={{marginRight:'0.5rem', width:'20%', padding:'0.5rem 1rem', border:'none'}}>
                            <option disabled>Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>
                        
                    </div>
                </div>

                <button className="addBtn" onClick={handleSaveData}>Save</button>

            </Modal>
        </>
     );
}

export default EditOfferCourses;