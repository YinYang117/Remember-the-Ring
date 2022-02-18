'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING
    },
    experienceReward: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    completed: {
      allowNull: false,
      type: DataTypes.BOOLEAN
    },
    listId: {
      type: DataTypes.INTEGER
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.DATEONLY
    },
    dueTime: {
      type: DataTypes.STRING
    }
  }, {});
  Task.associate = function (models) {
    Task.belongsTo(models.List, { foreignKey: 'listId'})
    Task.belongsTo(models.User, { foreignKey: 'userId'})
  };
  return Task;
};