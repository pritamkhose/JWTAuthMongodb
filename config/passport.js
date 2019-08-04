const passport = require('passport');
const LocalStrategy = require('passport-local');

const Users = require('../models/Users');

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
}, (email, password, done) => {
  Users.findOne({ email })
    .then((user) => {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { error: 'email or password is invalid' });
      }

      return done(null, user);
    }).catch(done);
}));