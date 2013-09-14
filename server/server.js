

var port    = process.env.PORT || 8080;
var express = require("express");
var app     = express(); 
var io      = require('socket.io').listen(app.listen(port));

console.log("Server listening on port %d", port);


io.set('log level', 0); // turn logging down
io.enable('browser client minification'); // send minified client
io.enable('browser client etag'); // apply etag caching logic based on version number
io.enable('browser client gzip'); // gzip the file

io.sockets.on("connection", function (socket) {
    socket.on("echo", function (msg, callback) {
    	console.log(callback);
        callback = callback || function () {};
 
        socket.emit("echo", msg);
 
        callback(null, "Done.");
    });
});

process.on('uncaughtException', function (err) {
    console.log('uncaught error' + err);
});

// serve up static content images, css etc...
app.use(express.static(__dirname + '/../client'));
console.log(__dirname + '/../client');
