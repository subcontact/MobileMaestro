

require.config({
	baseUrl : "assets/js",
	paths : {
		"angular" : "../lib/angular-1.0.8/angular.min",
		"impress" : "../lib/impressjs/js/impress",
		"jquery" : "../lib/jquery/jquery-2.0.3.min",
		"emitter" : "../lib/eventemitter2/eventemitter2"
	},
	shim : {
		"angular" : {
			exports : "angular",
			deps : ["jquery"]
		},
		"impress" : {
			exports : "impress"
		}
	}
});

/*
window.name = "NG_DEFER_BOOTSTRAP!";

require(['angular', 'app'], function(angular, app){
	'use strict';
	var $html = angular.element('html');

	angular.element().ready(function() {
		angular.bootstrap($html, [app['name']]);
		angular.resumeBootstrap();
	});
});
*/