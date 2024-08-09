import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../../components/config/axios";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import './index.css'
import isUnAuth from "../../utils/checkUnAuth";
Chart.register(...registerables)

function Home() {
    const navigate = useNavigate()
    const data = jwtDecode(localStorage.getItem('token'))
    const axios = apiClient(localStorage.getItem('token'))
    // const  [testData, setTestData] = useState()
    const [student, setStudent] = useState()
    const [chartData, setChartData] = useState()

    const calculateAttendancePercentage = (attendanceData) => {
        if(attendanceData)
        {
            const totalDays = Object.keys(attendanceData).length;
            const attendedDays = Object.values(attendanceData).filter((status) => status === 'Present' || status === 'Late').length;
            return (attendedDays / totalDays) * 100;
        }
      };

    function settingData(testData){
        const chartLabels = testData && testData.map((data) => data.Section.Course.CODE);
        const chartDataValues = testData && testData.map((data) =>
        calculateAttendancePercentage(data.ATTENDANCE_DATA)
        );

        testData && setChartData({
            labels: chartLabels,
            datasets: [
            {
                label: 'Attendance',
                data: chartDataValues,
                backgroundColor: 'rgba(102, 51, 153, 0.347)',
                borderColor: 'rgba(102, 51, 153, 1)',
                borderWidth: 1,
            },
            ],
        });
    }

    useEffect(()=>{
        if(data.role==="Student")
        {
            axios.get(`/academic/student/getStudentAllAttendance/${data.email}`)
            .then(res=>{
                console.log(res.data)
                //setTestData(res.data)
                settingData(res.data)
               
            })

            axios.get(`/user/getStudent/${data.email}`)
            .then(res=>{
                console.log(res.data)
                setStudent(res.data)
            })
            .catch(err=>{
                isUnAuth(err, navigate)
            })
        }
    }, [])    

    return ( 
        <>
            {/* <h1>Dashboard</h1> */}
            {data.role==="Student" && <div>
                <div className="studentData_container">
                    <p>Name : {student && student.User.NAME}</p>
                    <p>Email : {student && student.User.EMAIL}</p>
                    <p>Roll No : {student && student.ROLLNUM}</p>
                    <p>Semester : {student && student.CURRENT_SEMESTER}</p>
                    <p>Department : {student && student.DEPARTMENT}</p>
                    <p>Batch : {student && student.BATCH}</p>

                </div>
               <h1 className="homePage_AttendanceHeading">Attendance:</h1>
               {chartData&& 
               <Bar 
                className="attendanceChart"
                data={chartData}
                width={300}
                options={{
                    scales: {
                    x: {
                        type: 'category',
                    },
                    y: {
                        min:0,
                        max: 100,
                    },
                    },
                }}
                />}
            </div>}
        </>
     );
}

export default Home;