import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './index.css'
import AddCourse from "../../components/Modal/addCourse";
import SectionStudents from "../../components/viewSectionStudents";
import ShowSection from "../../components/Modal/showSection";
import AddSection from "../../components/Modal/addSection";
import Table from "../../components/Common/Table";
import apiClient from "../../components/config/axios";
import isUnAuth from "../../utils/checkUnAuth";
import ShowCourseRegistration from "../../components/Modal/showCourseRegistration";

function Courses() {

    const jwtToken = localStorage.getItem('token')
    const [courses, setCourses] = useState([])
    const [searchCourse, setSearchCourse] = useState('')
    const [updatedCourses, setUpdatedCourses] = useState([])
    const [addCourseModalStatus, setAddCourseModalStatus] = useState(false)
    const [selectedSection, setSelectedSection] = useState({})
    const [selectedCourse, setSelectedCourse] = useState('')
    const [showSectionModal, setShowSectionModal] = useState(false)
    const [addSectionModal, setAddSectionModal] = useState(false)
    const [courseRegistrationModal, setCourseRegistrationModal] = useState(false)
    const [offeredCourses, setOfferedCourses] = useState([])
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()

    function toggleShowSectionModal(){
        setShowSectionModal(!showSectionModal)
    }
    function toggleAddSectionModal(){
        setAddSectionModal(!addSectionModal)
    }
    function toggleCourseRegistrationModal(){
        setCourseRegistrationModal(!courseRegistrationModal)
    }
    function toggleAddCourseModal(){
        setAddCourseModalStatus(!addCourseModalStatus)
    }

    function isDisableOfferBtn(courseID)
    {
        const result = offeredCourses.find(course=>course.COURSE_ID==courseID)
        if(result != undefined)
            return true
        else
            return false

    }

    useEffect(()=>{
        axios.get('/courses')
        .then(res=>{
            setCourses(res.data)
            setUpdatedCourses(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })


        axios.get('/courses/getAllOfferedCourses')
        .then(res=>{
            setOfferedCourses(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })

    }, [selectedSection])

    useEffect(()=>{
        if(searchCourse.length > 0)
        {
            const updated = courses.filter(course=>{
                return course["NAME"].toLowerCase().includes(searchCourse.toLowerCase())
            })
            setUpdatedCourses(updated)
        }
        else{
            setUpdatedCourses(courses)
        }
    }, [searchCourse])

    const handleShowSection= (section)=>{
        setSelectedSection(section)
        setShowSectionModal(true)
    }

    const handleAddSection= (course)=>{
        setSelectedCourse(course.ID);
        setAddSectionModal(true)
    }
    const handleCourseRegistration= (course)=>{
        setSelectedCourse(course.ID);
        setCourseRegistrationModal(true)
    }
    // console.log(isDisableOfferBtn(1))
    return ( 
        <>
        <div className="teacherManagement-container">
            <div className="teacherManagement-header">
                <h1>Course Management</h1>
                <span className="teacherManagement-leftHeader">
                    <input type="text" placeholder="Search Courses.." value={searchCourse} onChange={(e)=>setSearchCourse(e.target.value)} />
                    <button onClick={toggleAddCourseModal}>+ Course</button>
                </span>
            </div>
            <div className="teacherManagement-content">

                    <Table titles={['Code', 'Course Name', 'Department', 'Sections', '', '']}>
                        {updatedCourses.map((course)=>{
                            return(
                            
                                <tr key={course.ID}>

                                    <td>{course.CODE}</td>
                                    <td>{course.NAME}</td>
                                    <td>{course.DEPARTMENT}</td>
                                    <td>{course.Sections.length > 0 ? course.Sections.map(section=>{
                                        return(
                                           <span key={section.ID} style={{paddingRight:"4px"}} onClick={()=>handleShowSection(section)} className={`sectionsToggle`}>
                                            {section.NAME}
                                           </span>
                                        )
                                    }):'None'}</td>
                                    <td>
                                        <button style={{marginRight:'1rem'}} className="btnStyle" onClick={()=>handleAddSection(course)}>+Section</button>
                                        <button className={`btnStyle ${isDisableOfferBtn(course.ID) ? 'gray':''}`} disabled={isDisableOfferBtn(course.ID)} onClick={()=>handleCourseRegistration(course)}>Offer Course</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </Table>

                    <AddCourse show={addCourseModalStatus} close={toggleAddCourseModal} setCourses={setUpdatedCourses} />
                    <AddSection show={addSectionModal} close={toggleAddSectionModal} courseID={selectedCourse} setCourses={setUpdatedCourses}/>
                    <ShowSection show={showSectionModal} close={toggleShowSectionModal} setCourses={setUpdatedCourses} section={selectedSection} setSelectedSection={setSelectedSection} />
                    <ShowCourseRegistration show={courseRegistrationModal} close={toggleCourseRegistrationModal} courseID={selectedCourse}/>
                </div>
        </div>
        </>
     );
}

export default Courses;