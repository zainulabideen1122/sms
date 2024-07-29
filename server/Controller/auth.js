const connection = require('../config/db')
const jwt = require('jsonwebtoken')
const parseObject = require('../utils/parseObject')

const Login = async(req, res)=>{
    const {email, password} = req.body;
    const query = "SELECT NAME, EMAIL, PASSWORD FROM USER WHERE EMAIL = ? AND PASSWORD = ?"
    await connection.query(query, [email, password], function(err, results){
        if (err) res.send(err);

        if(results.length > 0)
        {
            const newResult = parseObject(results[0])
            const token = jwt.sign({name:newResult.NAME, email:newResult.EMAIL, password:newResult.PASSWORD, role : "Admin"}, process.env.SECRET_KEY, { expiresIn: '1h' })
            console.log(token)
            res.send({token})
        }
        else
        {
            res.status(400).json({message:"Wrong email or password!"})
        }
    })
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