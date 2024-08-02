import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import StudentMarksView from "../../components/View/studentMarks";
import Table from "../../components/Common/Table";

function StudentMarks() {

    const userEmail = jwtDecode(localStorage.getItem('token')).email
    const jwtToken = localStorage.getItem('token')
    const [studentCourses, setStudentCourses] = useState([])
    const [studentDetails, setStudentDetails] = useState({
        studentID : '',
        courseName :''
    })

    const [studentMarks, setStudentMarks] = useState({})

    function showCourseName(sectionID)
    {
        const course = studentCourses.filter(course=>course.section.id==sectionID)
        return (course[0].courseCode+"-"+course[0].name)
    }

    useEffect(()=>{
        const data = {studentEmail : userEmail}
        axios.post('http://localhost:5000/user/getStudentCoursesAndSections', data, {
            headers :{
                'token' : jwtToken
            }
        })
        .then(res=>{
            setStudentDetails({...studentDetails ,studentID:res.data.ID})
            const courses = res.data.Sections.reduce((acc, section) => {
                const existingCourse = acc.find((course) => course.id === section.Course.ID);
                if(existingCourse) {
                    existingCourse.sections.push({ id: section.ID, name: section.NAME });
                } else {
                  acc.push({
                    id: section.Course.ID,
                    name: section.Course.NAME,
                    courseCode : section.Course.CODE,
                    section: { id: section.ID, name: section.NAME },
                  });
                }
                return acc;
              }, []);
            setStudentCourses(courses)
            console.log(courses)
        })
        .catch(err=>{
            console.log(err)
        })
    }, [])

    const handleGetStudentMarks = (selected)=>{
        const data = {
            sectionID : selected,
            studentID : studentDetails.studentID
        }

        axios.post('http://localhost:5000/academic/student/getStudentMarks', data, {
            headers : {
                'token' : jwtToken
            }
        })
        .then(res=>{
            console.log(res.data)
            if(res.data==null)
            {
                setStudentMarks({})
                setStudentDetails({
                    ...studentDetails,
                    courseName : ''
                })
            }else{
                setStudentDetails({
                    ...studentDetails,
                    courseName : showCourseName(selected)
                })
                setStudentMarks(res.data.MARKS_DATA)
            }
            
        }).catch(err=>{
            console.log(err)
        })
        console.log(selected)
    }

    return ( 
        <>
            <StudentMarksView studentMarks={studentCourses} setStudent={handleGetStudentMarks} selectedCourse={studentDetails.courseName}>
                <div className="studentMarkSection">
                    <div className="teacherManagement-content" style={{marginTop:'0rem'}}>
                    <h2 style={{marginBottom:'1rem'}}>{studentDetails.courseName}</h2>
                    {Object.keys(studentMarks).length > 0 ? Object.keys(studentMarks).map(section=>{
                        return(
                            <fieldset className="marksFieldSet">
                            <legend>{section}:  (Total Marks: {studentMarks[section].percentage}) </legend>
                            {studentMarks[section].marks.length <= 0 ? <h1 style={{textAlign:'center', padding:'1rem 1rem 1.5rem'}}>No data to show</h1> :
                            <Table titles={['Sr.', 'Obt.','Total','']}>
                                {studentMarks[section].marks && studentMarks[section].marks.map((mark, idx)=>{
                                    return(
                                        <tr key={mark.id}>
                                            <td>{idx+1}</td>
                                            <td>{mark.obtained}</td>
                                            <td>{mark.total}</td>
                                        </tr>
                                    )
                                })}
                            </Table>
                            }
                            
                        </fieldset>
                        )
                    }):<h1 style={{textAlign:'center', padding:'1rem 1rem 1.5rem'}}>No data to show</h1>}
                    </div>
                </div>
            </StudentMarksView>
        </>
     );
}

export default StudentMarks;