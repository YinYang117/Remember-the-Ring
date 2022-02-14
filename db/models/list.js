'use strict';
module.exports = (sequelize, DataTypes) => {
  const List = sequelize.define('List', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {});
  List.associate = function (models) {
    List.hasMany(models.Task, { foreignKey: 'listId'})
    List.belongsTo(models.User, { foreignKey: 'userId'})
    List.belongsTo(models.Category, { foreignKey: 'categoryId'})
  };
  return List;
};