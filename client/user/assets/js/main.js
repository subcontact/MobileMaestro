require.config({
	baseUrl : "assets/js",
	paths : {
//		"angular" : "../lib/angular-1.0.8/angular",
		"angular" : "../lib/angularjs/angular-1.2.0-rc.2",
		"jquery" : "../lib/jquery/jquery-2.0.3.min",
		"emitter" : "../lib/eventemitter2/eventemitter2",
		"fastclick"	 : "../lib/fastclick/fastclick",
		"modernizr"	 : "../lib/modernizr/modernizr",
		"hammerjs"	: "../lib/hammerjs/hammerjs-1.0.5",
		"_"			: "../lib/lodash/lodash-2.2.1.min",
		"socketio"  : "/socket.io/socket.io.js"
	},
	shim : {
		"angular" : {
			exports : "angular",
			deps : ["jquery"]
		},
		"modernizr" : {
			exports : "modernizr"
		},
		"socketio" : {
			exports : "io"
		}
	}
});

window.name = "NG_DEFER_BOOTSTRAP!";

//require 'debug' to activate debug mode
require(['angular', 'app', 'fastclick'], function(angular, app, fastclick){
	'use strict';
	var $html = angular.element('html');
	angular.element().ready(function() {
		angular.bootstrap($html, [app['name']]);
		angular.resumeBootstrap();
		// isn't this a little hackish?
		fastclick.attach(angular.element(document.body)[0])
	});
});