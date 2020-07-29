﻿(function (app) {
    'use strict';

    function notificationService() {

        toastr.options = {
    
            "positionClass": "toast-top-center",           
            "closeButton": true,
            "closeEasing": 'swing',
            "progressBar": true,
            "showDuration": 300,
            "hideDuration": 1000,
            "timeOut": 5000,
            "extendedTimeOut": 1000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        function displaySuccess(message) {
            toastr.success(message);
        };

        function displayError(error) {
            if (Array.isArray(error)) {
                error.forEach(function (err) {
                    toastr.error(err);
                });
            } else {
                toastr.error(error);
            }
        };

        function displayWarning(message) {
            toastr.warning(message);
        };

        function displayInfo(message) {
            toastr.info(message);
        };
        var service = {
            displaySuccess: displaySuccess,
            displayError: displayError,
            displayWarning: displayWarning,
            displayInfo: displayInfo
        };
        return service;
    };

    app.factory('notificationService', notificationService);

})(angular.module('common.core'));