var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var multer = require('multer');
var config = require('./config');

//var routes = require('./routes/index');
//var users = require('./routes/users');
//var images = require('./routes/images');
//var pm = require('./routes/pm');
//var proxy = require('./routes/proxy');


var app = express();

var initRouter = function(app){
    var routeMap = {
        '/': './routes/index',
        '/users': './routes/users',
        '/image': './routes/images',
        '/github': './routes/github'
        //'/pm': './routes/pm',
        //'/proxy': './routes/proxy'
    };

    for(var k in routeMap){
        if (routeMap.hasOwnProperty(k)){
            app.use(k, require(routeMap[k]));
        }
    }
};

// To disable Swig's cache, do the following:
swig.setDefaults({ cache: false });
// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 使 express 4 支持 form-data, 默认只支持
// application/x-www-form-urlencoded and application/json request body data.
app.use(multer({
    dest: config.path.upload + '/tmp'
}));
app.use('/upload', express.static(path.join(config.path.upload)));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

initRouter(app);

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
        console.log(err);
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
