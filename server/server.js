

var port    = process.env.PORT || 8080;
var express = require("express");
var app     = express(); 
var io      = require('socket.io').listen(app.listen(port));

console.log("Server listening on port %d", port);


io.set('log level', 0); // turn logging down
io.enable('browser client minification'); // send minified client
io.enable('browser client etag'); // apply etag caching logic based on version number
io.enable('browser client gzip'); // gzip the file
/*
io.sockets.on("connection", function (socket) {
    socket.on("echo", function (msg, callback) {
    	console.log(callback);
        callback = callback || function () {};
 
        socket.emit("echo", msg);
 		setTimeout(function() { socket.emit("echo", msg); }, 3000);
 		setTimeout(function() { socket.emit("echo", msg); }, 5000);
        callback(null, "Done.");
    });
});
*/
var connHandler = function (socket, channel) {

	console.log("client joined! " + socket.id);

    socket.on("echo", function (msg, callback) {
    	//console.log(callback);
        callback = callback || function () {};
 
        socket.emit("echo", channel + " " + msg);
 		setTimeout(function() { socket.emit("echo", channel + " " + msg); }, 3000);
 		setTimeout(function() { socket.emit("echo", channel + " " + msg); }, 5000);
        callback(null, "Done.");
    });

    socket.on("__rpcRequester", function(msg, callback) {

        console.log("__rpcRequester called ");
        console.log(JSON.stringify(msg));
        var responseData = "";

        switch (msg.method) {

            case 'getTime':
                responseData = new Date();
            break;

            case 'echo':
                responseData = msg.params;
        }
        socket.emit(msg.id, responseData);
        
    });
};

var connections = {

    client 		: io.of('/client').on('connection', 	function(socket) { connHandler(socket, 'client'); }),
    playfield 	: io.of('/dashboard').on('connection', 	function(socket) { connHandler(socket, 'dashboard'); }),
    admin 		: io.of('/admin').on('connection', 		function(socket) { connHandler(socket, 'admin'); })
}


process.on('uncaughtException', function (err) {
    console.log('uncaught error' + err);
});

// serve up static content images, css etc...
app.use(express.static(__dirname + '/../client'));
console.log(__dirname + '/../client');
