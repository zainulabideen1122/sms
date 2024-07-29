import { MdOutlineCancel } from "react-icons/md";

function Modal({show, close, width, children}) {
    return ( 
        <>
        {show ? <div className="background_focus">
            <div style={{width : width || '40%'}} className={`addTeacher-container`}>
                <MdOutlineCancel size={25} className="addTeacher_cancelBtn" onClick={()=>close()}/>
                {children}
            </div>
        </div>
        :null}
        </>
     );
}

export default Modal;