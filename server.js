var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var strategy = require('passport-http').BasicStrategy; 
var passport = require('passport');
var session = require('express-session');

server.listen(8080);
var sockets = {};
var feeder;

var user = [{name:'jay', password:'Roosko06'},{name:'tay', password:'Jorden11'}]
passport.use(new strategy(function(userid,password, done){
  if(user.findIndex(value=>{value.name = userid}) >= 0){
    return done(null, false); 
  }else if(user.findIndex(value=>{value.password = password}) >= 0){
    return done(null, false); 
  }else{
    return done(null, user);
  }
}));

app.use(session({
    'store': new session.MemoryStore(),
    'secret': 'a secret to sign the cookie',
    'resave': false,
    'saveUninitialized': false,
}), express.static(__dirname + '/'))

//io.set('origins', "*");

app.get('/', passport.authenticate('basic', {session:false}), (req, res)=>{
  res.status(200);
  res.sendFile(__dirname + '/KeylaKam.html');
});

//directs to feeder implementation on server w/o button push
app.get("/Feeder", passport.authenticate('basic', {session:false}),(req, res)=>{
	res.status(200);
  res.sendFile(__dirname + '/feeder.html');
});

io.on('connect', function(socket) {
  var count = 0;
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

  //get stream from feeder and boardcast it to users
  socket.on('liveStream', function(data){
    if(data){
      socket.broadcast.emit('stream', data);
    }
	    //socket.broadcast.emit('stream', "data:image/png;base64,"+ data.toString("base64"));
  });

  //to know what socket the feeder is
  socket.on('feeder',function(){
    feeder = socket;
    console.log('hello', socket);
  });


  //listen from button push and emits the action to feeder
  socket.on('feed',function(){
    console.log('EAT');
    if(feeder){
      feeder.emit('feed');
    }
  });

  socket.on('disconnect', function() {
    delete sockets[socket.id];
    console.log("Total clients connected : ", Object.keys(sockets).length);
  });
});


