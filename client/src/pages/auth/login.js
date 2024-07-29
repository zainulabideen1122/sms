import { useState } from "react";
import './index.css'
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [credentials, setCredentials] = useState({email :'', password:''})
    const [wrongAlert, setWrongAlert] = useState('')
    const navigate = useNavigate();
    const handleLogin = async ()=>{
        
        await axios.post('http://localhost:5000/auth/login', credentials)
        .then((res)=>{
            const token = res.data.token
            localStorage.setItem('token', token)

            if(localStorage.getItem('token'))
            {
                navigate('/')
            }
        })
        .catch(err=>{
            console.log(err)
        })
    }


    return ( 
        <>
            <section className="loginPage">
                <div className="loginDiv">
                    <h1>Login</h1>
                    <p>Please enter your login and password</p><br></br>
                    <input type='text' value={credentials.email} placeholder='Email' onChange={(e)=>setCredentials({...credentials, email:e.target.value}) }/>
                    <input type='password' required value={credentials.password} placeholder='Password' onChange={(e)=>setCredentials({...credentials, password:e.target.value}) }/>
                    <p>Forgot password?</p>
                    <div className='loginButtons'>
                        <button style={{borderColor:"#27ae60"}} className='loginButton' onClick={handleLogin}>Login</button>
                        
                    </div>
                    <span className='wrongCredentialsText'>{wrongAlert}</span>
                </div>
            </section>
        </>
     );
}

export default Login;