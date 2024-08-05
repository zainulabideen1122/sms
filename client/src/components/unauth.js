import { Link } from "react-router-dom";

function UnAuthorized() {
    return ( 
        <>
            <center style={{display:'flex',flexDirection:'column', alignItems:'center', justifyContent:'center',height:'80vh'}}>
                <h1>Unauthorized! Or URL doesn't exists!</h1><br></br>
                <Link to='/'>Redirect to Home</Link>
            </center>
        </>
     );
}

export default UnAuthorized;