module.exports = (sequalize, DataTypes)=>{
    const Role = sequalize.define('Role', {
        ID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        NAME: {
          type: DataTypes.STRING(200),
          allowNull: false
        },
        DESCRIPTION: {
          type: DataTypes.STRING(300)
        }
      }, {
        tableName: 'ROLE',
      });
      
    return Role
}