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
      type: DataTypes.INTEGER,
      allowNull: false
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    dueDate: {
      type: DataTypes.STRING
    },
    dueTime: {
      type: DataTypes.STRING
    }
  }, {});
  Task.associate = function (models) {
    // associations can be defined here
  };
  return Task;
};