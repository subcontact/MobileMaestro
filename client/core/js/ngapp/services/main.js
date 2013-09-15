
function socketService($log) {

    this.socket = io.connect();
}

socketService.prototype.on = function(eventName, callback) {

    var that = this;
    this.socket.on(eventName, function() {

        if (callback) {
            callback.apply(that.socket, arguments);
        }
    });
};

socketService.prototype.emit = function(eventName, data, callback) {

    var that = this;
    this.socket.emit(eventName, data, function() {

        if (callback) {
            callback.apply(that.socket, arguments);
        }
    });
};

function dashboardService($log) {

    this.socket = io.connect('/dashboard');
}

dashboardService.prototype.on = function(eventName, callback) {

    var that = this;
    this.socket.on(eventName, function() {

        if (callback) {
            callback.apply(that.socket, arguments);
        }
    });
};

dashboardService.prototype.emit = function(eventName, data, callback) {

    var that = this;
    this.socket.emit(eventName, data, function() {

        if (callback) {
            callback.apply(that.socket, arguments);
        }
    });
};

var s = angular.module('ngapp.services', []);
s.service('socketService', socketService);
s.service('dashboardService', dashboardService);
