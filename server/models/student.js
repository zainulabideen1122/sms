module.exports = (sequalize, DataTypes)=>{
    const User = require('./user')(sequalize, DataTypes)
    const Student = sequalize.define('Student', {
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
        ROLLNUM: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        DEPARTMENT: {
          type: DataTypes.STRING(10),
          allowNull: false
        },
        BATCH: {
          type: DataTypes.INTEGER,
          allowNull: false
        }
      }, {
        tableName: 'STUDENT'
      });
    return Student
}