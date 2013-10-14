define(['angular'], function(angular){

	function AdminMainController($scope, $timeout, $log, AdminServices){

		$scope.dialogMessage 	= '';
		$scope.dialogComment 	= '';

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

	    	console.log('appState changed : ' + value + ' ' + oldValue);
	    	//if (value !== $scope.appStateList.INIT && value === oldValue) {return}
	    	if (_.contains([$scope.appStateList.INIT, $scope.appStateList.START], value)) {
	    		$timeout(function() { // timeout to apply styles on the next cycle and give time to animate the dialog to open
					$scope.dialogMessage 	= 'Waiting To Start';
					$scope.dialogComment 	= '';
		    		$scope.dialogState 		= $scope.dialogStateList.LOCKED;
	    		})
	    	}
	    	else if (value === $scope.appStateList.RESULT) {

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

		$scope.setChoiceState = function(choice) {

			if ($scope.appState === $scope.appStateList.OPEN) {

				$scope.choiceState = choice;
			}
			else {
				console.log('ERROR - cannot set choice in current appState ' + $scope.appState);
			}
		}

		$scope.setResultState = function(result) {

			if (_.contains([$scope.appStateList.OPEN, $scope.appStateList.LOCKED, $scope.appStateList.RESULT], $scope.appState)) {

				$scope.setAppState($scope.appStateList.RESULT);
	    		//$timeout(function() { // timeout to apply styles on the next cycle and give time to animate the dialog to open
					if (result === $scope.resultStateList.CORRECT) {

						$scope.resultState 		= $scope.resultStateList.CORRECT;
						$scope.dialogMessage 	= 'Correct';
						$scope.dialogComment 	= 'Nice Work!';
					} else {
						$scope.resultState 		= $scope.resultStateList.INCORRECT;
						$scope.dialogMessage 	= 'Incorrect';
						$scope.dialogMessage 	= 'Pfft No!';
					}
				//});
			}
			else {
				console.log('ERROR - cannot set result in current appState ' + $scope.appState);
			}
		}

		$scope.lockChoice = function() {

			if ($scope.appState === $scope.appStateList.OPEN) {

				$scope.setAppState($scope.appStateList.LOCKED);
	    		//$timeout(function() { // timeout to apply styles on the next cycle and give time to animate the dialog to open
					if ($scope.choiceState === $scope.choiceStateList.NULL) {

						$scope.dialogMessage = '';
						$scope.dialogMessage = 'No Choice Made';
					}
					else {
						$scope.dialogMessage = 'Locked In';
						$scope.dialogMessage = 'You Chose ' + $scope.choiceState;
					}
				//});
			}
			else {
				console.log('ERROR - cannot set to LOCK in current appState ' + $scope.appState);
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
					$scope.setChoiceState($scope.choiceStateList.NULL);
				}, 3000);

			});
		}

		$scope.fireChoiceResponseDebug = function() {
			$scope.setResultState([$scope.resultStateList.CORRECT,$scope.resultStateList.INCORRECT][Math.round(Math.random())]);
		}

		AdminServices.bus.onNext(function(data) {
			$scope.setAppState($scope.appStateList.OPEN);
			$scope.setChoiceState($scope.choiceStateList.NULL);
		}, this);

		AdminServices.bus.onLock(function(data) {
			$scope.lockChoice();
		}, this);

		AdminServices.bus.onResult(function(data) {
			$scope.setResultState([$scope.resultStateList.CORRECT,$scope.resultStateList.INCORRECT][Math.round(Math.random())]);
		}, this);
	}

	angular.extend(AdminMainController, {
		$inject : ['$scope', '$timeout', '$log', 'AdminServices']
	});

	return angular.module('AdminMainController', []).controller('AdminMainController', AdminMainController);
});