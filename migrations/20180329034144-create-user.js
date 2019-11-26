'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },   
      lastName: {  
        type: Sequelize.STRING, 
        allowNull: true  
      },
      email: {
          type: Sequelize.STRING,
          allowNull: true
      },
      signPlace: {
        type: Sequelize.STRING,
        allowNull: true
      },
      hash:{
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      pdfId: {
        type: Sequelize.INTEGER
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('users');
  }
};