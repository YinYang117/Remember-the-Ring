const express = require('express');

// adding express validator
// also added npm i express-validator to commands
const {check, validationResult } = require('express-validator');

// import db for user creation and queries
const db = require('../db/models');

const asyncHandler = require('express-async-handler')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true });
const router = express.Router();

// Deleted get /users route

router.get('/signup', csrfProtection, ((req, res) => {
  // ^ Removed async
  const user = db.User.build();

  res.render('signup', {
    // Pass variables like 'title' into pugs from here
    user: {},
    // deleted errors. shouldn't need errors in this scope.
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
    .withMessage('Please limit Last Names to 255 characters.'),

];

router.post('/signup', asyncHandler(async(req, res) => {

}))

router.get('/login', (req, res) => {

});

router.post('/login', (req, res) => {

})




module.exports = router;
