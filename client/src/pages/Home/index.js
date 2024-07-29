import { useLocation, useNavigate } from "react-router-dom";


function Home() {
    const navigate = useNavigate()
    return ( 
        <>
            <h1>Dashboard</h1>
        </>
     );
}

export default Home;