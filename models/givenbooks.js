'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Givenbooks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Givenbooks.init({
    studentId: DataTypes.INTEGER,
    bookId: DataTypes.INTEGER,
  }, {
    sequelize,
    tableName:"givenbooks",
    modelName: 'Givenbooks',
  });
  return Givenbooks;
};