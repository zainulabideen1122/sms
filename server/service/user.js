const connection = require("../config/db")

module.exports = {

    // get all users in db
    getAllUsers_service : (req, res)=>{
        const query = "select DISTINCT U.ID, U.NAME, U.EMAIL, R.NAME AS ROLE, R.DESCRIPTION from USER U join USER_ROLE UR ON U.ID = UR.USER_ID JOIN ROLE R ON R.ID = UR.ROLE_ID order by U.ID"
        connection.query(query, (err, results)=>{
            if(err) throw err
            return res.status(200).json(results)
        })
    },

    //get all users who are teachers
    getAllTeachers_service : (req, res)=>{
        const query = 'SELECT USER.ID, USER.NAME, USER.EMAIL, TEACHER.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN TEACHER ON TEACHER.USER_ID = USER.ID WHERE ROLE.NAME = "Teacher" order by USER.ID';
        connection.query(query, function(err, results){
            if(err) throw err
            return res.status(200).json(results)
        })
    },


    deleteTeacher_service : (req, res, id)=>{
        let query = ''
        connection.beginTransaction((err)=>{
            if (err) return res.status(500).json({msg:'Failed to start transaction!'})
            query = "DELETE FROM USER_ROLE WHERE USER_ID = ?";
            connection.query(query, [id], (err, results)=>{
                if(err){
                    return connection.rollback(()=>{
                        res.status(500).json({msg:'Failed to delete from user_role!'})
                    })
                }

            query = "DELETE FROM TEACHER WHERE USER_ID = ?"
            connection.query(query, [id], (err, results)=>{
                if(err){
                    return connection.rollback(()=>{
                        res.status(500).json({msg:'Failed to delete from Teacher!', err})
                    })
                }
                query = "DELETE FROM USER WHERE ID = ?"
                connection.query(query, [id], (err, results)=>{
                    if(err){
                        return connection.rollback(()=>{
                            res.status(500).json({msg:'Failed to delete from USER!', err})
                        })
                    }

                    connection.commit((err)=>{
                        if(err){
                            return connection.rollback(()=>{
                                res.status(500).json({msg:'Failed to commit connection!'})
                            })
                        }
                        query = 'SELECT USER.ID, USER.NAME, USER.EMAIL, TEACHER.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN TEACHER ON TEACHER.USER_ID = USER.ID WHERE ROLE.NAME = "Teacher"';
                        connection.query(query, function(err, results){
                            if(err) throw err
                            return res.status(200).json(results)
                        })
                    })
                })
            })

            })
        })
    },

    // adding a teacher
    addTeacher_service : (req, res, user)=>{
        connection.beginTransaction((err)=>{
            if (err) return res.status(500).json({msg:'Failed to start transaction!'})
                query = "INSERT INTO USER (name, email, password) VALUES (?, ?, ?)"
                connection.query(query, [user.name, user.email, user.pass], (err, results)=>{
                    if (err)
                    {
                        return connection.rollback(()=>{
                            res.status(500).json({msg:'Failed to insert to USER!'})
                        })
                    }
    
                    query = "SELECT LAST_INSERT_ID();"
                    connection.query(query, (err, results)=>{
                        if (err)
                            {
                                return connection.rollback(()=>{
                                    res.status(500).json({msg:'Failed to get last id!'})
                                })
                            }
                        const userID = results[0]['LAST_INSERT_ID()']
                        
                        query = "INSERT INTO USER_ROLE(USER_ID, ROLE_ID, CREATE_AT, UPDATED_AT) VALUES (?,3,NOW(),NOW())"
                        connection.query(query, [userID], (err, results)=>{
                            if (err){
                                    return connection.rollback(()=>{
                                        res.status(500).json({msg:'Failed to insert to USER_ROLE!'})
                                    })}
                            query = "INSERT INTO TEACHER (USER_ID, DEPARTMENT, EXPERIENCE, QUALIFICATION) VALUES (?, 'CS', 3, 'MASTER IN CS');"
                            connection.query(query, [userID], (err, results)=>{
                                if (err){
                                    return connection.rollback(()=>{
                                        res.status(500).json({msg:'Failed to insert to TEACHER!'})
                                    })}
                                    connection.commit((err)=>{
                                        if(err){
                                            return connection.rollback(()=>{
                                                res.status(500).json({msg:'Failed to commit connection!'})
                                            })
                                        }
                                        query = 'SELECT USER.ID, USER.NAME, USER.EMAIL, TEACHER.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN TEACHER ON TEACHER.USER_ID = USER.ID WHERE ROLE.NAME = "Teacher"';
                                        connection.query(query, function(err, results){
                                            if(err) throw err
                                                return res.status(200).json(results)
                                            })
                                    })
                            })
                        })
                        
                    })
    
                })
        })
    },

    updateUser_dynamicQuery : (user, id)=>{
        let query = 'UPDATE USER U, TEACHER T SET '
        var updates = []
        if (user.name.length > 0) updates.push(`U.name = '${user.name}'`)
        if (user.email.length > 0) updates.push(`U.email = '${user.email}'`)
        if (user.pass.length > 0) updates.push(`U.password = '${user.pass}'`)
        if (user.dept.length > 0) updates.push(`T.department = '${user.dept}'`)
        if (user.exp.length > 0) updates.push(`T.experience = '${user.exp}'`)
        if (user.qual.length > 0) updates.push(`T.qualification = '${user.qual}'`)
        query += updates.join(', ') + ` where U.ID = T.USER_ID AND U.ID = ${id}`
        console.log(query)
        return query
    },

    editTeacher_service : (req, res, query)=>{
        connection.query(query, (err, results)=>{
            if(err) return res.status(500).json({msg:"some thing bad happend!"})
    
            query = 'SELECT USER.ID, USER.NAME, USER.EMAIL, TEACHER.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN TEACHER ON TEACHER.USER_ID = USER.ID WHERE ROLE.NAME = "Teacher"';
            connection.query(query, function(err, results){
                if(err) return res.status(500).json({msg:"some thing bad happend!"})
                return res.status(200).json(results)
                })
        })
    },

    getAllStudents_service : (req, res)=>{
        const query = 'SELECT USER.ID, USER.NAME, USER.EMAIL,S.ROLLNUM ,S.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN STUDENT S ON S.USER_ID = USER.ID WHERE ROLE.NAME = "Student"';
        connection.query(query, function(err, results){
            if(err) throw err
            return res.status(200).json(results)
        })
    },

    deleteStudent_service : (req, res, id)=>{
        let query = ''
        connection.beginTransaction((err)=>{
            if (err) return res.status(500).json({msg:'Failed to start transaction!'})
            query = "DELETE FROM USER_ROLE WHERE USER_ID = ?";
            connection.query(query, [id], (err, results)=>{
                if(err){
                    return connection.rollback(()=>{
                        res.status(500).json({msg:'Failed to delete from user_role!'})
                    })
                }

            query = "DELETE FROM STUDENT WHERE USER_ID = ?"
            connection.query(query, [id], (err, results)=>{
                if(err){
                    return connection.rollback(()=>{
                        res.status(500).json({msg:'Failed to delete from Teacher!'})
                    })
                }
                query = "DELETE FROM USER WHERE ID = ?"
                connection.query(query, [id], (err, results)=>{
                    if(err){
                        return connection.rollback(()=>{
                            res.status(500).json({msg:'Failed to delete from USER!'})
                        })
                    }

                    connection.commit((err)=>{
                        if(err){
                            return connection.rollback(()=>{
                                res.status(500).json({msg:'Failed to commit connection!'})
                            })
                        }
                        query = 'SELECT USER.ID, USER.NAME, USER.EMAIL,S.ROLLNUM ,S.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN STUDENT S ON S.USER_ID = USER.ID WHERE ROLE.NAME = "Student"';
                        connection.query(query, function(err, results){
                            if(err) throw err
                            return res.status(200).json(results)
                        })
                    })
                })
            })

            })
        })
    },

    addStudent_service :(req, res, user)=>{
        connection.beginTransaction((err)=>{
            if (err) return res.status(500).json({msg:'Failed to start transaction!'})
                query = "INSERT INTO USER (name, email, password) VALUES (?, ?, ?)"
                connection.query(query, [user.name, user.email, user.pass], (err, results)=>{
                    if (err)
                    {
                        return connection.rollback(()=>{
                            res.status(500).json({msg:'Failed to insert to USER!'})
                        })
                    }
    
                    query = "SELECT LAST_INSERT_ID();"
                    connection.query(query, (err, results)=>{
                        if (err)
                            {
                                return connection.rollback(()=>{
                                    res.status(500).json({msg:'Failed to get last id!'})
                                })
                            }
                        const userID = results[0]['LAST_INSERT_ID()']
                        console.log("userID: ",userID)
                        query = "INSERT INTO USER_ROLE(USER_ID, ROLE_ID, CREATE_AT, UPDATED_AT) VALUES (?,2,NOW(),NOW())"
                        connection.query(query, [userID], (err, results)=>{
                            if (err){
                                    return connection.rollback(()=>{
                                        res.status(500).json({msg:'Failed to insert to USER_ROLE!'})
                                    })}
                            query = "INSERT INTO STUDENT (USER_ID, ROLLNUM, DEPARTMENT, BATCH) VALUES (?, ?, ?, ?);"
                            connection.query(query, [userID, user.rollNum, user.dept, parseInt(user.batch)], (err, results)=>{
                                if (err){
                                    return connection.rollback(()=>{
                                        res.status(500).json({msg:'Failed to insert to STUDENT!'})
                                    })}
                                    connection.commit((err)=>{
                                        if(err){
                                            return connection.rollback(()=>{
                                                res.status(500).json({msg:'Failed to commit connection!'})
                                            })
                                        }
                                        query = 'SELECT USER.ID, USER.NAME, USER.EMAIL,S.ROLLNUM ,S.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN STUDENT S ON S.USER_ID = USER.ID WHERE ROLE.NAME = "Student"';
                                        connection.query(query, function(err, results){
                                            if(err) throw err
                                            console.log(results)
                                            return res.status(200).json(results)
                                            })
                                    })
                            })
                        })
                        
                    })
    
                })
        })
    },

    editStudent_dynamicQuery : (user, id)=>{
        let query = 'UPDATE USER U, STUDENT S SET '
        var updates = []
        if (user.name.length > 0) updates.push(`U.name = '${user.name}'`)
        if (user.email.length > 0) updates.push(`U.email = '${user.email}'`)
        if (user.pass.length > 0) updates.push(`U.password = '${user.pass}'`)
        if (user.dept.length > 0) updates.push(`S.department = '${user.dept}'`)
        if (user.rollNum.length > 0) updates.push(`S.rollnum = '${user.rollNum}'`)
        if (user.batch.length > 0) updates.push(`S.batch = '${user.batch}'`)
        query += updates.join(', ') + ` where U.ID = S.USER_ID AND U.ID = ${id}`
        console.log(query)
        return query
    },

    editStudent_service : (req, res, query)=>{
        connection.query(query, (err, results)=>{
            if(err) return res.status(500).json({msg:"some thing bad happend!"})
            query = 'SELECT USER.ID, USER.NAME, USER.EMAIL,S.ROLLNUM ,S.DEPARTMENT, ROLE.NAME AS ROLE FROM USER JOIN USER_ROLE ON USER.ID = USER_ROLE.USER_ID JOIN ROLE ON USER_ROLE.ROLE_ID = ROLE.ID JOIN STUDENT S ON S.USER_ID = USER.ID WHERE ROLE.NAME = "Student"';
            connection.query(query, function(err, results){
                if(err) return res.status(500).json({msg:"some thing bad happend!"})
                return res.status(200).json(results)
                })
        })
    }
}