var express = require('express');
var mongoose = require("mongoose");
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');
var MongoStore = require('connect-mongo')(session);
var moment = require('moment-timezone');

var db = require('./config/db');
var index = require('./routes/index');
var users = require('./routes/users');


var app = express();
mongoose.connect(db.url);
require('./config/passport')(passport);


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'donut',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie: { maxAge: 180 * 60 * 1000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.loginMessage = req.flash('loginMessage');
  res.locals.signupMessage = req.flash('signupMessage');
  res.locals.adminMessage = req.flash('adminMessage');
  next();
});

app.use('/', index);
app.use('/users', users);
require('./routes/routes.js')(app, passport);
//app.use('/login', routes);

app.use(express.static(path.join(__dirname, 'public')));
//app.use(express.static('public'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
/*
 var User = require('./models/user');
 var newUser = new User();
 newUser.userName    = "admin1";
 newUser.password = newUser.generateHash("admin");
 newUser.name = "admin1";
 newUser.email    = "admin1@gmail.com";
 newUser.address    = "richardson";
 newUser.phNo    = "1111111111";
 newUser.zipCode    = "12312";
 newUser.save(function(err){
 if (err) {
 console.log("Error saving");
 } else {
 console.log("Saved");
 }
 });
 */
console.log(moment().tz("America/Chicago").format("YYYY-MM-DD HH:mm:ss"));

module.exports = app;
