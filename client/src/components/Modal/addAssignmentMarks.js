import { useEffect, useState } from "react";
import Modal from "../Common/Modal";


function AssignmentMarks({show, close, section,allSections, setSection, action, markId}) {

    //console.log(section)
    const [studentMarks, setStudentMarks] = useState({
        obtained : '',
        total : ''
    })


    useEffect(()=>{
        if(show && action == 'editMarks')
        {
            const markObject = section.value.marks.find(mark => mark.id === 1);
            console.log(markObject)
            setStudentMarks({
                obtained : markObject.obtained,
                total : markObject.total
            })
        }
    }, [show])
    
    function clearForm()
    {
        setStudentMarks({
            obtained : '',
            total : ''
        })
    }

    const handleStudentMarks = (e)=>{
        const {name, value} = e.target
        setStudentMarks({
            ...studentMarks,
            [name] : value
        })
    }

    const handleAddMarks = ()=>{
        
        if(action == 'addMarks')
        {
            let id = allSections[section.key].marks.length
            if(id == 0)
            {
                id = 1
            }else{
                id = section.value.marks[id-1].id+1
            }
            setSection({
                ...allSections,
                [section.key]: {
                  ...section.value,
                  marks: [...section.value.marks, Object.assign({id:id},studentMarks)]
                }
              })
        }
        else if(action == 'editMarks')
        {
            const updatedMarks = section.value.marks.map(mark => 
                mark.id === markId ? { ...mark, ...studentMarks } : mark
              );
            console.log('updated!', updatedMarks)
            setSection({
                ...allSections,
                [section.key]: {
                  ...section.value,
                  marks: updatedMarks
                }
              })
        }

        clearForm()
        close()
    }

    return ( 
        <>
            <Modal show={show} close={close} width={'60%'}>
            <input type="text" placeholder="Obt. Marks" name="obtained" onChange={handleStudentMarks} value={studentMarks.obtained} />
            <input type="text" placeholder="Total Marks" name="total" onChange={handleStudentMarks} value={studentMarks.total} />
            <button className="addBtn" onClick={handleAddMarks}>{action=='addMarks' ? 'Add':'Update'}</button>
            </Modal>
        </>
     );
}

export default AssignmentMarks;