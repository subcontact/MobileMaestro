// App services
var appServices = angular.module('appServices', []);

  appServices.factory('User', function($rootScope, $http) {
    var userBeingEdited = null;
    var userList = [
      { _id: 125 , username: 'Tom'    },
      { _id: 224 , username: 'Dick'   },
      { _id: 314 , username: 'Harry'  },
      { _id: 451 , username: 'Bob'    },
      { _id: 515 , username: 'George' },
      { _id: 653 , username: 'Sally'  }
    ];
    
    return {
      editUser:
      function(id) {
        if (id == 'new') {
          userBeingEdited = null;
        }
        else {
          userBeingEdited = id;
        }
        $rootScope.$broadcast('user:edit');
      },
      getEditUser:
      function() {
        if (userBeingEdited) {
          for (i in userList) {
            if (userList[i]._id == userBeingEdited) {
              return userList[i];
            }
          }
        }
        else {
          return {};
        }
      },
      getUserList:
      function() {
        return userList;
      }
    };
  });

  appServices.factory('Lists', function($rootScope, $http) {


    function successCallback() {

      console.log('lookup data success');

    }

    function failuareCallback() {

    }

    $http.get('/lookupLists.json').success(successCallback);


    var userBeingEdited = null;
    var userList = [
      { _id: 125 , username: 'Tom'    },
      { _id: 224 , username: 'Dick'   },
      { _id: 314 , username: 'Harry'  },
      { _id: 451 , username: 'Bob'    },
      { _id: 515 , username: 'George' },
      { _id: 653 , username: 'Sally'  }
    ];
    
    return {
      editUser:
      function(id) {
        if (id == 'new') {
          userBeingEdited = null;
        }
        else {
          userBeingEdited = id;
        }
        $rootScope.$broadcast('user:edit');
      },
      getEditUser:
      function() {
        if (userBeingEdited) {
          for (i in userList) {
            if (userList[i]._id == userBeingEdited) {
              return userList[i];
            }
          }
        }
        else {
          return {};
        }
      },
      getUserList:
      function() {
        return userList;
      }
    };
  });

// App
var myApp = angular.module('myApp', ['appServices','$strap.directives']);

myApp.controller('Main', function($scope, $modal, User, $http) {

  $scope.modal = {content: 'Hello Modal', saved: false};

  $scope.viaService = function() {
    // do something
    var modal = $modal({
      template: 'partials/modal.html',
      show: true,
      backdrop: 'static',
      scope: $scope
    });
  }
  $scope.parentController = function(dismiss) {
    console.warn(arguments);
    // do something
    dismiss();
  }
});

/*
.
  config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home.html',
         controller: IndexController
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
*/

// Controllers
function IndexController($scope, $http, User, $modal) {
  $scope.user = User;
  $scope.userList = User.getUserList();
  
  $scope.editUser = function(uid) {
    $scope.user.editUser(uid);
  };


}

function UserEditModalController($scope, $rootScope, $http, User) {
  $scope.user = User;
  $scope.newUser = false;
  $scope.uid = '';
  $scope.username = '';
  $scope.pw1 = '';
  $scope.pw2 = '';
  $scope.pwError = false;
  $scope.incomplete = false;
  
  $rootScope.$on('user:edit', function() {
    var editUser = User.getEditUser();
    if (editUser._id) {
       $scope.newUser = false;
           $scope.uid = editUser._id;
      $scope.username = editUser.username;
    }
    else {
         $scope.newUser = true;
      $scope.incomplete = true;
             $scope.uid = '';
        $scope.username = '';
    }
  });
  
  $scope.$watch('pw1', function() {
    if ($scope.pw1 !== $scope.pw2) {
      $scope.pwError = true;
    }
    else {
      $scope.pwError = false;
    }
    $scope.incompleteTest();
  });
  $scope.$watch('pw2', function() {
    if ($scope.pw1 !== $scope.pw2) {
      $scope.pwError = true;
    }
    else {
      $scope.pwError = false;
    }
    $scope.incompleteTest();
  });
  $scope.$watch('username', function() {
    $scope.incompleteTest();
  });
  
  $scope.incompleteTest = function() {
    if ($scope.newUser) {
      if (!$scope.username.length ||
          !$scope.pw1.length ||
          !$scope.pw2.length         ) {
      
        $scope.incomplete = true;
      }
      else {
        $scope.incomplete = false;
      }
    }
    else {
      $scope.incomplete = false;
    }
  };
}