var c = angular.module('ngapp.controllers', []);

function dashboard($scope) {

}
c.controller('DashboardCtrl', ['$scope', dashboard]);

function admin($scope) {

}
c.controller('AdminCtrl', ['$scope', admin]);

function client($scope) {

}
c.controller('ClientCtrl', ['$scope', client]);
