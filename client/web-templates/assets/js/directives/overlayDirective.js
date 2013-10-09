define(['angular'], function(angular) {
    function overlayDirective() {

	    var resultClass = {

	        CORRECT : 'correct',
	        INCORRECT : 'incorrect',
	        LOCKED	  : 'lockChoice'
	    };

        function overlayDirectiveLink($scope, $element, $attr) {

       		 var overlay = angular.element(".md-overlay");
       		 var content = $element.find("div");

        	$scope.$watch('overlayShow', function(value, oldValue) {

        		if (value) {
			        content.addClass(value);
			        $element.addClass("md-show");
			        overlay.addClass("md-show");

        		} else {

			        content.removeClass(resultClass.CORRECT);
			        content.removeClass(resultClass.INCORRECT);
			        content.removeClass(resultClass.LOCKED);
			        $element.removeClass("md-show");
			        overlay.removeClass("md-show");
        		}
        	});
        }

        return {
            restrict: 'A',
            scope: {
            	overlayShow : "="
            },
            link: overlayDirectiveLink,
        };
    }

    function choiceCommand() {

	    var choices = {

	        A   : 'A',
	        B   : 'B',
	        C   : 'C',
	        D   : 'D'
	    };
		
		var activeElement = null;

        function choiceCommandLink($scope, $element, $attr) {

        	$element.on('click', function(event) {

		        var el 		= angular.element(event.target);
		        var choice 	= el.data('choice');

		        console.log('click ! ' + choice);
		        console.log($scope.activeChoice);

		        if (($scope.activeChoice) && ($scope.activeChoice === choice)) {
		        	console.log('repeat');
		            return;
		        }
		        if (activeElement) {
		            activeElement.removeClass("activeButton");
		        }
		        activeElement = el;
		        activeElement.addClass("activeButton");
		        $scope.activeChoice = choice;

		        $scope.$emit('quiz:setChoice', choice);
        	});
/*
        	$scope.$watch('activeChoice', function(value) {

        		console.log('activeChoice changed ' + value);

		        if ((value === null) && (activeElement !== null)) {
		        	console.log('bang')
		            activeElement.removeClass("activeButton");
		            activeElement = null;
		        }
        	});
*/
        	$scope.$on('quiz:resetChoice', function(event, value){

//        		console.log('activeChoice changed ' + value);

		        if ((value === null) && (activeElement !== null)) {
//		        	console.log('bang')
		            activeElement.removeClass("activeButton");
		            activeElement = null;
		        }
        	});
        }

        return {
            restrict: 'A',
            /*
            scope: {
            	activeChoice 	: "="
            },
            */
            link: choiceCommandLink,
        };
    }

    var module = angular.module('overlayDirective', []);    
	module.directive('overlay', overlayDirective);
	module.directive('choiceCommand', choiceCommand);
});
