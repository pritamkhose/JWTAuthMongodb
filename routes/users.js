const passport = require('passport');
const router = require('express').Router();
const auth = require('./auth');
const Users = require('../models/Users');

//POST register new user (optional, everyone has access)
router.post('/register', auth.optional, (req, res, next) => {

  if (!req.body.email) {
    return res.status(422).json({
      error: 'email is required',
    });
  }

  if (!req.body.password) {
    return res.status(422).json({
      error: 'password is required',
    });
  }

  if (!req.body.username) {
    return res.status(422).json({
      error: 'username is required',
    });
  }

  Users.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  })
    .then((user) => {
      if (!user) {
        var finalUser = new Users(req.body);
        console.log(req.body);
        console.log(finalUser);
        finalUser.setPassword(req.body.password);
        console.log(finalUser);
        return finalUser.save()
          .then(() => res.json({ user: finalUser.toAuthJSON() }))
          .catch((err) => { res.status(400).json({ error: err }); });;
      }

      return res.status(200).json({
        error: 'user is already exist',
      });
    });
});

//POST forgot Password and genrate reset code
router.post('/forgotPassword', auth.optional, (req, res, next) => {

  if (!req.body.email && !req.body.username) {
    return res.status(422).json({
      error: 'username or email is required',
    });
  }

  Users.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          error: 'Invalid user or email',
        });
      } else {
        user = user.forgotPassword(user);
        user.save()
          .then(() => res.status(200).json({ message: 'Reset code ' + user.resetcode + ' is send to user' }))
          .catch((err) => { res.status(400).json({ error: err }); });
      }
    });
});

//POST save New Password
router.post('/setNewPassword', auth.optional, (req, res, next) => {

  if (!req.body.email && !req.body.username) {
    return res.status(422).json({
      error: 'username or email is required',
    });
  }

  if (!req.body.password) {
    return res.status(422).json({
      error: 'password is required',
    });
  }

  if (!req.body.resetcode) {
    return res.status(422).json({
      error: 'resetcode is required',
    });
  }

  Users.findOne({
    $or: [
      { username: req.body.username },
      { email: req.body.email }
    ]
  })
    .then((user) => {
      if (!user) {
        return res.status(200).json({
          error: 'Invalid user or email',
        });
      } else {
        if (user.resetcode === req.body.resetcode && req.body.resetcode != 0) {
          var dt = new Date(user.resetTime);
          dt.setMinutes(dt.getMinutes() + 10); //10 min is expirey time for valid reset code
          if ((dt - (new Date()) > 0)) {
            user = user.setPasswordAgain(user, req.body.password);
            user.save()
              .then(() => res.status(200).json({
                message: 'New password is set, Go ahead for Login.',
              }));
          } else {
            user = user.forgotPassword(user);
            user.save()
              .then(() => res.status(200).json({
                message: 'resetcode has been expired and new Reset code ' + user.resetcode + ' is send to user',
              }))
              .catch((err) => { res.status(400).json({ error: err }); });
          }
        } else {
          res.status(200).json({
            message: 'Invalid resetcode',
          });
        }
      }
    });
});

//POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {

  if (!req.body.email) {
    return res.status(422).json({
      error: 'email is required',
    });
  }

  if (!req.body.password) {
    return res.status(422).json({
      error: 'password is required',
    });
  }

  return passport.authenticate('local', { session: false }, (err, passportUser, info) => {
    if (err) {
      console.log('err');
      return next(err);
    }

    if (passportUser) {
      const user = passportUser;
      user.token = passportUser.generateJWT();

      // return res.json({ user: user.toAuthJSON() });
      return res.json(user.toAuthJSON());
    }

    return res.json(info);//status(400).info;
  })(req, res, next);
});

//GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res, next) => {
  const { payload: { id } } = req;

  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }

      return res.json({ user: user });
    });
});

// GET users running (optional, everyone has access)
router.get('/', auth.optional, function (req, res, next) {
  return res.status(200).json({
    message: 'User is running',
  });
});

module.exports = router;
