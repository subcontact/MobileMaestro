//--------------------------------------------------------------------------------------------------------------------
function dashboard($scope, $log, dashboardService) {

	$log.log('here i am ');

	dashboardService.bus.on('ping', function() {

		$log.log("ping received from server " + Date.now());
		dashboardService.bus.emit('ping');		
	});

	dashboardService.rpc.getTime().then(function(data) {

		console.log('getTime response : ' + data);
	});

	dashboardService.rpc.echo('one two three', 'abc', 5).then(function(data) {

		console.log('echo response : ' + data);
	});

/*
	.then(function(data) {

		console.log('getTime returned ');// + data);
	});
*/
}
//--------------------------------------------------------------------------------------------------------------------
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
//--------------------------------------------------------------------------------------------------------------------
activityManager.prototype.setActivity = function(activityName) {

	if (this.currentActivity) {

		this.currentActivity.destroy();
	}

	if (activityName in this.activityList) {

		var activityDashboardContentPath = "/activities/" + activityName + "dashboard.html";
		this.currentActivity = activityName;

		// load dashboard module
		// initialise dashboard

	} else {

		console.log('unknown activity ' + activityName);
	}
}
//--------------------------------------------------------------------------------------------------------------------
activityManager.prototype.getActivity = function() {

	return this.currentActivity.currentActivity;
}
//--------------------------------------------------------------------------------------------------------------------
activityManager.prototype.start = function(activityName) {

	this.setActivity(activityName);
}
//--------------------------------------------------------------------------------------------------------------------
activityManager.prototype.stop = function() {

	if (this.currentActivity) {

		this.currentActivity.destroy();
	}
	//this.currentActivity = null;
}
//--------------------------------------------------------------------------------------------------------------------
function activity() {

}
//--------------------------------------------------------------------------------------------------------------------
activity.prototype.init = function() {

}
//--------------------------------------------------------------------------------------------------------------------
activity.prototype.destroy = function() {

}
//--------------------------------------------------------------------------------------------------------------------

function admin($scope) {

}

function client($scope) {

}


var c = angular.module('ngapp.controllers', []);
c.controller('DashboardCtrl', ['$scope', '$log', 'dashboardService', dashboard]);
c.controller('AdminCtrl', ['$scope', '$log', 'dashboardService', admin]);
c.controller('ClientCtrl', ['$scope', '$log', 'dashboardService', client]);
