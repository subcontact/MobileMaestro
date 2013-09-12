var jobFormService = function jobFormService($log) {

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

    var jobFormModelEmpty = {

        jobType     : null,
        jobStatus   : null,
        startDate   : null,
        endDate     : null,
        id          : null,
        docLink     : null,
    };

    var jobFormModelDummy = {

        jobType     : "jobType",
        jobStatus   : "jobStatus",
        startDate   : "startDate",
        endDate     : "endDate",
        id          : "id",
        docLink     : "docLink",
    };

    var formSaveHandler = function formSaveHandler() {

        formState = formStateEnum.saving;

        $log.log('save command fired');
        $log.log('state - saving');
    };

    var formCancelHandler = function formCancelHandler() {

        formState = formStateEnum.cancelling;

        $log.log('cancel command fired');
        $log.log('state - cancelling');
    };

    //return {

        this.getJobFormModel = function() {

            return jobFormModelEmpty;
        };

        this.newJobModel = function() {

        };

        this.createJobModel = function() {

        };

        this.saveJobModel = function() {

        };

        this.deleteJobModel = function() {

        };

    //}

};

var s = angular.module('ngapp.services', []);

s.service('jobFormService', jobFormService);
