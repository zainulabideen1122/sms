import { useState } from "react";
import { FaArrowRight, FaArrowDown } from "react-icons/fa6";
import { FaBookReader, FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import { PiNotepadBold } from "react-icons/pi";
import { MdNoteAlt } from "react-icons/md";
import { GiArchiveRegister } from "react-icons/gi";

import HOC from "../utils/hoc";


function SideNavbar() {
    const location = useLocation().pathname;
    const [expandedLinks, setExpandedLinks] = useState({
        userManagment : false,
        courseManagment : false,
        systemSettings : false,
        academic : false
    })
    console.log(location)
    const handleSideMainLinks = (linkName)=>{
        console.log(expandedLinks[linkName])
        setExpandedLinks({...expandedLinks, [linkName]: !expandedLinks[linkName]})
        
    }

    function is(pathname)
    {
        return location === pathname;
    }

    return ( 
        <>
            <div className="sideNavbar">
                <ul className="sidebar-mainList ">
                    <HOC isFor={['Admin', 'Teacher', 'Student']}>
                        <Link to='/'>
                            <li className={`sidebar-mainLi ${is('/') ? 'activeLink':''}`}>
                                <div className="sidebar-mainLi">
                                <MdDashboard size={25}/>
                                <p>
                                    Dashboard
                                </p>
                                </div>
                        </li>
                        </Link>
                    </HOC>
                    <HOC isFor={['Teacher']}>
                        <li onClick={()=>handleSideMainLinks('academic')}>
                                <div className="sidebar-mainLi">
                                    <FaUser size={25}/>
                                    <p>Academic</p>
                                    <span className="mainList-rightArrow">
                                        <FaArrowRight className={`${expandedLinks.academic ? 'rotated_icon':'arrowExtraTransition'}`}/>
                                    </span> 
                                </div>
                        </li>
                        {expandedLinks.academic && <ul className="sidebar-subList">
                        <Link to='/academic/marksManagment'>
                            <li className={`${is('/academic/marksManagment') ? 'activeLink':''}`}>
                                Marks Management
                            </li>
                        </Link> 
                        <Link to='/academic/attendance'>
                            <li className={`${is('/academic/attendance') ? 'activeLink':''}`}>
                                Attendance
                            </li>
                        </Link> 
                        </ul>  
                        }
                    </HOC>
                    <HOC isFor={["Student"]}>
                        <Link to='/Student/CourseRegistration'>
                            <li className={`${is('/Student/CourseRegistration') ? 'activeLink':''}`}>
                                <div className="sidebar-mainLi">
                                    <GiArchiveRegister size={25} />
                                    <p>Course Registration</p>
                                 </div>
                            </li> 
                        </Link>
                        <Link to='/Student/StudentMarks'>
                            <li className={`${is('/Student/StudentMarks') ? 'activeLink':''}`}>
                                <div className="sidebar-mainLi">
                                    <MdNoteAlt size={25} />
                                    <p>Marks</p>
                                </div>
                            </li> 
                        </Link>
                        <Link to='/Student/attendance'>
                            <li className={`${is('/Student/attendance') ? 'activeLink':''}`}>
                                <div className="sidebar-mainLi">
                                    <PiNotepadBold size={25} />
                                    <p>Attendance</p>
                                 </div>
                            </li> 
                        </Link>
                    </HOC>
                    <HOC isFor={["Admin"]}>
                        <li onClick={()=>handleSideMainLinks('userManagment')}>
                                <div className="sidebar-mainLi">
                                    <FaUser size={25}/>
                                    <p>User Management</p>
                                    <span className="mainList-rightArrow">
                                        <FaArrowRight className={`${expandedLinks.userManagment ? 'rotated_icon':'arrowExtraTransition'}`}/>
                                    </span> 
                                </div>
                        </li>
                    
                    {expandedLinks.userManagment && <ul className="sidebar-subList">
                        <Link to='/userManagement/teacher'>
                            <li className={`${is('/userManagement/teacher') ? 'activeLink':''}`}>
                                Teacher
                            </li>
                        </Link>
                        <Link to='/userManagement/student'>
                            <li className={`${is('/userManagement/student') ? 'activeLink':''}`}>
                                Student
                            </li> 
                        </Link>   
                        </ul>  
                    } </HOC>
                    <HOC isFor={['Admin']}>
                    <li className="sidebar-mainLi" onClick={()=>handleSideMainLinks('courseManagment')}>
                        <div className="sidebar-mainLi">
                           <FaBookReader size={25}/>
                           <p>Course Managment</p>
                           <span className="mainList-rightArrow">
                                <FaArrowRight className={`${expandedLinks.courseManagment ? 'rotated_icon':'arrowExtraTransition'}`}/>
                            </span>
                        </div> 
                    </li>
                    {expandedLinks.courseManagment && <ul className="sidebar-subList">
                        <Link to='/courseManagement/courses'>
                            <li className={`${is('/courseManagement/courses') ? 'activeLink':''}`}>
                                Courses
                            </li>
                        </Link>
                        <Link to='/courseManagement/offerCourses'>
                            <li className={`${is('/courseManagement/offerCourses') ? 'activeLink':''}`}>
                                Offered Courses
                            </li>
                        </Link>
                        </ul>  
                    }
                    </HOC>
                    <HOC isFor={['Admin']}>
                    <li onClick={()=>handleSideMainLinks('systemSettings')}>
                        <div className="sidebar-mainLi">
                            <IoSettingsSharp size={25}/>
                            <p>System Settings</p>
                            <span className="mainList-rightArrow">
                                <FaArrowRight className={`${expandedLinks.systemSettings ? 'rotated_icon':'arrowExtraTransition'}`}/>
                            </span>
                        </div>
                    </li>
                    {expandedLinks.systemSettings && 
                        <ul className="sidebar-subList">
                            <Link to='/systemSettings/roles'>
                                <li className={`${is('/systemSettings/roles') ? 'activeLink':''}`}>
                                    Roles
                                </li> 
                            </Link>
                            <Link to='/systemSettings/roleManagement'>
                                <li className={`${is('/systemSettings/roleManagement') || is('/systemSettings/roles/manage') ? 'activeLink':''}`}>
                                    Role Management
                                </li>  
                            </Link>
                        </ul>  
                    }
                    </HOC> 
                    <HOC isFor={['Admin', 'Teacher', 'Student']}>
                    <li>
                        <div className="sidebar-mainLi">
                            <TbReportSearch size={25} />
                            <p>Reports</p>
                        </div>
                    </li>
                    </HOC>
                </ul>
            </div>
        </>
     );
}

export default SideNavbar;