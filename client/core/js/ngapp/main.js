// App
var myApp = angular.module('ngapp',['ngapp.controllers', 'ngapp.services']);

/*
myApp.run(function($log, socketService) {

	$log.log('here i am ');

	socketService.on('echo', function(msg) {

		$log.log("echo message received: " + msg);
	})

	socketService.emit('echo', "Hello World");
});
*/

myApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

  $routeProvider.when('/', 			{ templateUrl: 'partials/client.html', controller: 'ClientCtrl' });
  $routeProvider.when('/admin', 	{ templateUrl: 'partials/admin.html',  controller: 'AdminCtrl' });
  $routeProvider.when('/dashboard', { templateUrl: 'partials/dashboard.html', controller: 'DashboardCtrl' });
  $routeProvider.otherwise({ redirectTo: '/' });
  //$locationProvider.html5Mode(true);
}]);
