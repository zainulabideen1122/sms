import { useState } from "react";
import { FaArrowRight, FaArrowDown } from "react-icons/fa6";
import { FaBookReader, FaUser } from "react-icons/fa";
import { IoSettingsSharp } from "react-icons/io5";
import { TbReportSearch } from "react-icons/tb";
import { Link, useLocation } from "react-router-dom";
import { MdDashboard } from "react-icons/md";
import HOC from "../utils/hoc";

function SideNavbar() {
    const location = useLocation().pathname;
    const [expandedLinks, setExpandedLinks] = useState({
        userManagment : false,
        courseManagment : false,
        systemSettings : false
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
                        </ul>  
                    }
                    
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
                    <li>
                        <div className="sidebar-mainLi">
                            <TbReportSearch size={25} />
                            <p>Reports</p>
                        </div>
                    </li>
                </ul>
            </div>
        </>
     );
}

export default SideNavbar;