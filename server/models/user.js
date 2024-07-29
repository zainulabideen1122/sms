module.exports = (sequalize, DataTypes)=>{
    const User = sequalize.define('User', {
        ID: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true
        },
        NAME: {
          type: DataTypes.STRING(200)
        },
        EMAIL: {
          type: DataTypes.STRING(100),
          allowNull: false
        },
        PASSWORD: {
          type: DataTypes.STRING(200),
          allowNull: false
        }
      }, {
        tableName: 'USER',
      });
      return User
}