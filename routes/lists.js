const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth, checkUser } = require('../auth');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.get('/:userId(\\d+)', checkUser, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth

    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    if (user) {
        res.render('lists', { user, title: `${user.firstName}'s to-do` })
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
    const userId = parseInt(req.params.userId, 10);

    const today = new Date();

    const tasksToday = await Task.findAll({
        where: {
            userId: userId,
            dueDate: today
        },
        order: [['dueTime', 'ASC']]
    })
    console.log('Over Here!!!!!!!!!!!!!!!', tasksToday)

    return res.json({ tasksToday });
}));

router.get('/tomorrow/:userId(\\d+)', asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const todayMillis = Date.now();

    const tomorrow = new Date(todayMillis + 86400000);

    const tasksTomorrow = await Task.findAll({
        where: {
            [Op.and]: [{ userId: userId }, { dueDate: tomorrow }]
        },
        order: [['dueTime', 'ASC']]
    })

    return res.json({ tasksTomorrow })
}));

router.get('/this-week-tasks/:userId(\\d+)', asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const today = new Date();

    const todayMillis = Date.now();

    const currentDayOfWeek = today.getDay();

    const remainingDays = 6 - currentDayOfWeek;

    const saturday = new Date(remainingDays * 86400000 + todayMillis)

    const tasksWeek = await Task.findAll({
        where: {
            userId: userId,
            dueDate: {
                [Op.between]: [today, saturday]
            }
        },
        order: [['dueDate', 'ASC']]
    });

    // const today = new Date()
    // const todaysInteger = today.getDate();
    // const dayInteger = today.getDay();
    // const nextSunday = todaysInteger + (7 - dayInteger)

    // const dateFormatter = (date) => {
    //     const year = date.getFullYear().toString;
    //     const month = (date.getMonth() + 1).toString();
    //     const currentDay = date.getDate().toString();
    //     const fulldate = [year, month, currentDay];
    //     const dbFormatedDate = fulldate.join('-');
    //     return dbFormatedDate;
    // }

    // for (let i = 0; i < (7 - today.getDay()); i++) {
    //     let iDay = dateFormatter(today + i)
    //     let tasks = await Task.findAll({
    //         where: {
    //             [Op.and]: [{ userId: userId }, { dueDate: iDay }]
    //         },
    //         order: [['dueTime', 'ASC']]
    //     })
    //     tasksArray.push(...tasks)
    // }
    // console.log('Array is here!!!!!!!!!!!!!!!!!!!', tasksArray)

    return res.json({ tasksWeek: tasksWeek });
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
    const { title, description, experienceReward, listId, dueDate, dueTime } = req.body;
    const userId = req.params.userId;
    const userIdParsed = parseInt(userId, 10);
    const newTask = await Task.create({
        title,
        description,
        experienceReward: experienceReward || 10,
        completed: false,
        listId,
        userId: userIdParsed,
        dueDate,
        dueTime
    });

    console.log(newTask, 'New task created!')
    return
}))

router.post('/:userId(\\d+)/lists', checkUser, asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { title } = req.body;
    const newList = await List.create({
        title,
        userId
    });
    console.log(newList, "New list created!");
    return;
}))


module.exports = router;
