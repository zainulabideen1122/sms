import { useEffect, useState } from "react";
import Table from "../../components/Common/Table";
import apiClient from "../../components/config/axios";
import { useNavigate } from "react-router-dom";
import isUnAuth from "../../utils/checkUnAuth";
import EditOfferCourses from "../../components/Modal/editOfferedCourses";

function OfferedCoursesView() {
    const axios = apiClient(localStorage.getItem('token'))
    const navigate = useNavigate()
    const [searchCourse, setSearchCourse] = useState()
    const [courses, setCourses] = useState([])
    const [selectedCourse, setSelectedCourse] = useState()
    const [editOfferCourseModal, setEditOfferCourseModal] = useState(false)

    function toggleEditOfferCourse(){
        setEditOfferCourseModal(!editOfferCourseModal)
    }

    useEffect(()=>{
        axios.get('/courses/getAllOfferedCourses')
        .then(res=>{
            console.log(res)
            setCourses(res.data)
        })
        .catch(err=>{
            isUnAuth(err, navigate)
        })
    }, [])

    return ( 
        <>
            <div className="teacherManagement-container">
                <div className="teacherManagement-header">
                    <h1>Offered Courses</h1>
                    <span className="teacherManagement-leftHeader">
                        <input type="text" placeholder="Search Courses.." value={searchCourse} onChange={(e)=>setSearchCourse(e.target.value)} />
                    </span>
                </div>
                <div className="teacherManagement-content">
                    <Table titles={['Code', 'Course','Offered Departments','Offered Batches', 'Semester', '']}>
                        {courses.map(course=>{
                            {console.log(course)}
                            return(
                                <tr key={course.COURSE_ID}>
                                    <td>{course.Course.CODE}</td>
                                    <td>{course.Course.NAME}</td>
                                    <td>{course.ALLOWED.departments.map(dept=>{
                                        return(<>
                                            <span style={{marginRight:'0.4rem'}}>{dept}</span>
                                        </>)
                                    })}</td>
                                    <td>{course.ALLOWED.batches.map(batch=>{
                                        return(<>
                                            <span style={{marginRight:'0.4rem'}}>{batch}</span>
                                        </>)
                                    })}</td>
                                    <td>{course.ALLOWED.semester}</td>
                                    <td>
                                        <button className="btnStyle" onClick={()=>{setEditOfferCourseModal(true);setSelectedCourse(course)}}>Edit</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </Table>
                </div>

                <EditOfferCourses show={editOfferCourseModal} close={toggleEditOfferCourse} course={selectedCourse} setCourses={setCourses} />
            </div>
        </>
     );
}

export default OfferedCoursesView;