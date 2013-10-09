define(['angular', 'socketio'], function(angular, socketio){

/*
	function QuizServices() {

	}
	QuizServices.prototype.lockChoice =	function() { console.log('lockchoice')}
	QuizServices.prototype.setChoice =	function() {}
	QuizServices.prototype.result = function() {}
	QuizServices.prototype.reset = function() {} 

	//return new QuizServices();
*/
	//--------------------------------------------------------------------------------------------------------------------
	var QuizServices = function($log, $q, $rootScope) {

	    var self = this;
	    var socket = socketio.connect('/user');

	    this.bus = {

	        on : function(eventName, callback) {

	            socket.on(eventName, function() {

	                if (callback) {
	                    callback.apply(socket, arguments);
	                }
	            });
	        },

	        emit : function(eventName, data, callback) {

	            socket.emit(eventName, data, function() {

	                if (callback) {
	                    callback.apply(socket, arguments);
	                }
	            });
	        },

	        off : function(eventName, callback) {

	        },

	        offAll : function(eventName) {

	        }
	    };
	//--------------------------------------------------------------------------------------------------------------------
	    this.rpc = {

	        __rpcRequester : function(service, method, params) {

	            var deferred = $q.defer();
	            var id = '_rpc_' + method + '___' + '_response_' + new Date().getTime(); // + '___' + socket.sessionid;
	            self.bus.on(id, function(data) {
	                $rootScope.$apply(function() {

	                    deferred.resolve(data);
	                });
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

