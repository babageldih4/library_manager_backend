'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Books}) {
      // define association here
      this.belongsToMany(Books,{
        through:"Givenbooks",
        as:"given_books",
        foreignKey:"studentId"
      })
    }
  }
  Students.init({
    studentId: DataTypes.STRING,
    name: DataTypes.STRING,
    faculty: DataTypes.STRING,
    // students:DataTypes.STRING,
    group:DataTypes.STRING
  }, {
    sequelize,
    tableName:"students",
    modelName: 'Students',
  });
  return Students;
};