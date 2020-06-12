var createError = require('http-errors');
var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const expressLayouts = require('express-ejs-layouts');
var dotenv = require('dotenv');
const flash = require('connect-flash');
const session = require('express-session');

dotenv.config();


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');


//EJS
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs');
app.use(expressLayouts);



//Routes
app.use(express.static(__dirname + '/public'))

/* app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
}) */


app.use('/', indexRouter);
app.use('/users', usersRouter);
const PORT = process.env.PORT || 8000

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//Socket
const io = require('socket.io')(http)

io.on('connection', (socket) => {
  console.log('made socket connection', socket.id);
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
  // Handle typing event
  socket.on('typing', function(msg){
    socket.broadcast.emit('typing', msg);
  })
})



// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Connect flash
app.use(flash());


// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
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