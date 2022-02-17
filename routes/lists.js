const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth, checkUser  } = require('../auth');

const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.get('/:userId(\\d+)', asyncHandler(async (req, res) => {
    console.log("log is here #############",req.session.auth)
    const { userId } = req.session.auth

    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    if (user) {
        res.render('lists', { userId: userId })
    }
}));

router.get('/:userId(\\d+)/tasks', checkUser, asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const userTasks = await Task.findAll({
        where: { userId: userId }
    });
    return res.json({userTasks})
}));

router.get('/:userId(\\d+)/lists', asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const userLists = await List.findAll({
        where: { userId: userId }
    });
    return res.json({ userLists })
}));

router.get('/:userId(\\d+)/tasks/:taskId(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId
    const userTask = await Task.findOne({
        where: { taskId: taskId }
    });
    return res.json({ userTask })
}));

router.get('/:userId(\\d+)/lists/:listId(\\d+)/tasks', asyncHandler(async (req, res, next) => {
    const listId = req.params.listId;
    const taskList = await Task.findAll({
        where: { listId: listId}
    });
    return res.json({ taskList })
}));

router.post('/:userId(\\d+)/tasks', asyncHandler(async (req, res, next) => {
    const { title, description, experienceReward, dueDate, dueTime } = req.body;
    const userId = req.params.userId
    const userIdParsed = parseInt(userId, 10);
    const newTask = await Task.create({
        title,
        description,
        experienceReward: experienceReward || 10,
        completed: false,
        userId: userIdParsed,
        dueDate,
        dueTime
    });
    
    console.log(newTask, 'New task created!')

}))

module.exports = router;


// const today = new Date()
// const year = today.getFullYear().toString;
// const month = (today.getMonth()+1).toString();
// const tomorrow = (today.getDate()+1).toString();
// const fulldate = [year, month, tomorrow]
// const ourFormat = fulldate.join('-')
