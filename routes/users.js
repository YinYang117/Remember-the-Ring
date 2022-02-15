const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { db, User } = require('../db/models');
const router = express.Router();

const asyncHandler = require('express-async-handler')
const csrf = require('csurf');
const { loginUser, logoutUser } = require('../auth');
const csrfProtection = csrf({ cookie: true });
const router = express.Router();

router.get('/signup', csrfProtection, ((req, res) => {
  // ^ Removed async
  const user = User.build();

  res.render('signup', {
    title: 'Wizard Signup',
    user: {},
    csrfToken: req.csrfToken(),
  });
}))

const userValidators = [
  check('firstName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a First Name')
    .isLength({ max: 50 })
    .withMessage('Please limit First Names to 50 characters.'),
  check('lastName')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a Last Name')
    .isLength({ max: 50 })
    .withMessage('Please limit Last Names to 50 characters.'),
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an Email')
    .isLength({ max: 255 })
    .withMessage('Please limit Last Names to 255 characters.')
    .isEmail()
    .withMessage('Email is not valid')
    .custom((email) => {
      return User.findOne({ where: { email } })
        .then((user) => {
          if (user) return Promise.reject('The provided Email is already being used')
        })
    }),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password')
    .isLength({ max: 50 })
    .withMessage('Please limit passwords to 50 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter, uppercase letter, number, and special character (i.e. "!@#$%^&*")'),
  check('confirmPassword')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password')
    .isLength({ max: 50 })
    .withMessage('Confirm Password can not be longer then 50 characters')
    .custom((confirmedPass, { req }) => {
      if (confirmedPass !== req.body.password) {
        throw new Error('Confirm Password did not match password')
      }
      return true;
    })
];

router.post('/signup', userValidators, csrfProtection, asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password
  } = req.body;

  const user = User.build({
    email,
    firstName,
    lastName,
    currentLevel: 1,
    currentExp: 0
  });

  const validationErrors = validationResult(req)

  if (validationErrors.isEmpty()) {
    user.hashedPassword = await bcrypt.hash(password, 10);
    await user.save();
    loginUser(req, res, user);

    // !!!!!! TODO CHANGE THIS to the user login homepage
    res.redirect('/');

  } else {
    const errors = validationErrors.array().map((error) => error.msg);
    res.render('signup', {
      title: 'Wizard Signup',
      user,
      errors,
      csrfToken: req.csrfToken(),
    });
  }
}));

router.get('/login', csrfProtection, (req, res, next) => {
  res.render('login', {
    title: 'Wizard loggin in',
    csrfToken: req.csrfToken(),
  })
});

const loginValidators = [
  check('email')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Email Address'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for Password'),
];

router.post('/login', csrfProtection, loginValidators, asyncHandler(async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password
  } = req.body;

  let errors = [];
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    const user = await User.findOne({ where: { email } });
    if (user !== null) {
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());
      if (passwordMatch) {
        loginUser(req, res, user);

        //!!!!!!!!!!!!!!!!!!!!!!! homepage
        return res.redirect('/');

      };
    }
    errors.push('Login failed, please try again')
  } else { errors = validationErrors.array().map((error) => error.msg) }

  res.render('login', {
    title: 'Wizard Login',
    email,
    errors,
    csrfToken: req.csrfToken()
  });
}));

router.post('/logout')

// THIS IS STRICTLY FOR TEST PURPOSES DELETE WHEN LISTS ROUTE IS SETUP
router.get('/list_test', csrfProtection, asyncHandler(async (req, res, next) => {
  res.render('lists', {
    user: {},
    errors: [],
    csrfToken: req.csrfToken(),
  })
}));




module.exports = router;
