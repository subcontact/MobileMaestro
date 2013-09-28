

var port    = process.env.PORT || 8080;
var express = require("express");
var app     = express(); 
var io      = require('socket.io').listen(app.listen(port));

var _        = require("lodash");
var Mediator = require("mediator-js").Mediator,
    mediator = new Mediator();


console.log("Server listening on port %d", port);


io.set('log level', 0); // turn logging down
io.enable('browser client minification'); // send minified client
io.enable('browser client etag'); // apply etag caching logic based on version number
io.enable('browser client gzip'); // gzip the file

var baseConnHandler = function(channel) {

    var handler = function (socket) {

        if (meta[channel].clients.hasOwnProperty(socket.id)) {

            console.log('ERROR hey id already exists!');
            return;
        }
        meta[channel].clients[socket.id] = {

            '_id'       : socket.id,
            '_start'    : Date.now(),
            '_channel'  : channel,
            '_name'      : socket.id,
            '_modules'  : {

                'pong'  : {

                    'paddleDirection' : 'up'
                }
            }
        };
        mediator.emit("client:joined", meta[channel].clients[socket.id]);

        socket.on('disconnect', function () {

            if (! (meta[channel].clients.hasOwnProperty(socket.id))) {

                console.log('ERROR  id does not exist!');
                return;
            }
            mediator.emit("client:left", delete meta[channel].clients[socket.id]);
        });

        socket.on('ping', function () {

            console.log('ping received from client  ' + socket.id + " " + Date.now());
        });

        socket.on("__rpcRequester", function(msg, callback) {

            var responseData = "";

            switch (msg.method) {

                case 'getTime':
                    responseData = Date.now();
                break;

                case 'echo':
                    responseData = msg.params;

                case 'setName':
                    meta[channel].clients[socket.id]._name = msg;
            }
            socket.emit(msg.id, responseData);            
        });
/*
        meta[channel].clients[socket.id].pingTimer = setInterval(function() {

            socket.emit("ping");

        }, 10000);
*/        
    };
    return handler;
};

var userConnHandler         = baseConnHandler('user');
var dashboardConnHandler    = baseConnHandler('dashboard');
var consoleConnHandler      = baseConnHandler('console');

var meta = {

    user : {

        clients : {},
//        timers  : {},
        socket  : io.of('/user').on('connection', userConnHandler)
    },
    dashboard : {

        clients : {},
//        timers  : {},
        socket  : io.of('/dashboard').on('connection', dashboardConnHandler)
    },
    console : {

        clients : {},
//        timers  : {},
        socket  : io.of('/console').on('connection', consoleConnHandler)
    }
};

mediator.on("client:joined", function(data) {

    console.log(">> EVENT client:joined");
    console.log(JSON.stringify(data));
    console.log(data._channel + " clients # " + Object.keys(meta[data._channel].clients).length + "\n");
})

mediator.on("client:left", function(data) {

    console.log(">> EVENT client:left");
    console.log(JSON.stringify(data));
    console.log(data._channel + " clients # " + Object.keys(meta[data._channel].clients).length + "\n");
})


process.on('uncaughtException', function (err) {
    console.log('uncaught error' + err);
});

// serve up static content images, css etc...
app.use(express.static(__dirname + '/../client'));
console.log(__dirname + '/../client');
