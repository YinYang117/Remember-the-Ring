const express = require('express');
const router = express.Router();
const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.delete('/:taskId(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const doomedTask = await Task.findByPk(taskId);
    await doomedTask.destroy();
}));

router.put('/:taskId(\\d+)', asyncHandler(async (req, res) => {
    const { title, description, experienceReward, dueDate, dueTime } = req.body;
    const taskId = parseInt(req.params.taskId, 10);
    const updatedTask = await Task.findByPk(taskId);

    if (title) {
        updatedTask.title = title;
    }

    if (description) {
        updatedTask.description = description;
    }

    if (experienceReward) {
        updatedTask.experienceReward = experienceReward;
    }

    if (dueDate) {
        updatedTask.dueDate = dueDate;
    }

    if (dueTime) {
        updatedTask.dueTime = dueTime;
    }
    await updatedTask.update()
}));

module.exports = router;
