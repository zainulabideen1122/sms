const connection = require('../config/db')


module.exports = {
    updateUserRole_service : (req, res)=>{
        const {id} = req.params
        const {deleteFrom, insertTo, roleID} = req.body
        let query = `DELETE FROM ${deleteFrom} x where x.ID = ${id}`
        console.log(query)
        if(insertTo=="Teacher") query = `INSERT INTO ${insertTo.toUpperCase()}(USER_ID, DEPARTMENT, EXPERIENCE, QUALIFICATION) VALUES (${id}, '', -1, '')`
        else if(insertTo=="Student") query = `INSERT INTO ${insertTo.toUpperCase()}(USER_ID, ROLLNUM, DEPARTMENT, BATCH) VALUES (${id}, '', '', -1)`
        console.log(query)
        connection.beginTransaction((err)=>{
            if (err) return res.status(500).json({msg:'Failed to start transaction!'})
            // query = `DELETE FROM ${deleteFrom} x where x.ID = ${id}`
            connection.query(query, (err, results)=>{
                if(err){
                    return connection.rollback(()=>{
                        res.status(500).json({msg:`Failed to insert into ${insertTo}!`, err})
                    })
                }
                query = `DELETE FROM ${deleteFrom.toUpperCase()} x where x.USER_ID = ${id}`
                connection.query(query, (err, results)=>{
                    if(err){
                        return connection.rollback(()=>{
                            res.status(500).json({msg:'Failed to delete from Teacher!', err})
                        })
                    }
                    query = "UPDATE USER_ROLE UR SET UR.ROLE_ID = ? WHERE UR.USER_ID = ?"
                    connection.query(query, [roleID, id], (err, results)=>{
                        if(err){
                            return connection.rollback(()=>{
                                res.status(500).json({msg:'Failed to update from USER!', err})
                            })
                        }
                        connection.commit(err=>{
                            if(err){
                                return connection.rollback(()=>{
                                    res.status(500).json({msg:'Failed to commit connection!'})
                                })
                            }
                            return res.status(200).json({msg:'User role updated'})
                        })
                    })
                })
            })
        })
    }
}