module.exports = (sequalize, DataTypes)=>{
    const Course = require('./course')(sequalize, DataTypes)
    const OfferCourses = sequalize.define('OfferCourse',{
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        COURSE_ID: {
            type: DataTypes.INTEGER,
            allowNull : false,
            references : {
                model : Course,
                key: 'ID'
            }
        },
        STATUS: {
            type: DataTypes.STRING,
            allowNull : false
        },
        ALLOWED: {
            type: DataTypes.JSON
        }

    })
    return OfferCourses
}