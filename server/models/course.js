
module.exports = (sequalize, DataTypes)=>{
    const Course = sequalize.define("Course", {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        CODE :{
            type : DataTypes.STRING,
            allowNull : false
        },
        NAME :{
            type : DataTypes.STRING,
            allowNull : false
        },
        DEPARTMENT : {
            type : DataTypes.STRING,
            allowNull : false
        }
        
    })

    return Course
}