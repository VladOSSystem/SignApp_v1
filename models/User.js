'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    firstName:DataTypes.STRING, 
    lastName:DataTypes.STRING,
    email: DataTypes.STRING,
    signPlace: DataTypes.STRING, 
    hash: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // User belongsTo Shop
    User.belongsTo(models.Pdf, { foreignKey: 'pdfId' });
  };
  return User;
};