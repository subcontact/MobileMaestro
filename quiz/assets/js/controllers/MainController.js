define(['angular'], function(angular){
	function MainController($scope, $log){
	}

	angular.extend(MainController, {
		$inject : ['$scope', '$log']
	});

	$scope.setChoice = function(choice) {

		alert('test');
		$log.log('choice made');
		$log.log(choice);
		console.log('asdf');
	}
	return angular.module('MainController').controller('MainController', MainController);
});