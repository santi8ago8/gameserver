var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var sessionstore = require('sessionstore');


var routes = require('./routes/index');
var users = require('./routes/users');
var servers = require('./routes/servers');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev', {
    skip: function (req, res) {
        return res.statusCode < 400
    }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var cookieP = cookieParser();
app.cookieP = cookieP;
app.use(cookieP);
var sess = session({
    secret: 'af680a4607f665a4f6e8ca1fd1e0ed7147ed6123ec214dd1a245095eb3b4a70b4cc1a0c86a04b5dea70a445c285861e4',
    resave: true,
    saveUninitialized: true,
    store: sessionstore.createSessionStore()
}, {
    cookie: {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 10 * 60 * 1000
    },
    rolling: true
});
app.use(sess);
app.sess = sess;

app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use('/bower_components',express.static(path.join(__dirname, 'bower_components')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/servers', servers);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
