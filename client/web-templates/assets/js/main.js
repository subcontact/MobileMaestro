require.config({
	baseUrl : "assets/js",
	paths : {
		"angular" : "../lib/angular-1.0.8/angular",
		"jquery" : "../lib/jquery/jquery-2.0.3.min",
		"emitter" : "../lib/eventemitter2/eventemitter2",
		"underscore" : "../lib/underscore/underscore",
		"fastclick"	 : "../lib/fastclick/fastclick",
		"modernizr"	 : "../lib/modernizr/modernizr",
		"hammerjs"	: "../lib/hammerjs/hammerjs-1.0.5",
		"lodash"	: "../lib/lodash/lodash.2.2.1.min",
		"socketio"  : "/socket.io/socket.io.js"
	},
	shim : {
		"angular" : {
			exports : "angular",
			deps : ["jquery"]
		},
		"underscore" : {
			exports : "_"
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

		//fastclick.attach(document.body); // isn't this a little hackish?
		fastclick.attach(angular.element(document.body)[0])
	});
});