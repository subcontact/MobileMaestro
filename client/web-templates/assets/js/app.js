define(["angular", "controllers/QuizMainChoiceController", "directives/overlayDirective", "services/QuizServices"], function(angular){
	return angular.module('main', ['QuizServices', 'QuizMainChoiceController','overlayDirective']).config(function($provide){
		var appWidth = angular.element(window).width();
		var appHeight = angular.element(window).height();

		$provide.constant('AppWidth', appWidth);
		$provide.constant('AppHeight', appHeight);
		//angular.element('<style></style>').text('.step {width:'+ Math.round(appWidth * 0.9) +'px;height:' + Math.round(appHeight * 0.9) +'px; }').appendTo('head');
	});
});