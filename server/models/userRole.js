module.exports = (sequalize, DataTypes)=>{
    const User = require('./user')(sequalize, DataTypes)
    const Role = require('./role')(sequalize, DataTypes)
      const UserRole = sequalize.define('UserRole', {
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
          ROLE_ID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
              model: Role,
              key: 'ID'
            }
          },
          CREATE_AT: {
            type: DataTypes.DATE
          },
          UPDATED_AT: {
            type: DataTypes.DATE
          }
        }, {
          tableName: 'USER_ROLE'
        });
        
      return UserRole
  }