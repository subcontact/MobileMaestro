//Used to provide some debugging tools
define(['angular', 'app'], function(angular, app){
	//Rethrow exceptions so that chrome debugger will break on uncaught exceptions
	app.factory('$exceptionHandler', function(){
		return function(exception, cause){
			throw exception;
		};
	});
});