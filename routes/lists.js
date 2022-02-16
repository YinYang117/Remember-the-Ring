const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const { logoutUser, restoreUser, requireAuth } = require('../auth');

const { User, List, Task } = require('../db/models');
const asyncHandler = require('express-async-handler');

router.get('/', restoreUser, asyncHandler(async (req, res) => {
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

module.exports = router;
