'use strict';
var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

var sockets = {};
var feeder = {};


app.get('/', (req, res)=>{
  res.status(200);
  res.sendFile(__dirname + '/KeylaKam.html');
});

app.get("/Feeder", (req, res)=>{
	res.status(200);
  res.sendFile(__dirname + '/feeder.html');
});

io.on('connect', function(socket) {
  var count = 0;
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);

  socket.on('liveStream', function(data){
    if(data){
      socket.broadcast.emit('stream', data);
    }
	    //socket.broadcast.emit('stream', "data:image/png;base64,"+ data.toString("base64"));
  });
  socket.on('feeder',function(){
    feeder[socket.id] = socket;
    console.log('hello', socket);
  });
  socket.on('disconnect', function() {
    delete sockets[socket.id];
    console.log("Total clients connected : ", Object.keys(sockets).length);
 
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
    //   app.set('watchingFile', false);
    //   if (proc) proc.kill();
    //   fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
  //startStreaming(io);
});


app.listen(55542);
