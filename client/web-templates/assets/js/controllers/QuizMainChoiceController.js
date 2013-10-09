define(['angular'], function(angular){


	function QuizMainChoiceController($scope, $timeout, $log, QuizServices){

		$scope.overlayShow		= null;
		$scope.resultMessage 	= '';
		$scope.resultComment 	= '';
		$scope.activeChoice 	= null;
		$scope.submissionsOpen	= true;

	    var choices = {

	        A   : 'A',
	        B   : 'B',
	        C   : 'C',
	        D   : 'D'
	    };

	    $scope.$watch('submissionsOpen', function(value) {

	    	console.log('submissionsOpen check');
	    	console.log($scope.submissionsOpen);

	    	if (value === false) {

	    		$scope.lockChoice();
	    	} else {

	    		$scope.unLockChoice();
	    	}
	    });

	    $scope.$watch('activeChoice', function(value) {

	    	console.log('activeChoice changed');
	    	console.log($scope.activeChoice);

	    	if (value !== null) {

	    		QuizServices.bus.emit('quiz:user:setChoice', { 'choice' : $scope.activeChoice});
	    	} 
	    });

	    $scope.$on('quiz:setChoice', function(event, value) {

	    	console.log('activeChoice changed');
	    	console.log($scope.activeChoice);
	    	console.log(value);

	    	if (value !== null) {

	    		QuizServices.bus.emit('quiz:user:setChoice', { 'choice' : value});
	    	} 
	    });
/*
	    $timeout(function() {

	    	$scope.submissionsOpen = false;

	    },12000)

	    $timeout(function() {

	    	$scope.submissionsOpen = true;

	    },20000)

		$timeout(function() {
			$scope.resetChoice();
		},4000);

		$timeout(function() {
			QuizServices.lockChoice();
		},3000);
*/

	QuizServices.bus.on('quiz:server:lockChoice', function() {

		$scope.$apply(function() {
			$log.log("quiz:server:lockChoice received from server " + Date.now());
			$scope.submissionsOpen = false;	
		});

	});

	QuizServices.bus.on('quiz:server:unlockChoice', function() {

		$scope.$apply(function() {
			$log.log("quiz:server:unlockChoice received from server " + Date.now());
			$scope.submissionsOpen = true;
		});	
	});

	QuizServices.bus.on('quiz:server:answer', function(data) {

		$scope.$apply(function() {
			$log.log("quiz:server:answer received from server " + Date.now());
			$scope.setResult( data.answer === $scope.activeChoice ? 'correct' : 'incorrect');
		});	
	});


	QuizServices.bus.on('ping', function() {

		$log.log("ping received from server " + Date.now());
		QuizServices.bus.emit('ping');		
	});

	QuizServices.bus.emit('ping');

	QuizServices.rpc.getTime().then(function(data) {

		console.log('getTime response : ' + data);
	});

	QuizServices.rpc.echo('one two three', 'abc', 5).then(function(data) {

		console.log('echo response : ' + data);
	});


		$scope.resetChoice = function() {

			$scope.activeChoice = null;
			$scope.$broadcast('quiz:resetChoice', $scope.activeChoice);
		}

		$scope.setResult = function(result) {

			if (result === 'correct') {

				$scope.resultMessage = 'Correct';
				$scope.resultComment = 'Nice Work!';

			} else if (result === 'incorrect') {

				$scope.resultMessage = 'Incorrect';
				$scope.resultComment = 'Pfft No!';
			}
			$scope.overlayShow = result;
		}

		$scope.lockChoice = function() {


			$scope.resultComment = 'Locked In';
			$scope.resultMessage = 'You Chose ' + $scope.activeChoice;
			$scope.overlayShow 	 = 'lockChoice';
		};

		$scope.unLockChoice = function() {

			$scope.overlayShow 	 = null;
		};

		$scope.fireChoiceResponseDebug = function() {

			$scope.setResult(['correct','incorrect'][Math.round(Math.random())]);
		}
	}

	angular.extend(QuizMainChoiceController, {
		$inject : ['$scope', '$timeout', '$log', 'QuizServices']
	});

	return angular.module('QuizMainChoiceController', []).controller('QuizMainChoiceController', QuizMainChoiceController);
});