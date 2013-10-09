

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
            '_end'      : null,
            '_channel'  : channel,
            '_name'      : socket.id,
            '_modules'  : {

                'pong'  : {

                    'paddleDirection' : null
                },
                'quiz'  : {

                    'choice' : null
                }
            }
        };
        mediator.emit("client:joined", meta[channel].clients[socket.id]);

        socket.on('disconnect', function () {

            if (! (meta[channel].clients.hasOwnProperty(socket.id))) {

                console.log('ERROR  id does not exist!');
                return;
            }
            meta[channel].clients[socket.id]._end = Date.now();
            var client = _.cloneDeep(meta[channel].clients[socket.id]);
            delete meta[channel].clients[socket.id];
            mediator.emit("client:left", client);
        });

        socket.on('ping', function () {

            console.log('ping received from client  ' + socket.id + " " + Date.now());
        });
        socket.on('quiz:user:setChoice', function (data) {

            console.log('quiz:user:setChoice received from user  ' + socket.id + " " + Date.now());
            console.log(data.choice);

            setTimeout(function() {

                socket.emit('quiz:server:lockChoice');
            }, 3000);

            setTimeout(function() {

//                socket.emit('quiz:server:unlockChoice');
                socket.emit('quiz:server:answer', {answer:'B'});
            }, 6000);
        });

        socket.on("__rpcRequester", function(msg, callback) {

            var responseData = "";

            switch (msg.method) {

                case 'getTime':
                    responseData = Date.now();
                break;

                case 'echo':
                    responseData = msg.params;
                break;

                case 'setName':
                    meta[channel].clients[socket.id]._name = msg.params;
                    responseData = true;
                    mediator.emit("client:change:name", meta[channel].clients[socket.id]);
                break;
            }
            socket.emit(msg.id, responseData);            
        });

        socket.on("client:module:msg", function(data) {

            mediator.emit("client:module:msg", { id: socket.id, data : data });
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

mediator.on("client:change:name", function(data) {

    console.log(">> EVENT client:change:name");
    console.log(JSON.stringify(data));
})

mediator.on("client:module:msg", function(data) {

    console.log(">> EVENT client:module:msg");
    console.log(JSON.stringify(data));
})


process.on('uncaughtException', function (err) {
    console.log('uncaught error' + err);
});

// serve up static content images, css etc...
app.use(express.static(__dirname + '/../client'));
console.log(__dirname + '/../client');
