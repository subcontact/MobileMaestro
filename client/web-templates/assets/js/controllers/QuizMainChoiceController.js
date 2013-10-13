define(['angular'], function(angular){

	function QuizMainChoiceController($scope, $timeout, $log, QuizServices){

		$scope.resultMessage 	= '';
		$scope.resultComment 	= '';

	    $scope.dialogStateList = {

	    	NULL 		: null,
	        CORRECT 	: 'correct',
	        INCORRECT 	: 'incorrect',
	        LOCKED	  	: 'lockChoice'
	    };
	    $scope.dialogState = $scope.dialogStateList.NULL;

	    $scope.appStateList = {

	    	INIT	: 'INIT',
	    	START	: 'START',
	    	OPEN 	: 'OPEN',
	    	LOCKED  : 'LOCKED',
	    	RESULT 	: 'RESULT',
	    	CLOSED  : 'CLOSED',
	    	DESTROY : 'DESTROY'
	    };
	    $scope.appState = $scope.appStateList.INIT;

	    $scope.choiceStateList = {

	    	NULL 	: null,
	        A   	: 'A',
	        B   	: 'B',
	        C   	: 'C',
	        D   	: 'D'
	    };
	    $scope.choiceState = null;

	    $scope.resultStateList = {

	    	NULL 		: null,
	    	CORRECT 	: 'correct',
	    	INCORRECT 	: 'incorrect'
	    }
	    $scope.resultState = $scope.resultStateList.NULL;

	    $scope.quizProgress = {

	    	total 	: null,
	    	current : null,
	    	score	: null
	    };

	    $scope.$watch('appState', function(value, oldValue) {

	    	console.log('appState changed : ' + value);

	    	if (value === oldValue) {return}

	    	if (value === $scope.appStateList.RESULT) {

	    		$scope.dialogState = $scope.resultState;
	    	}
	    	else if (value === $scope.appStateList.LOCKED) {

	    		$scope.dialogState 	= $scope.dialogStateList.LOCKED;
	    	}
	    	else {
	    		$scope.dialogState = $scope.resultStateList.NULL;
	    	}
	    });

		$scope.setAppState = function(state) {
			$scope.appState = state;
		}

		$scope.setChoice = function(choice) {

			if ($scope.appState === $scope.appStateList.OPEN) {

				$scope.choiceState = choice;
			}
			else {
				console.log('ERROR - cannot set choice in current appState ' + $scope.appState);
			}
		}

		$scope.setResult = function(result) {

			if (_.contains([$scope.appStateList.OPEN, $scope.appStateList.LOCKED, $scope.appStateList.RESULT], $scope.appState)) {

				$scope.setAppState($scope.appStateList.RESULT);
				if (result === $scope.resultStateList.CORRECT) {

					$scope.resultState 		= $scope.resultStateList.CORRECT;
					$scope.resultMessage 	= 'Correct';
					$scope.resultComment 	= 'Nice Work!';
				} else {
					$scope.resultState 		= $scope.resultStateList.INCORRECT;
					$scope.resultMessage 	= 'Incorrect';
					$scope.resultComment 	= 'Pfft No!';
				}
			}
			else {
				console.log('ERROR - cannot set result in current appState ' + $scope.appState);
			}
		}

		$scope.lockChoice = function() {

			if ($scope.appState === $scope.appStateList.OPEN) {

				$scope.setAppState($scope.appStateList.LOCKED);
				$scope.updateResultMessages();
			}
			else {
				console.log('ERROR - cannot set to LOCK in current appState ' + $scope.appState);
			}
		};

		$scope.updateResultMessages = function() {

			if ($scope.choiceState === $scope.choiceStateList.NULL) {

				$scope.resultComment = '';
				$scope.resultMessage = 'No Choice Made';
			}
			else {
				$scope.resultComment = 'Locked In';
				$scope.resultMessage = 'You Chose ' + $scope.choiceState;
			}
		};

		$scope.unLockChoice = function() {

			if (_.contains([$scope.appStateList.LOCKED, $scope.appStateList.RESULT], $scope.appState)) {

				$scope.setAppState($scope.appStateList.OPEN);
			}
			else {
				console.log('ERROR - cannot set to UnLock in current appState ' + $scope.appState);
			}
		};

		$scope.fireLockResponseDebug = function() {

			$scope.lockChoice();
			$timeout(function() {

				$scope.fireChoiceResponseDebug();
			}, 3000).then(function() {

				$timeout(function() {

					$scope.unLockChoice();
					$scope.setChoice($scope.choiceStateList.NULL);
				}, 3000);

			});
		}

		$scope.fireChoiceResponseDebug = function() {
			$scope.setResult([$scope.resultStateList.CORRECT,$scope.resultStateList.INCORRECT][Math.round(Math.random())]);
		}

		QuizServices.bus.onNext(function(data) {
			$scope.setAppState($scope.appStateList.OPEN);
			$scope.setChoice($scope.choiceStateList.NULL);
		}, this);

		QuizServices.bus.onLock(function(data) {
			$scope.lockChoice();
		}, this);

		QuizServices.bus.onResult(function(data) {
			$scope.setResult([$scope.resultStateList.CORRECT,$scope.resultStateList.INCORRECT][Math.round(Math.random())]);
		}, this);
	}

	angular.extend(QuizMainChoiceController, {
		$inject : ['$scope', '$timeout', '$log', 'QuizServices']
	});

	return angular.module('QuizMainChoiceController', []).controller('QuizMainChoiceController', QuizMainChoiceController);
});