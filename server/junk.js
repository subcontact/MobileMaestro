
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


var baseConnHandler = function(channel) {

    return function (socket) {

    var init = function() {

        if (meta[channel][socket.id]) {

            console.log('ERROR hey id already exists!');
            return;
        }

        meta[channel][socket.id] = {

            '_id'       : socket.id,
            '_start'    : Date.now(),
            '_channel'  : channel
        };

        mediator.emit("client:joined", meta[channel][socket.id]);
    };

    init();

    socket.on('disconnect', function () {

        if (! meta[channel][socket.id]) {

            console.log('ERROR  id does not exist!');
            return;
        }

        mediator.emit("client:left", delete meta[channel][socket.id]);

        //console.log(meta[channel][socket.id]);
        //delete meta[channel][socket.id];
        //console.log(Object.keys(meta[channel]).length);

        //playfield.woosOut(socket.id);
        //delete players[socket.id];
    });

/*

    socket.on("echo", function (msg, callback) {
    	//console.log(callback);
        callback = callback || function () {};
 
        socket.emit("echo", channel + " " + msg);
 		setTimeout(function() { socket.emit("echo", channel + " " + msg); }, 3000);
 		setTimeout(function() { socket.emit("echo", channel + " " + msg); }, 5000);
        callback(null, "Done.");
    });
*/

    socket.on("__rpcRequester", function(msg, callback) {

        //console.log("__rpcRequester called ");
        //console.log(JSON.stringify(msg));
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

        var init = function() {

            if (meta[channel].hasOwnProperty(socket.id)) {

                console.log('ERROR hey id already exists!');
                return;
            }
            meta[channel][socket.id] = {

                '_id'       : socket.id,
                '_start'    : Date.now(),
                '_channel'  : channel
            };
            mediator.emit("client:joined", meta[channel][socket.id]);
        };

        init();

