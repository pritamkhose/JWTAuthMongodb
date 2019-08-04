var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const bodyParser = require('body-parser');
const session = require('express-session');
const cors = require('cors');
const mongoose = require('mongoose');

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

//Configure mongoose's promise to global promise
mongoose.promise = global.Promise;

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//Configure our app
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'passport-tutorial', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false }));

//Configure Mongoose
// mongoose.connect('mongodb://localhost/mongodb_database_name');
mongoose.connect('mongodb://mongodb_username:mongodb_password@cluster0-shard-00-00-qhmqk.mongodb.net:27017,cluster0-shard-00-01-qhmqk.mongodb.net:27017,cluster0-shard-00-02-qhmqk.mongodb.net:27017/mongodb_database_name?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
mongoose.set('debug', true);

//Models & routes
require('./models/Users');
require('./config/passport');

app.use(require('./routes'));
// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
