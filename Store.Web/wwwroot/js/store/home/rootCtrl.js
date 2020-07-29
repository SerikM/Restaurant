(function (app) {
    'use strict';
   
    // root controller will be called for any page aka base controller
    function rootCtrl($scope, $rootScope) {
        $scope.userData = {};
        $rootScope.repository = {};

      };
    
    rootCtrl.$inject = ['$scope', '$rootScope'];
    app.controller('rootCtrl', rootCtrl);
    
})(angular.module('store'));


