const db = require('../models')



const markStudentsAttendance = async(req, res)=>{
    const body = req.body
    console.log( body)
    res.status(200)
}


module.exports = {
    markStudentsAttendance
}