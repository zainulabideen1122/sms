module.exports = (sequalize, DataTypes)=>{
    const Permission = sequalize.define('Permission', {
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
        tableName: 'PERMISSION',
      });
      
    return Permission
}