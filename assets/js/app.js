define(["angular", "controllers/MainController", "directives"], function(angular){
	var app = angular.module('main', ["MainController", "directives"]);

	return app;
});