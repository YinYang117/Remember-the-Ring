const db = require('./db/models');
const createError = require('http-errors');

const loginUser = (req, res, user) => {
  req.session.auth = {
    userId: user.id,
  };
};

const logoutUser = (req, res) => {
  delete req.session.auth;
  req.session.save(() => {
    res.redirect('/')
  })
};

const restoreUser = async (req, res, next) => {
  if (req.session.auth) {
    const { userId } = req.session.auth;

    try {
      const user = await db.User.findByPk(userId);

      if (user) {
        res.locals.authenticated = true;
        res.locals.user = user;
        next();
      }
    } catch (err) {
      res.locals.authenticated = false;
      next(err);
    }
  } else {
    res.locals.authenticated = false;
    next();
  }
};

const requireAuth = (req, res, next) => {
  if (!res.locals.authenticated) return res.redirect('/users/login');
  return next();
};

const checkUser = async (req, res, next) => {
  const paramsId = parseInt(req.params.userId, 10)
  if (req.session.auth.userId !== paramsId) next(createError(404));
  next();
}

module.exports = {
  loginUser,
  logoutUser,
  restoreUser,
  requireAuth,
  checkUser
};
