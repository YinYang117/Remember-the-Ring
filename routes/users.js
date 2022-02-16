const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User, Category, List } = require('../db/models');
const router = express.Router();

const asyncHandler = require('express-async-handler');
const csrf = require('csurf');
const { loginUser, logoutUser } = require('../auth');
const csrfProtection = csrf({ cookie: true });

router.get('/signup', csrfProtection, ((req, res) => {
  // ^ Removed async
  const user = User.build();

  res.render('signup', {
    title: 'Wizard Signup',
    user: {},
    errors: {},
    csrfToken: req.csrfToken(),
  });
}))

const userValidators = [
  check('firstName')
    .isLength({ max: 50 })
    .withMessage('Please limit First Names to 50 characters.')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a First Name'),
  check('lastName')
    .isLength({ max: 50 })
    .withMessage('Please limit Last Names to 50 characters.')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a Last Name'),
  check('email')
    .custom((email) => {
      return User.findOne({ where: { email } })
        .then((user) => {
          if (user) return Promise.reject('The provided Email is already being used')
        })
    })
    .isLength({ max: 255 })
    .withMessage('Please limit Last Names to 255 characters.')
    .isEmail()
    .withMessage('Email is not valid')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an Email'),
  check('password')
    .matches(/^(?=.*[a-z])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter')
    .matches(/^(?=.*[A-Z])/, 'g')
    .withMessage('Password must contain at least 1 uppercase letter')
    .matches(/^(?=.*[0-9])/, 'g')
    .withMessage('Password must contain at least 1 number')
    .matches(/^(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain at least 1 special character (i.e. "!@#$%^&*")')
    .isLength({ max: 50 })
    .withMessage('Please limit passwords to 50 characters')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password'),
  check('confirmPassword')
    .custom((confirmedPass, { req }) => {
      if (confirmedPass !== req.body.password) {
        throw new Error('Confirm Password did not match password')
      }
      return true;
    })
    .isLength({ max: 50 })
    .withMessage('Confirm Password can not be longer then 50 characters')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password')
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
    console.log(user)

    const category = Category.build({
      name: "Work",
      userId: user.id
    })
    await category.save();

    
    loginUser(req, res, user);

    // !!!!!! TODO CHANGE THIS to the user login homepage
    res.redirect('/');
  } else {
    const errors = {}
    validationErrors.array().forEach(err => {
      errors[err.param]= err.msg
    });

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
    errors: {},
    loginErrors: [],
    title: 'Wizard Login',
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

  let loginErrors = [];
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
    loginErrors.push('Login failed, please try again')
  } else {
    const errors = {}
    validationErrors.array().forEach(err => {
      errors[err.param] = err.msg
    });

    res.render('login', {
      title: 'Wizard Login',
      email,
      errors,
      loginErrors: [],
      csrfToken: req.csrfToken()
    });
  }

  res.render('login', {
    title: 'Wizard Login',
    email,
    errors: {},
    loginErrors,
    csrfToken: req.csrfToken()
  });
}));

router.post('/logout', (req, res) => {

})





module.exports = router;
