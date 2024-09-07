'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Actions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Actions.init({
    receivedDate: DataTypes.STRING,
    givenDate: DataTypes.STRING,
    studentId: DataTypes.STRING,
    bookId: DataTypes.STRING,
    status:DataTypes.STRING
  }, {
    sequelize,
    tableName:"actions",
    modelName: 'Actions',
  });
  return Actions;
};