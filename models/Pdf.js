'use strict';
module.exports = (sequelize, DataTypes) => {
  var Pdf = sequelize.define('Pdf', {
    title: DataTypes.STRING,
    file: DataTypes.TEXT  
  }, {});
  Pdf.associate = function(models) {
    // Pdf hasMany Coffees
    Pdf.hasMany(models.User);
  };
  return Pdf;
};