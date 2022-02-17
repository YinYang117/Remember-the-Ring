const db = require('./db/models');

const loginUser = (req, res, user) => {
  console.log("Hello from loginUser in Auth")

  req.session.auth = {
    userId: user.id,
  };
  
  // console.log("session auth", req.session.auth)
};

const logoutUser = (req, res) => {
  delete req.session.auth;
};

const restoreUser = async (req, res, next) => {
  // Log the session object to the console
  // to assist with debugging.
  console.log(req.session);

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

const requireAuth = (req, res) => {
  if (!res.locals.authenticated) return res.redirect('/user/login');
  return next();
};

module.exports = {
  loginUser,
  logoutUser,
  restoreUser,
  requireAuth
};