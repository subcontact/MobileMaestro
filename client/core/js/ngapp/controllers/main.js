
function dashboard($scope, $log, dashboardService) {

	$log.log('here i am ');

	dashboardService.on('echo', function(msg) {

		$log.log("dashboard echo message received: " + msg);
	})

	dashboardService.emit('echo', "Dashboard Hello World");

}

function activityManager() {

	this.currentActivity = null;
	this.activityList = {

		'intro' : 'intro',
		'preso' : 'preso',
		'quiz' 	: 'quiz',
		'worm'	: 'worm'
	};
	this.defaultActivity = this.activityList.intro;

}

activityManager.prototype.change = function(activityName) {

	if (this.currentActivity) {

		this.currentActivity.destroy();
	}

	if (activityName in this.activityList) {

		var activityDashboardContentPath = "/activities/" + activityName + "dashboard.html";
		// load dashboard module
		// initialise dashboard

	} else {

		console.log('unknown activity ' + activityName);
	}
}

function activity() {

}

activity.prototype.init = function() {

}

activity.prototype.destroy = function() {

}







function admin($scope) {

}

function client($scope) {

}


var c = angular.module('ngapp.controllers', []);
c.controller('DashboardCtrl', ['$scope', '$log', 'dashboardService', dashboard]);
c.controller('AdminCtrl', ['$scope', '$log', 'dashboardService', admin]);
c.controller('ClientCtrl', ['$scope', '$log', 'dashboardService', client]);
