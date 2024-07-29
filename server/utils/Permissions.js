const connection = require('../config/db')

const getAllPermissions = (req, res)=>
{
    const query = 'SELECT R.NAME as role_name, R.DESCRIPTION as role_description, P.NAME, P.DESCRIPTION FROM ROLE AS R JOIN ROLE_PERMISSIONS AS RP ON R.ID = RP.ROLE_ID JOIN PERMISSION AS P ON P.ID = RP.PERMISSION_ID'
    connection.query(query, function(err, results){
        if(err) throw err;
        return res.status(200).json(results)
    })
}

const getUserPermissions = (req, res)=>{
    const {role} = req.params
    const query = 'SELECT R.NAME as role_name, R.DESCRIPTION as role_description,P.ID, P.NAME, P.DESCRIPTION FROM ROLE AS R JOIN ROLE_PERMISSIONS AS RP ON R.ID = RP.ROLE_ID JOIN PERMISSION AS P ON P.ID = RP.PERMISSION_ID where R.NAME = ?'
    connection.query(query, [role], function(err, results){
        if(err) throw err;
        return res.status(200).json(results)
    })
}

module.exports = {getAllPermissions, getUserPermissions};