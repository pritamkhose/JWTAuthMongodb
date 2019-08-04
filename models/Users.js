const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { Schema } = mongoose;

const UsersSchema = new Schema({
  username: String,
  email: String,
  hash: String,
  salt: String,
  resetcode: Number,
  resetTime: String,
  isActive: Boolean,
});

UsersSchema.methods.setPassword = function(password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  this.resetcode=  0,
  this.resetTime= null,
  this.isActive= true
};

UsersSchema.methods.setPasswordAgain = function(user, password) {
  user.salt = crypto.randomBytes(16).toString('hex');
  user.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  user.resetcode=  0;
  user.resetTime= null;
  user.isActive= true;
  return user;
};


UsersSchema.methods.validatePassword = function(password) {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UsersSchema.methods.forgotPassword = function(user) {
  user.resetcode=   Math.floor(100000 + Math.random() * 900000)
  user.resetTime= new Date()
  user.isActive= false
  return user;
};

UsersSchema.methods.generateJWT = function() {
  const today = new Date();
  const expirationDate = new Date(today);
  expirationDate.setDate(today.getDate() + 60);
  // console.log(parseInt(expirationDate.getTime() / 1000, 10));

  return jwt.sign({
    email: this.email,
    username: this.username,
    id: this._id,
    exp: parseInt(expirationDate.getTime() / 1000, 10),
  }, 'secret');
}

UsersSchema.methods.toAuthJSON = function() {
  return {
    // _id: this._id,
    email: this.email,
    username: this.username,
    token: this.generateJWT(),
    // expirationDateTime: expirationDate.toString(),
  };
};

module.exports = mongoose.model('Users', UsersSchema);