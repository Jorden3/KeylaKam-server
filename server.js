'use strict';

var express = require('express'); // do not change this line
var server = express();
var socket = require('socket.io');
var path = require('path');

var sockets = {};
var feeder = {};
 

// server.get('/', (req,res)=>{
//     res.send('hello');
// });

server.use('/', express.static(__dirname+'/'));
var io = socket(server.listen(8080)); // do not change this line

server.get('/KeylaKam', (req, res)=>{
  res.sendFile(path.join(__dirname + '/feeder.html'));
});

io.on('connect', function(socket) {
  var count = 0;
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('liveStream', function(data){

    socket.broadcast.emit('stream', data);
      //socket.broadcast.emit('stream', "data:image/png;base64,"+ image.toString("base64"));
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

