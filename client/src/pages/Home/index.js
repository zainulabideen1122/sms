import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../components/config/axios";


function Home() {
    const navigate = useNavigate()
    const data = jwtDecode(localStorage.getItem('token'))
    const axios = apiClient(localStorage.getItem('token'))
    const  [testData, setTestData] = useState()

    const calculateAttendancePercentage = (attendanceData) => {
        if(attendanceData)
        {
            const totalDays = Object.keys(attendanceData).length;
            const attendedDays = Object.values(attendanceData).filter((status) => status === 'Present' || status === 'Late').length;
            return (attendedDays / totalDays) * 100;
        }
      };

    useEffect(()=>{
        if(data.role==="Student")
        {
            axios.get(`/academic/student/getStudentAllAttendance/${data.email}`)
            .then(res=>{
                console.log(res.data[1])
                setTestData(res.data[1])
               
            })
        }
    }, [])

    useEffect(()=>{
        if(testData)
        {
            console.log(calculateAttendancePercentage(testData.ATTENDANCE_DATA))
        }
    }, [testData])
    return ( 
        <>
            <h1>Dashboard</h1>
            {data.role==="Student" && <div>
            
            </div>}
        </>
     );
}

export default Home;