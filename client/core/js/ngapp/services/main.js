//--------------------------------------------------------------------------------------------------------------------
function socketService($log) {

    this.socket = io.connect();
}
//--------------------------------------------------------------------------------------------------------------------
socketService.prototype.on = function(eventName, callback) {

    var that = this;
    this.socket.on(eventName, function() {

        if (callback) {
            callback.apply(that.socket, arguments);
        }
    });
};
//--------------------------------------------------------------------------------------------------------------------
socketService.prototype.emit = function(eventName, data, callback) {

    var that = this;
    this.socket.emit(eventName, data, function() {

        if (callback) {
            callback.apply(that.socket, arguments);
        }
    });
};
//--------------------------------------------------------------------------------------------------------------------
var dashboardService = function($log, $q, $rootScope) {

    var self = this;
    var socket = io.connect('/dashboard');

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
//--------------------------------------------------------------------------------------------------------------------

//--------------------------------------------------------------------------------------------------------------------
var s = angular.module('ngapp.services', []);
s.service('socketService', socketService);
s.service('dashboardService', dashboardService);
