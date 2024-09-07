'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({Students}) {
      // define association here
      this.belongsToMany(Students,{
        through:"Givenbooks",
        as:"received_books",
        foreignKey:"bookId"
      })
    }
  }
  Books.init({
    bookId:DataTypes.STRING,
    year:DataTypes.INTEGER,
    name: DataTypes.STRING,
    genre: DataTypes.STRING,
    stock: DataTypes.INTEGER,
    inLibrary: DataTypes.INTEGER,
    outLibrary: DataTypes.INTEGER
  }, {
    sequelize,
    tableName:"books",
    modelName: 'Books',
  });
  return Books;
};