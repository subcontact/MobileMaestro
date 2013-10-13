define(['angular', '_'], function(angular, _) {
    function dialogDirective() {

        function directiveLink(scope, element, attr) {

       		 var blocker = angular.element(".md-blocker");
       		 var content = element.find("div");

        	scope.$watch('dialogState', function(value, oldValue) {

        		if (value === oldValue) {return}

				_.forOwn(scope.dialogStateList, function(value) {

					content.removeClass(value);
				});

        		if (value) {
			        content.addClass(value);
			        element.addClass("md-show");
			        blocker.addClass("md-show");

        		} else {

			        element.removeClass("md-show");
			        blocker.removeClass("md-show");
        		}
        	});
        }
        return {
            restrict: 'E',
            scope: {
            	dialogState : "=",
            	dialogStateList : "="
            },
            link: directiveLink
        };
    }
    var module = angular.module('directives', []);    
	module.directive('dialog', dialogDirective);
});
