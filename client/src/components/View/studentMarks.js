function StudentMarksView({studentMarks,setStudent, selectedCourse,children}) {
    function courseCode(){
        const codes = selectedCourse.split('-')
        return codes[0] + '-' + codes[1]
    }
    return ( 
        <>
            <div className="studentMarksView_container">
                <div className="studentMarksView_headher">
                    <h2>Student Marks</h2>
                    <span>
                        {studentMarks.map(course=>{
                            return(
                                <li key={course.section.id} onClick={()=>setStudent(course.section.id)} className={`${courseCode()==course.courseCode?'activeCourseCode':''}`} >
                                    {course.courseCode}
                                </li>
                            )
                        })}
                    </span>
                </div>
                {children}
            </div>
        </>
     );
}

export default StudentMarksView;