var jobFormController = function jobFormController($scope, $log, jobFormService /*, $dialog */) {

    var formStateEnum = {
    
        'init'              : 0,
        'ready'             : 1,
        'edit'              : 2,
        'saving'            : 3,
        'saving_success'    : 4,
        'saving_failed'     : 5,
        'cancelling'        : 6
    };
    var formStateList = [
    
        'init',
        'ready',
        'edit',
        'saving',
        'saving_success',
        'saving_failed',
        'cancelling'
    ];
    var formState = formStateEnum.init;
    var jobFormModel = jobFormService.getJobFormModel();
    
    _.assign($scope, jobFormModel);
    $scope.formState = formState;
    $scope.formStateList = formStateList;
    $scope.formStateEnum = formStateEnum;

    var formSaveHandler = function formSaveHandler() {

        $scope.formState = formStateEnum.saving;

        $log.log('save command fired');
        $log.log('state - saving');

        $scope.openLoginDialog();
    };

    var formCancelHandler = function formCancelHandler() {

        $scope.formState = formStateEnum.cancelling;

        $log.log('cancel command fired');
        $log.log('state - cancelling');
    };

    $scope.formSaveHandler = formSaveHandler;
    $scope.formCancelHandler = formCancelHandler;


    // Login form dialog stuff
    var loginDialog = null;
    function openLoginDialog() {
    
        if ( loginDialog ) {
            throw new Error('Trying to open a dialog that is already open!');
        }
        ////loginDialog = $dialog.dialog();
        //loginDialog.open('/js/ngapp/security/login/form.tpl.html', 'jobFormController').then(onLoginDialogClose);
    }
    
    function closeLoginDialog(success) {
    
        if (loginDialog) {
            loginDialog.close(success);
        }
    }

    function onLoginDialogClose(success) {
    
        loginDialog = null;
        if ( success ) {
    
            //queue.retryAll();
        } else {
    
            //queue.cancelAll();
            //redirect();
        }
    }

    $scope.openLoginDialog = openLoginDialog;
    $scope.closeLoginDialog = closeLoginDialog;

};

var c = angular.module('ngapp.controllers', []);

c.controller('jobFormController', jobFormController);
