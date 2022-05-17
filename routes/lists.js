const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth, checkUser } = require('../auth');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');


router.get('/:userId(\\d+)/user-info', checkUser, asyncHandler(async (req, res) => {
    const userId = req.params.userId;
    const listId = req.cookies.listId;
    const userInfo = await User.findByPk(userId);
    res.json({ userInfo, listId })
}))

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
    res.clearCookie('listId');
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
    return res.json({ userLists })
}));

router.get('/today/:userId(\\d+)', asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    res.clearCookie('listId');

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
    res.clearCookie('listId');

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
    res.clearCookie('listId');
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

router.get('/:userId(\\d+)/tasks/search/:searchInput', checkUser, asyncHandler(async (req, res) => {
    res.clearCookie('listId');
    const userId = req.params.userId;
    const searchTerm = req.params.searchInput
    const userTasks = await Task.findAll({
        where: {
            userId: userId,
            title: {
                [Op.substring]: searchTerm
            }
        }
    });
    return res.json({ userTasks })
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
        where: {
            listId: listId
        }
    });

    res.cookie('listId', listId, { httpOnly: true, secure: true })
    return res.json({ taskList })
}));

router.post('/:userId(\\d+)/tasks', checkUser, asyncHandler(async (req, res, next) => {
    const { title, description, experienceReward, dueDate, dueTime } = req.body;
    const { listId } = req.cookies;
    const userId = req.params.userId;
    const userIdParsed = parseInt(userId, 10);

    console.log("########## MADE IT", listId)

    const newTask = await Task.create({
        title,
        description,
        experienceReward: experienceReward || 10,
        completed: false,
        listId,
        userId: userIdParsed,
        dueDate: dueDate || null,
        dueTime: dueTime || null
    });

    console.log(newTask, 'New task created!')
    res.json({ newTask })
}))


const newListValidator = [
    check('title')
        .custom((title, { req }) => {
            return List.findOne({
                where: {
                    userId: req.params.userId,
                    title: {
                        [Op.iLike]: `%${title}`
                    }
                }
            })
                .then(title => {
                    if (title) return Promise.reject('That list already exists')
                })
        })
        .isLength({ max: 20 })
        .withMessage('List name is too long(max 20 chars)')
        .exists({ checkFalsy: true })
        .withMessage('Please provide a list name')
];

router.post('/:userId(\\d+)/lists', checkUser, newListValidator, asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const { title } = req.body;
    const listValidators = validationResult(req);

    const newList = List.build({
        title,
        userId
    });
    console.log('List validators is here!!!!', listValidators)

    if (listValidators.isEmpty()) {

        await newList.save();
        console.log(newList, "#### NEW LIST CREATED ####")

        return res.json({ newList });

    } else {
        const errors = {}
        listValidators.array().forEach(err => {
            errors[err.param] = err.msg
        });

        return res.json({ errors });
    }

}));

router.put('/:userId/lists', checkUser, newListValidator, asyncHandler(async (req, res, next) => {
    const { title } = req.body;
    const { listId } = req.cookies;
    const updatedList = await List.findByPk(listId);

    const listValidators = validationResult(req);

    if (listValidators.isEmpty()) {
        updatedList.title = title;

        await updatedList.save();

        return res.json({ updatedList });

    } else {

        const errors = {}
        listValidators.array().forEach(err => {
            errors[err.param] = err.msg
        });

        return res.json({ errors });
    }
}))

router.delete('/:userId(\\d+)/lists', checkUser, asyncHandler(async (req, res, next) => {
    const { listId } = req.cookies;

    const listIdParse = parseInt(listId, 10)
    const doomedList = await List.findByPk(listIdParse);
    await doomedList.destroy();
    res.clearCookie(listId);
    res.json({ msg: 'List delted' })
}))


// router.get('/test-xp-func'), /*checkUser*/ asyncHandler(async (req, res, next) => {
//     const taskId = parseInt(req.params.taskId, 10);
//     const userId = parseInt(req.params.userId, 10);

//     const updatedTask = await Task.findByPk(taskId, {
//         include: User
//     });

//     console.log("#######################", updatedTask);
router.put('/:userId(\\d+)/exp-gain', asyncHandler(async (req, res, next) => {
    const { taskIds } = req.body;
    const userId = parseInt(req.params.userId, 10);



    const user = await User.findByPk(userId);

    // taskIds.forEach(async elem => {
    //     const parsedNum = parseInt(elem, 10)
    //     const updatedTask = await Task.findByPk(parsedNum);
    //     updatedTask.completed = true;
    //     await updatedTask.save();

    //     user.currentExp += updatedTask.experienceReward;

    //     if (user.currentExp >= 100) {
    //         user.currentLevel++
    //         const leftOverXp = user.currentExp % 100

    //         user.currentExp = leftOverXp;
    //         // console.log("#######################", user.currentExp, user.currentLevel);
    //     }
    //     await user.save();

    // })

    for await (const elem of taskIds) {
        const parsedNum = parseInt(elem, 10)
        const updatedTask = await Task.findByPk(parsedNum);
        updatedTask.completed = true;
        await updatedTask.save();

        user.currentExp += updatedTask.experienceReward;

        if (user.currentExp >= 100) {
            user.currentLevel++
            const leftOverXp = user.currentExp % 100

            user.currentExp = leftOverXp;
            // console.log("#######################", user.currentExp, user.currentLevel);
        }
        await user.save();

    }

    await user.save();


    res.json({ user: user });
}))





module.exports = router;
