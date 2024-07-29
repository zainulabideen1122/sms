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

function App() {
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
          </Routes>
        </div>
      </div>
    </>
  )
}

export default App;



