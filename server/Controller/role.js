const connection = require("../config/db")
const {updateUserRole_service} = require('../service/roles')

const db = require('../models')

const Role = db.Role
const RolePermissions = db.RolePermissions
const Permission = db.Permission
const UserRole = db.UserRole

const getAllRoles = async(req, res)=>{
    try {
        const roles = await Role.findAll({
            include : {
                model : Permission,
                attributes : ["ID", "NAME", "DESCRIPTION"]
            }
        })
        return res.status(200).json(roles)
    } catch (error) {
        console.log(error)
    }
}

const addRole = async(req, res)=>{
    const {NAME, DESCRIPTION} = req.body
    await Role.create({
        NAME : NAME,
        DESCRIPTION : DESCRIPTION
    })
    getAllRoles(req, res)
}


const getUserPermissions = (req, res)=>{
    const user = req.params
    console.log(user)
    res.status(200).json(user)
    let query = "select P.ID, P.NAME, P.DESCRIPTION from ROLE R join ROLE_PERMISSIONS RP on R.ID = RP.ROLE_ID JOIN PERMISSION P ON P.ID = RP.PERMISSION_ID WHERE R.NAME = Admin"
    connection.query(query, (err, results)=>{
        
        return res.status(200).json(results)
    })
}

const getUserRole = (req, res)=>{
    const {id} = req.params;
    const query = 'select DISTINCT R.ID as roleID, U.NAME, R.NAME AS role from USER U join USER_ROLE UR ON U.ID = UR.USER_ID JOIN ROLE R ON R.ID = UR.ROLE_ID WHERE U.ID = ?'
    connection.query(query, [id], (err, results)=>{
        if(err) return res.status(500).json(err)
        return res.status(200).json(results)
    })
}

const updateUserRole = async(req, res)=>{
    const {id} = req.params
    const {deleteFrom, insertTo, roleID, userDetail} = req.body
    const userD = Object.assign(userDetail,{USER_ID : id})

    console.log(deleteFrom, insertTo, roleID, id, userD)
    

    try {
        await db.sequalize.transaction(async transaction=>{
            await UserRole.update(
                {ROLE_ID : roleID},
                {
                    where : {USER_ID : id}
                }
            )
            if(deleteFrom == "Teacher" && insertTo == " Student")
            {
                await db.Teacher.destroy({
                    where : {USER_ID: id}
                })

                await db.Student.create(userD, {transaction})
            }
            else
            {
                await db.Student.destroy({
                    where : {USER_ID : id}
                })

                await db.Teacher.create(userD, {transaction})
            }
        })
        res.status(200).json({msg:"Updated successfully"})
    } catch (error) {
        console.log(error)
    }

    //console.log(req.body)
    //const query = "UPDATE USER_ROLE UR SET UR.ROLE_ID = ? WHERE UR.USER_ID = ?"
    //updateUserRole_service(req, res)
    // connection.query(query, [roleID, id], (err, results)=>{
    //     if(err) return res.status(500).json(err)
    //     return res.status(200).json(results)
    // })
}

module.exports = {getAllRoles, getUserPermissions, getUserRole, updateUserRole, addRole}