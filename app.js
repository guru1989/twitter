var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Twit = require("twit");
var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
var server = require("http").createServer(app);
var port = 3000;
server.listen(port);
console.log("Socket.io server listening at http://127.0.0.1:" + port);
var sio = require("socket.io").listen(server);




var T = new Twit({
    consumer_key:         process.env.TWITTER_CONSUMER_KEY
  , consumer_secret:      process.env.TWITTER_CONSUMER_SECRET
  , access_token:         process.env.TWITTER_ACCESS_TOKEN
  , access_token_secret:  process.env.TWITTER_ACCESS_SECRET
});






sio.sockets.on("connection", function(socket){

    love=0;
    hate=0;
    total=0;

    stream = T.stream('statuses/filter', { track: ['love','hate'], language: 'en' });
    

    socket.on("stop",function(data){
        stream.stop()});

    stream.on('tweet', function (tweet) {
        var temp=tweet.text.toLowerCase();
        if(temp.indexOf("love")!=-1){
            love++;
            total++;
            socket.volatile.emit("love-tweet", {user: tweet.user.screen_name,
            text: tweet.text, love: (love/total)*100, lovecount: love, hatecount: hate, total: total });
        }
        if(temp.indexOf("hate")!=-1){
            hate++;
            total++;
            socket.volatile.emit("hate-tweet", {user: tweet.user.screen_name,
            text: tweet.text, hate: (hate/total)*100, lovecount: love, hatecount: hate, total: total });
        }

    });

    socket.on('disconnect', function () {
      stream.stop();
    });

});




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

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
