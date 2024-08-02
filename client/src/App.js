import {BrowserRouter as Router, Routes, Route, useLocation} from 'react-router-dom'
import Login from './pages/auth/login';
import Home from './pages/Home';
import Navbar from './components/navbar';
import SideNavbar from './components/sideNavbar';
import './app.css'
import TeacherManagement from './pages/userManagment/teacher';
import StudentManagement from './pages/userManagment/student';
import RoleManagement from './pages/SystemSettings/roleManagment';
import Roles from './pages/SystemSettings/Roles';
import ManageRoles from './components/Modal/manageRole';
import { useState } from 'react';
import Courses from './pages/courseManagment/courses';
import NotFound from './components/404';
import { jwtDecode } from 'jwt-decode';
import Attendance from './pages/teacher/Academic/attendance';
import MarksManagement from './pages/teacher/Academic/marks';
import StudentMarks from './pages/student/marks';
import StudentAttendance from './pages/student/attendance';

function App() {
  // const user = localStorage.getItem('token') ? jwtDecode(localStorage.getItem('token')) : ''
  // console.log(user)
  return (
    <Router>
      <AppContent/>
    </Router>
  );
}

function AppContent(){
  const location = useLocation();
  const showNav = location.pathname == '/auth/login'
  const [selectedUser, setSelectedUser] = useState({})

  return(

    <>
    {!showNav && <Navbar />}
      <div className={`${!showNav ? 'grid-container':''}`}>
        {!showNav && <SideNavbar className={`${!showNav ? 'side-navbar':''}`} />}
        <div className={`${!showNav ? 'main-content':''}`}>
          <Routes>

            <Route path='/' Component={Home}/>
            <Route path='/auth/login' Component={Login}/>
            <Route path='/userManagement/teacher' Component={TeacherManagement}/>
            <Route path='/userManagement/student' Component={StudentManagement}/>
            <Route path='/systemSettings/roleManagement' element={<RoleManagement onSelectUser={(user)=>setSelectedUser(user)}/>} />
            <Route path='/systemSettings/roles' Component={Roles} />
            <Route path='/systemSettings/roleManagement/:id' element={<ManageRoles selectedUser={selectedUser} />}/>
            <Route path='/courseManagement/courses' Component={Courses}/>
            <Route path="*" Component={NotFound}/>

            {/* teachers */}
            <Route path='/academic/attendance' Component={Attendance} />
            <Route path='/academic/marksManagment' Component={MarksManagement}/>

            {/* Students */}
            <Route path='/Student/attendance' Component={StudentAttendance}/>
            <Route path='/Student/StudentMarks' Component={StudentMarks}/>

          </Routes>
        </div>
      </div>
    </>
  )
}

export default App;



