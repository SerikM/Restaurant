(function (app) {
    'use strict';

    function apiService($http, $location, notificationService, $rootScope) {

        function get(url, config, success, failure) {

            return $http.get(url, config)
                .then(function (result) {
                    success(result);
                },
                function (error) {
                    if (error.status == '401') {
                        notificationService.displayError('Auth required');
                        $rootScope.previousState = $location.Path();
                        $location.path('/login');
                    }
                    else if (failure != null) {
                        failure(error);
                    }
                });
        };

        function post(url, data, success, failure) {

            return $http.post(url, data)
                .then(
                function (result) {
                    success(result);
                },
                function (error) {
                    if (error.status == '401') {
                        notificationService.displayError('Auth required');
                        $rootScope.previousState = $location.Path();
                        $location.path('/login');
                    }
                    else if (failure != null) {
                        failure(error);
                    }
                }
                );
        };

        var service = {
            get: get,
            post: post
        };
        return service;
    };

    apiService.$inject = ['$http', '$location', 'notificationService', '$rootScope'];

    app.factory('apiService', apiService);

})(angular.module('common.core'));