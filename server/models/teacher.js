module.exports = (sequalize, DataTypes)=>{
    const User = require('./user')(sequalize, DataTypes)
    const Teacher = sequalize.define('Teacher', {
        ID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        USER_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: User,
            key: 'ID'
          }
        },
        DEPARTMENT: {
          type: DataTypes.STRING(10),
          allowNull: false
        },
        EXPERIENCE: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        QUALIFICATION: {
          type: DataTypes.STRING(200)
        }
      }, {
        tableName: 'TEACHER',
      });

    return Teacher
}