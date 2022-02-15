const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')
const csrf = require('csurf')
const csrfProtection = csrf({ cookie: true });

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
  
router.get('/signup', csrfProtection, asyncHandler(async (req, res, next) => {

  res.render('signup', {
    user: {},
    errors: [],
    csrfToken: req.csrfToken(),
  });
}))

router.post('/signup', csrfProtection, asyncHandler(async (req, res, next) => {

}))

router.get('/login', csrfProtection, asyncHandler(async (req, res, next) => {
  res.render('login', {
    user: {},
    errors: [],
    csrfToken: req.csrfToken(),
  })
}));




module.exports = router;
