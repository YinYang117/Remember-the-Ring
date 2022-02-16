const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth } = require('../auth');

const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.get('/:userId(\\d+)', restoreUser, asyncHandler(async (req, res) => {
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
    return res.json({userLists, userTasks})
}))

module.exports = router;
