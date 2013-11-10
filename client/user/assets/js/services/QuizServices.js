define(['angular', 'socketio'], function(angular, socketio){
	//--------------------------------------------------------------------------------------------------------------------
	var QuizServices = function($log, $q, $rootScope) {

	    var self = this;
	    var socket = socketio.connect('/user');

	    this.bus = {

	        on : function(eventName, callback) {
	            socket.on(eventName, function(data) {
					$rootScope.$apply(function() {
		                if (callback) {
		                    callback.call(socket, data);
		                }
		            });
	            });
	        },

	        once : function(eventName, callback) {
	            socket.once(eventName, function(data) {
					$rootScope.$apply(function() {
		                if (callback) {
		                    callback.call(socket, data);
		                }
		            });
	            });
	        },

	        emit : function(eventName, data, callback) {
	            socket.emit(eventName, data, function(data) {
					$rootScope.$apply(function() {
		                if (callback) {
		                    callback.call(socket, data);
		                }
		            });
	            });
	        },

	        off : function(eventName) {
		        socket.removeListener(eventName);
	        },

	//--------------------------------------------------------------------------------------------------------------------
			onResult : function(callback, context) {
			    self.bus.on('quiz:server:result', function(data) {
	                if (callback) {
	                    callback.call(context, data);
	                }
			    });
			},
	//--------------------------------------------------------------------------------------------------------------------
			onLock : function(callback, context) {
			    self.bus.on('quiz:server:lock', function(data) {
	                if (callback) {
	                    callback.call(context, data);
	                }
			    });
			},	        
	//--------------------------------------------------------------------------------------------------------------------
			onNext : function(callback, context) {
			    self.bus.on('quiz:server:next', function(data) {
	                if (callback) {
	                    callback.call(context, data);
	                }
			    });
			},	        
	    };
	//--------------------------------------------------------------------------------------------------------------------
	    this.rpc = {

	        __rpcRequester : function(service, method, params) {

	            var deferred = $q.defer();
	            var id = '_rpc_' + method + '___' + '_response_' + new Date().getTime(); // + '___' + socket.sessionid;
	            self.bus.on(id, function(data) {
	                //$rootScope.$apply(function() {

	                    deferred.resolve(data);
	                //});
	            });
	            var data = {

	                'service': service,
	                'method' : method,
	                'params' : params,
	                'id'     : id
	            };
	            self.bus.emit('__rpcRequester', data);
	            //setTimeout(5000, function() { deferred.reject(new Error('timeout for : ' + id))});

	            return deferred.promise;
	        },
	//--------------------------------------------------------------------------------------------------------------------
	        getTime : function() {

	            var service = "dashboard";
	            var method  = "getTime";
	            var promise = self.rpc.__rpcRequester(service, method, Array.prototype.slice.call(arguments, 2));
	            return promise;
	        },
	//--------------------------------------------------------------------------------------------------------------------
	        echo : function() {

	            var service = "dashboard";
	            var method  = "echo";
	            var promise = self.rpc.__rpcRequester(service, method, Array.prototype.slice.call(arguments));
	            return promise;
	        },
	//--------------------------------------------------------------------------------------------------------------------
	        setName : function(name) {

	            var service = "dashboard";
	            var method  = "setName";
	            var promise = self.rpc.__rpcRequester(service, method, name);
	            return promise;
	        },
	    };
	}
	return angular.module('QuizServices', []).service('QuizServices', QuizServices);
});
//--------------------------------------------------------------------------------------------------------------------

