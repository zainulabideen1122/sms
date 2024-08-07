import { useEffect, useState } from "react";
import Modal from "../Common/Modal";
import { IoClose } from "react-icons/io5";
import apiClient from "../config/axios";
import isUnAuth from "../../utils/checkUnAuth";
import { useNavigate } from "react-router-dom";

function ShowCourseRegistration({show, close, courseID}) {

    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const [filters, setFilters] = useState({
        batches : [],
        departments : []
    }) 

    useEffect(()=>{
        console.log(courseID)
    }, [courseID])

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

    const handleOfferCourse = ()=>{
        //do something
        console.log(filters)
        const data = {
            courseID: courseID,
            allowed_students: filters
        }
        axios.post('/courses/offerCourse', data)
        .then(res=>{
            console.log(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
            console.log(err)
            alert(err.response.data)
        })
        close()
    }


    return ( 
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
                    {/* <button className="clearFilters_btn" onClick={clearFilters}>Clear</button> */}
                </div>
            </div>
            <div>
                <button className="btnStyle addBtn" onClick={handleOfferCourse}>Offer</button>
            </div>
        </Modal>
     );
}

export default ShowCourseRegistration;