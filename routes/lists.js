const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth } = require('../auth');

const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.get('/:userId(\\d+)', asyncHandler(async (req, res) => {
    console.log("log is here #############", req.session.auth)
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

router.get('/info/:userId(\\d+)', asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const userTasks = await Task.findAll({
        where: { userId: userId }
    });
    console.log(userTasks);
    const userLists = await List.findAll({
        where: { userId: userId }
    });
    return res.json({ userLists, userTasks })
}));

router.get('/today/:userId(\\d+)', asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const today = new Date()
    const year = today.getFullYear().toString;
    const month = (today.getMonth() + 1).toString();
    const date = today.getDate().toString();
    const fulldate = [year, month, date];
    const dbFormatedDate = fulldate.join('-');

    const tasksToday = await Task.findAll({
        where: {
            [Op.and]: [{ userId: userId }, { dueDate: dbFormatedDate }]
        },
        order: [ ['dueTime', 'ASC'] ]
    })

    return res.json({ tasksToday });
}));

router.post('/:userId(\\d+)/tasks', asyncHandler(async (req, res, next) => {
    const userId = req.params.userId
    const userIdParsed = parseInt(userId, 10);
    const newTask = await Task.create({
        title: req.body.taskTitle,
        description: req.body.description,
        experienceReward: 10,
        completed: false,
        userId: userIdParsed
    });

    console.log(newTask, 'New task created!')

}))

module.exports = router;
