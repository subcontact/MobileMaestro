// App
var myApp = angular.module('ngapp',['ngapp.controllers', 'ngapp.services']);

myApp.run(function($log, socketFactory) {

	$log.log('here i am ');

	socketFactory.on('echo', function(msg) {

		$log.log("echo message received: " + msg);
	})

	socketFactory.emit('echo', "Hello World");
});