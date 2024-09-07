'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      bookId:{
        type:DataTypes.STRING
      },
      year:{
        type:DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING
      },
      genre: {
        type: DataTypes.STRING
      },
      stock: {
        type: DataTypes.INTEGER
      },
      inLibrary: {
        type: DataTypes.INTEGER
      },
      outLibrary: {
        type: DataTypes.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('books');
  }
};