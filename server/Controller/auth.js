const connection = require('../config/db')
const jwt = require('jsonwebtoken')
const parseObject = require('../utils/parseObject');
const db = require('../models');

const Login = async(req, res)=>{
    const {email, password} = req.body;
    const user = await db.User.findOne({
        where : {EMAIL:email, PASSWORD : password},
        include : {
            model : db.Role
        }
    })

    if(!user)
    {
        res.status(500).json({msg:"Wrong email or password!"})
    }else
    {
        const token = jwt.sign({name:user.NAME, email:user.EMAIL, role : user.Roles[0]?user.Roles[0].NAME : ''}, process.env.SECRET_KEY, { expiresIn: '1h' })
        console.log(token)
        res.send({token})
    }
}


const Register = async(req, res)=>{
    const {name, email, password} = req.body
    let query = "Select * from USER where email = ?"
    connection.query(query, [email], function(err, results){
        if(err) throw err;
        if(results.length > 0) 
        {
            return res.status(400).json({message:'User alread exists! Login at /auth/login'}) 
        }
        query = "INSERT INTO USER (NAME, EMAIL, PASSWORD) VALUES (?,?,?)";

        connection.query(query, [name, email, password], function(err, results){
            if(err) throw err;
            const token = jwt.sign({name:name, email:email, password:password}, process.env.SECRET_KEY, {'expiresIn':'1h'})
            res.status(200).json({token})
        })
    })
    
}

module.exports = {Login, Register}