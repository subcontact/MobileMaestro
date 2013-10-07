
var port    = process.env.PORT || 8080;
/*
var express = require("express");
var app     = express();
var faye 	= require('faye');

app.listen(port);
var bayeux = new faye.NodeAdapter({mount:'/faye', timeout:45});
bayeux.attach(app);

app.use(express.static(__dirname));
*/

/*
var http = require('http'),
    faye = require('faye');

var bayeux = new faye.NodeAdapter({mount: '/faye', timeout: 45});
bayeux.listen(port);
*/

var faye = require('faye');
var bayeux = new faye.NodeAdapter({mount:'/faye', timeout:45});

// Launch express and server
var express = require('express');
var app = express.createServer();

bayeux.bind('subscribe', function(clientId, channel){
        console.log("client-id:" + clientId);
        console.log("channel:" + channel);

        bayeux.getClient().publish('/messages', {
            text: 'test message'
        });
});

bayeux.attach(app);

app.listen(8888);
