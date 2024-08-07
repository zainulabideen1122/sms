const dbConfig = require('../config/dbConfig')

const {Sequelize, DataTypes} = require('sequelize')

const sequalize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host:dbConfig.HOST,
        dialect:dbConfig.dialect
    }
)

sequalize.authenticate()
.then(()=>{
    console.log('Connected to db')
})
.catch(err=>{
    console.log(err)
})

const db = {}

db.Sequelize = Sequelize
db.sequalize = sequalize


db.User = require('./user')(sequalize, DataTypes)
db.Teacher = require('./teacher')(sequalize, DataTypes)
db.Student = require('./student')(sequalize, DataTypes)
db.Role = require('./role')(sequalize, DataTypes)
db.Permission = require('./permission')(sequalize, DataTypes)
db.RolePermissions = require('./rolePermission')(sequalize, DataTypes)
db.UserRole = require('./userRole')(sequalize, DataTypes)
db.Section = require('./section')(sequalize, DataTypes)
db.Course = require('./course')(sequalize, DataTypes)
db.StudentSection = require('./studentSection')(sequalize, DataTypes)
db.Attendance = require('./attendance')(sequalize, DataTypes)
db.Mark = require('./marks')(sequalize, DataTypes)
db.OfferCourses = require('./offerCourses')(sequalize, DataTypes)

db.User.hasOne(db.Teacher, { foreignKey: 'USER_ID' });
db.Teacher.belongsTo(db.User, { foreignKey: 'USER_ID' });

db.User.hasOne(db.Student, { foreignKey: 'USER_ID' });
db.Student.belongsTo(db.User, { foreignKey: 'USER_ID' });

db.Role.belongsToMany(db.Permission, { through: db.RolePermissions, foreignKey: 'ROLE_ID' });
db.Permission.belongsToMany(db.Role, { through: db.RolePermissions, foreignKey: 'PERMISSION_ID' });

db.User.belongsToMany(db.Role, { through: db.UserRole, foreignKey: 'USER_ID' });
db.Role.belongsToMany(db.User, { through: db.UserRole, foreignKey: 'ROLE_ID' });

db.Section.belongsTo(db.Teacher, { foreignKey: 'TEACHER_ID' });
db.Teacher.hasMany(db.Section, { foreignKey: 'TEACHER_ID' });

db.Section.belongsToMany(db.Student, { through: db.StudentSection,foreignKey: 'SECTION_ID' });
db.Student.belongsToMany(db.Section, { through: db.StudentSection, foreignKey: 'USER_ID' });

db.Course.hasMany(db.Section, {foreignKey: 'COURSE_ID'})
db.Section.belongsTo(db.Course, {foreignKey: 'COURSE_ID'})

db.Student.hasOne(db.Attendance, {foreignKey:'STUDENT_ID'})
db.Attendance.belongsTo(db.Student, {foreignKey:'STUDENT_ID'})

db.Section.hasMany(db.Attendance, {foreignKey:'SECTION_ID'})
db.Attendance.belongsTo(db.Section, {foreignKey:'SECTION_ID'})

db.Student.hasOne(db.Mark, {foreignKey:'STUDENT_ID'})
db.Mark.belongsTo(db.Student, {foreignKey:'STUDENT_ID'})

db.Section.hasMany(db.Mark, {foreignKey:'SECTION_ID'})
db.Mark.belongsTo(db.Section, {foreignKey:'SECTION_ID'})

db.Course.hasMany(db.OfferCourses, { foreignKey: 'COURSE_ID' });
db.OfferCourses.belongsTo(db.Course, { foreignKey: 'COURSE_ID' });

db.sequalize.sync({force:false})
.then(()=>{
    console.log('re-sync done!')
})

module.exports = db