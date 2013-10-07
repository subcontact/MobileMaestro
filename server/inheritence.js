/*
// Create a base class to sub-class.

        if (meta[channel][socket.id]) {

            console.log('ERROR hey id already exists!');
            return;
        }

        meta[channel][socket.id] = {

            '_id'    : socket.id,
            '_start' : Date.now(),
        };

        console.log("client joined! ");
        console.log(meta[channel][socket.id]);
        console.log(Object.keys(meta[channel]).length);

        mediator.emit("client:joined", meta[channel][socket.id]);

*/


var Mediator = require("mediator-js").Mediator,
    mediator = new Mediator();


function BaseConnHandler(socket) {

	this.meta = {

        '_id'    : socket.id,
        '_start' : Date.now(),
    };

}

BaseConnHandler.prototype.notifyJoined = function() {

	mediator.emit("client:joined", this);
};
 
 
// Create sub-class and extend base class.
UserHandler.prototype 			  = Object.create(BaseConnHandler.prototype);
UserHandler.prototype.constructor = UserHandler;
//_.extend(UserHandler.prototype, OtherSuperClass.prototype); //mixin

function UserHandler(socket) {

	// Call super constructor.
	BaseConnHandler.call(this, socket);
	this.channelId = 'user';

	this.notifyJoined();
}

DashboardHandler.prototype 			  = Object.create(BaseConnHandler.prototype);
DashboardHandler.prototype.constructor = DashboardHandler;
function DashboardHandler(socket) {

	// Call super constructor.
	BaseConnHandler.call(this, socket);
	this.channelId = 'dashboard';

	this.notifyJoined();
}
 

mediator.on("client:joined", function(data) {

	console.log("client:joined");
	console.log(JSON.stringify(data));
})

var user1 = new UserHandler({id:1});
var user2 = new UserHandler({id:2});
var dash1 = new DashboardHandler({id:3});

/* 
// Create two instances of sub-class.
objA = new SubClass( "ObjA" );
objB = new SubClass( "ObjB" );
 
// Update the simple property in the base class.
//bjA.SimpleProperty = "SimpleA";
objB.SimpleProperty = "SimpleB";
 
// Update key in complex property in the base class.
objA.ComplexProperty.AKey = "FromA";
objB.ComplexProperty.BKey = "FromB";
 
// Log updated property profiles.
console.log( JSON.stringify(objA) );
console.log( JSON.stringify(objB) );
*/
/*
//Shape - superclass
function Shape(x,y) {
  this.x = x;
  this.y = y;
}

//superclass method
Shape.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    console.info("Shape moved." + this.x + this.y);
};

// Rectangle - subclass
function Rectangle(x,y) {
  Shape.call(this,x,y); //call super constructor.
}

//subclass extends superclass
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

var rect = new Rectangle(5,5);

rect instanceof Rectangle //true.
rect instanceof Shape //true.

rect.move(1, 1); //Outputs, "Shape moved."
*/