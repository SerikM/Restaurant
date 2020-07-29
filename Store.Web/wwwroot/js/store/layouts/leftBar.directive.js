(function (app) {
    'use strict';

    function leftBar() {
        return {
            restrict: 'E',
                replace: true,
                    templateUrl: 'js/store/layouts/leftBar.html'
        }
    };

    app.directive('leftBar', leftBar);

})(angular.module('common.ui'));


