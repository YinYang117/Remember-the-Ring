const express = require('express');
const router = express.Router();
const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.delete('/:taskId(\\d+)', asyncHandler(async (req, res) => {
    const taskId = parseInt(req.params.taskId, 10);
    const doomedTask = await Task.findByPk(taskId);
    await doomedTask.destroy();
}));

module.exports = router;
