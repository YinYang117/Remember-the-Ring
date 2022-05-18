const express = require('express');
const router = express.Router();
const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.delete('/:taskId(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const doomedTask = await Task.findByPk(taskId);
    await doomedTask.destroy();
    res.json({})
}));

router.put('/:taskId(\\d+)', asyncHandler(async (req, res) => {
    const { title, description, experienceReward, dueDate, dueTime } = req.body;
    const taskId = parseInt(req.params.taskId, 10);
    const updatedTask = await Task.findByPk(taskId);

    updatedTask.title = title;
    updatedTask.description = description;
    updatedTask.experienceReward = experienceReward;
    updatedTask.dueDate = dueDate || null;
    updatedTask.dueTime = dueTime || null;

    await updatedTask.save();
    return res.json({ updatedTask: updatedTask });
}));

router.get('/:taskId(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const task = await Task.findOne({
        where: {
            id: taskId
        }
    })
    return res.json({ task: task })
}));

module.exports = router;
