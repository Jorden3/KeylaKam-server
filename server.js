'use strict';

var express = require('express'); // do not change this line
var server = express();
var socket = require('socket.io');
var fs = require('fs');


var spawn = require('child_process').spawn;

var sockets = {};
 

// server.get('/', (req,res)=>{
//     res.send('hello');
// });

server.use('/', express.static(__dirname+'/'));
var io = socket(server.listen(process.env.PORT || 8080)); // do not change this line

io.on('connection', function(socket) {
 
  sockets[socket.id] = socket;
  console.log("Total clients connected : ", Object.keys(sockets).length);
 
  socket.on('disconnect', function() {
    delete sockets[socket.id];
 
    // no more sockets, kill the stream
    if (Object.keys(sockets).length == 0) {
    //   app.set('watchingFile', false);
    //   if (proc) proc.kill();
    //   fs.unwatchFile('./stream/image_stream.jpg');
    }
  });
 

  //startStreaming(io);

 
});

function stopStreaming() {
    if (Object.keys(sockets).length == 0) {
      app.set('watchingFile', false);
      if (proc) proc.kill();
      fs.unwatchFile('./stream/image_stream.jpg');
    }
  }

function startStreaming(io) {
 
    if (app.get('watchingFile')) {
      io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
      return;
    }
   
    var args = ["-w", "640", "-h", "480", "-o", "./stream/image_stream.jpg", "-t", "999999999", "-tl", "100"];
    proc = spawn('raspistill', args);
   
    console.log('Watching for changes...');
   
    app.set('watchingFile', true);
   
    fs.watchFile('./stream/image_stream.jpg', function(current, previous) {
      io.sockets.emit('liveStream', 'image_stream.jpg?_t=' + (Math.random() * 100000));
    })
   
  }