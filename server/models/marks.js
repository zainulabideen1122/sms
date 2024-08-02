module.exports = (sequelize, DataTypes) => {
    const Student = require('./student')(sequelize, DataTypes)
    const Section = require('./section')(sequelize, DataTypes)
    const Marks = sequelize.define('Mark', {
        ID: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        STUDENT_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: Student
            }
        },
        SECTION_ID: {
            type: DataTypes.INTEGER,
            references: {
                model: Section
            }
        },
        MARKS_DATA: {
            type: DataTypes.JSON
        }
    });

    return Marks
};