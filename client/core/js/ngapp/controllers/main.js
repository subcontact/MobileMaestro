
function dashboard($scope, $log, dashboardService) {

	$log.log('here i am ');

	dashboardService.on('echo', function(msg) {

		$log.log("dashboard echo message received: " + msg);
	})

	dashboardService.emit('echo', "Dashboard Hello World");
}

function admin($scope) {

}

function client($scope) {

}


var c = angular.module('ngapp.controllers', []);
c.controller('DashboardCtrl', ['$scope', '$log', 'dashboardService', dashboard]);
c.controller('AdminCtrl', ['$scope', '$log', 'dashboardService', admin]);
c.controller('ClientCtrl', ['$scope', '$log', 'dashboardService', client]);
