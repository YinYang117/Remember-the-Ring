const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const { User, List } = require('../db/models');
const router = express.Router();

const asyncHandler = require('express-async-handler');
const csrf = require('csurf');
const { loginUser, logoutUser, restoreUser } = require('../auth');
const csrfProtection = csrf({ cookie: true });

router.get('/signup', csrfProtection, ((req, res) => {
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
    .withMessage('First name has a 50 character limit')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a first name'),
  check('lastName')
    .isLength({ max: 50 })
    .withMessage('Last name has a 50 character limit')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a last Name'),
  check('email')
    .custom((email) => {
      return User.findOne({ where: { email } })
        .then((user) => {
          if (user) return Promise.reject('Email already in use')
        })
    })
    .isLength({ max: 255 })
    .withMessage('Email has a 255 character limit')
    .isEmail()
    .withMessage('Email is not valid')
    .exists({ checkFalsy: true })
    .withMessage('Please provide an email'),
  check('password')
    .matches(/^(?=.*[a-z])/, 'g')
    .withMessage('Password must contain at least 1 lowercase letter')
    .matches(/^(?=.*[A-Z])/, 'g')
    .withMessage('Password must contain at least 1 uppercase letter')
    .matches(/^(?=.*[0-9])/, 'g')
    .withMessage('Password must contain at least 1 number')
    .matches(/^(?=.*[!@#$%^&*])/, 'g')
    .withMessage('Password must contain 1 special character')
    .isLength({ max: 50 })
    .withMessage('Passwords has a 50 character limit')
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
    .withMessage('50 character limit')
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

    loginUser(req, res, user);

    req.session.save(() => {
      res.redirect(`/lists/${user.id}`);
    });
    return

  } else {
    const errors = {}
    validationErrors.array().forEach(err => {
      errors[err.param] = err.msg
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


  if (req.session.auth) {
    const { userId } = req.session.auth;
    res.redirect(`/lists/${userId}`);
  } else {
    res.render('login', {
      errors: {},
      loginErrors: [],
      title: 'Wizard Login',
      csrfToken: req.csrfToken(),
    })
  }
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
    email,
    password
  } = req.body;

  let loginErrors = [];
  const validationErrors = validationResult(req);

  if (validationErrors.isEmpty()) {
    const user = await User.findOne({ where: { email } });

    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.hashedPassword.toString());

      if (passwordMatch) {
        loginUser(req, res, user);

        req.session.save(() => {
          res.redirect(`/lists/${user.id}`);
        });
        return
      }

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


router.get('/signout', logoutUser, (req, res) => { })



router.post('/login/guest', csrfProtection, asyncHandler(async (req, res) => {



  let guestEmail = Math.random().toString(16).substring(2, 20) + "@guest.com"
  let checkGuestEmail = true;

  while (checkGuestEmail) {

    checkGuestEmail = await User.findOne({
      where: {
        email: guestEmail
      }

    });

    guestEmail = Math.random().toString(16).substring(2, 20) + "@guest.com"

  }

  let guestPassword = Math.random().toString(16).substring(2, 20);

  const hashedPass = await bcrypt.hash(guestPassword, 10);


  const user = await User.build({
    email: guestEmail,
    firstName: 'Guest',
    lastName: 'User',
    hashedPassword: hashedPass,
    currentLevel: 1,
    currentExp: 0,
    isGuest: true
  });

  await user.save();

  loginUser(req, res, user);

  // setTimeout(async () => {
  //   await user.destroy();
  // }, 86400);

  req.session.save(() => {
    res.redirect(`/lists/${user.id}`);
  });
  return;

}));




module.exports = router;
