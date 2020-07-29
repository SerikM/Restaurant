(function (app) {
    'use strict';
    function adminCtrl($scope, $timeout, apiService, notificationService) {
        window.scroll(0, 0);
    }
      

    app.controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$scope', '$timeout', 'apiService', 'notificationService'];

})(angular.module('store'));






