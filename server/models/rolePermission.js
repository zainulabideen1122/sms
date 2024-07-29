module.exports =  (sequalize, DataTypes)=>{
    const Role = require('./role')(sequalize, DataTypes)
    const Permission = require('./permission')(sequalize, DataTypes)
    
    const RolePermissions = sequalize.define('RolePermissions', {
        ID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        ROLE_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Role,
            key: 'ID'
          }
        },
        PERMISSION_ID: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: Permission,
            key: 'ID'
          }
        },
        CREATED_AT: {
          type: DataTypes.DATE
        },
        UPDATED_AT: {
          type: DataTypes.DATE
        }
      }, {
        tableName: 'ROLE_PERMISSIONS',
        timestamps: false
      });

    return RolePermissions
}