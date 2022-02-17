const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth, checkUser } = require('../auth');

const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.get('/:userId(\\d+)', checkUser, asyncHandler(async (req, res) => {
    console.log("log is here #############",req.session.auth)
    const { userId } = req.session.auth

    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    if (user) {
        res.render('lists', { userId: userId, user })
    }
}));

router.get('/:userId(\\d+)/tasks', checkUser, asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const userTasks = await Task.findAll({
        where: { userId: userId }
    });
    return res.json({ userTasks })
}));

router.get('/:userId(\\d+)/lists', checkUser, asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
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
        order: [['dueTime', 'ASC']]
    })

    return res.json({ tasksToday });
}));

router.get('/tomorrow/:userId(\\d+)', asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const today = new Date()
    const year = today.getFullYear().toString;
    const month = (today.getMonth() + 1).toString();
    const dateTomorrow = (today.getDate() + 1).toString();
    const fulldate = [year, month, dateTomorrow];
    const dbFormatedDate = fulldate.join('-');

    const tasksTomorrow = await Task.findAll({
        where: {
            [Op.and]: [{ userId: userId }, { dueDate: dbFormatedDate }]
        },
        order: [['dueTime', 'ASC']]
    })

    return res.json({ tasksTomorrow })
}));

router.get('/this-week-tasks/:userId(\\d+)', asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const tasksArray = [];

    const today = new Date()

    const dateFormatter = (date) => {
        const year = date.getFullYear().toString;
        const month = (date.getMonth() + 1).toString();
        const currentDay = date.getDate().toString();
        const fulldate = [year, month, currentDay];
        const dbFormatedDate = fulldate.join('-');

        return dbFormatedDate;
    }



    for (let i = 0; i < (7 - today.getDay()); i++) {
        let iDay = dateFormatter(today + i)
        let tasks = Task.findAll({
            where: {
                [Op.and]: [{ userId: userId }, { dueDate: iDay }]
            },
            order: [['dueTime', 'ASC']]
        })
        tasksArray.push(...tasks)
    }
    console.log('Array is here!!!!!!!!!!!!!!!!!!!', tasksArray)

    return res.json({ tasksArray })
}));



router.get('/:userId(\\d+)/tasks/:taskId(\\d+)', asyncHandler(async (req, res, next) => {
    const taskId = req.params.taskId
    const userTask = await Task.findOne({
        where: { taskId: taskId }
    });
    return res.json({ userTask })
}));

router.get('/:userId(\\d+)/lists/:listId(\\d+)/tasks', checkUser, asyncHandler(async (req, res, next) => {
    const listId = req.params.listId;
    const taskList = await Task.findAll({
        where: { listId: listId }
    });
    return res.json({ taskList })
}));

router.post('/:userId(\\d+)/tasks', checkUser, asyncHandler(async (req, res, next) => {
    const { title, description, experienceReward, dueDate, dueTime } = req.body;
    const userId = req.params.userId
    const userIdParsed = parseInt(userId, 10);
    const newTask = await Task.create({
        title,
        description,
        experienceReward: experienceReward || 10,
        completed: false,
        listId: 1,
        userId: userIdParsed,
        dueDate,
        dueTime
    });

    console.log(newTask, 'New task created!')
    return
}))

module.exports = router;
