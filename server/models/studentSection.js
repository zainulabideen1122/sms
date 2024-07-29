module.exports = (sequelize, DataTypes) => {
    const Student = require('./student')(sequelize, DataTypes)
    const Section = require('./section')(sequelize, DataTypes)
    const StudentSection = sequelize.define('SectionStudent', {
      SECTION_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: Section
        }
      },
      USER_ID: {
        type: DataTypes.INTEGER,
        references: {
          model: Student
        }
      }
    });
    return StudentSection;
  }