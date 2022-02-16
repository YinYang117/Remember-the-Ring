const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth } = require('../auth');

const { User, List, Task, Category } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.get('/', restoreUser, asyncHandler(async (req, res) => {
    const { userId } = req.session.auth

    const user = await User.findOne({
        where: {
            id: userId
        }
    })
    if (user) {
        const userCategories = await Category.findAll({
            where: {
                userId: userId
            }
        })
        console.log(userCategories)

    }

}));

module.exports = router;
