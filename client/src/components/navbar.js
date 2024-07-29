import { useNavigate } from 'react-router-dom';
import './index.css'

function Navbar() {
    const navigate = useNavigate()
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
                    <button className="logout-btn" onClick={handleLogout}>Log out</button>
                </div>
            </div>
        </>
     );
}

export default Navbar;