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
    }
  }, {});
  List.associate = function (models) {
    List.hasMany(models.Task, { foreignKey: 'listId', onDelete: 'cascade', hooks: true })
    List.belongsTo(models.User, { foreignKey: 'userId'})
  };
  return List;
};