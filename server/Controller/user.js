const connection = require('../config/db')
const db = require('../models')
const userServices = require('../service/user')
// {getAllUsers_service, getAllTeachers_service, deleteTeacher_service, addTeacher_service, updateUser_dynamicQuery, editTeacher_service, getAllStudents_service}

const User = db.User
const Role = db.Role

const getAllUsers = async(req, res)=>{
    // userServices.getAllUsers_service(req, res)
    const users = await User.findAll({
        include : {
            model : Role
        }
    })

    return res.status(200).json(users)
}


const getAllTeachers = async (req, res)=>{
    userServices.getAllTeachers_service(req, res)
}

const deleteTeacher = (req, res)=>{
    const {id} = req.params
    console.log(parseInt(id))
    // res.status(200).json({msg:"ok"})
    userServices.deleteTeacher_service(req, res, id)
    
}

const addTeacher = (req, res)=>{
    const user = req.body;

    //checking if user exists or not
    let query = "Select * from USER where email = ?"
    connection.query(query, [user.email], function(err, results){
        if(err) res.status(500).json({msg:'Something bad happend!'});
        if(results.length > 0) 
        {
            return res.status(400).json({message:'User alread exists! Try with diff email!'}) 
        }
        else
        {
            userServices.addTeacher_service(req, res, user)
        }
        
    })

    
}

const editTeacher = (req, res)=>{
    const {id} = req.params
    const user = req.body

    let query = userServices.updateUser_dynamicQuery(user, id);
    userServices.editTeacher_service(req, res, query);
    
}


const getAllStudents = async (req, res)=>{
    userServices.getAllStudents_service(req, res);
}

const deleteStudent = (req, res)=>{
    const {id} = req.params
    console.log(parseInt(id))
    // res.status(200).json({msg:"ok"})
    userServices.deleteStudent_service(req, res, id);
}

const addStudent = (req, res)=>{
    const user = req.body;
    console.log(user)
    res.status(200)

    //checking if user already exists or not
    let query = "Select * from USER where email = ?"
    connection.query(query, [user.email], function(err, results){
        if(err) res.status(500).json({msg:'Something bad happend!'});
        if(results.length > 0) 
        {
            return res.status(400).json({message:'User alread exists! Try with diff email!'}) 
        }
        else
        {
            userServices.addStudent_service(req, res, user);
        }
        
    })
}


const editStudent = (req, res)=>{
    const {id} = req.params
    const user = req.body
    console.log(user)
    let query = userServices.editStudent_dynamicQuery(user, id)

    userServices.editStudent_service(req, res, query)
}

module.exports = {getAllUsers, getAllTeachers, deleteTeacher, addTeacher, editTeacher, getAllStudents, deleteStudent, addStudent, editStudent};