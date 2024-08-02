import { useNavigate } from 'react-router-dom';
import './index.css'
import { FaRegUserCircle } from "react-icons/fa";
import { useState } from 'react';

function Navbar() {
    const navigate = useNavigate()
    const [navbarCard, setNavbarCard] = useState(false)
    const handleLogout = ()=>{
        localStorage.removeItem('token')
        if(!localStorage.getItem('token'))
            {
                navigate('/auth/login')
            }
    }
    return ( 
        <>
            <div className="navbar">
                <h1>SMS</h1>
                <div className="navbar-options">
                    <span>
                        <FaRegUserCircle size={30} onClick={()=>setNavbarCard(!navbarCard)}/>
                        {navbarCard && <div className='navbarLeft_card'>
                            <li>My Profile</li>
                            <li>Change Password</li>
                            <button className="logout-btn" onClick={handleLogout}>Log out</button>
                        </div>}
                    </span>
                    
                </div>
            </div>
        </>
     );
}

export default Navbar;