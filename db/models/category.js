'use strict';
module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {});
  Category.associate = function(models) {
    Category.hasMany(models.List, {foreignKey: 'categoryId'})
    Category.belongsTo(models.User, { foreignKey: 'userId'})
  };
  return Category;
};