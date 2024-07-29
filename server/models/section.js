
module.exports = (sequalize, DataTypes)=>{
    const Course = require('./course')(sequalize, DataTypes)
    const Student = require('./student')(sequalize, DataTypes)
    const Teacher = require('./teacher')(sequalize, DataTypes)
    const Section = sequalize.define('Section',{
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        NAME : {
            type : DataTypes.STRING,
            allowNull : false
        },
        NUM_OF_STUDENTS : {
            type : DataTypes.INTEGER,
            defaultValue : 0
        },
        COURSE_ID : {
            type: DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : Course
            }
        },
        TEACHER_ID : {
            type : DataTypes.INTEGER,
            references : {
                model : Teacher
            }
        }
    })
    return Section
}