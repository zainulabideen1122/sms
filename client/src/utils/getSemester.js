const getCurrentSemester = (currentSem, batch)=>{
    const year = 5
    console.log('batch: ', batch)
    const semesters = []
    for(let i=0;i<year*2;i++)
    {
        if(i %2==0)
        {
            semesters.push('FALL-'+batch)
            batch += 1
        }else{
            semesters.push('SPRING-'+batch)
        }
    }
    console.log(semesters)

    const semester = semesters.findIndex(sem=>sem===currentSem)
    console.log('------>>>>> ', semester)
    return (semester+1)
}

export default  getCurrentSemester;