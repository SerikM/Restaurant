(function (app) {
    'use strict';

       function usSpinner($http, $rootScope) {
            return {
                link: function (scope, elm, attrs) {
                    $rootScope.spinnerActive = false;
                    scope.isSpinning = function () {
                        return $http.pendingRequests.length > 0;
                    };

                    scope.$watch(scope.isSpinning, function (spinning) {
                        $rootScope.spinnerActive = spinning;
                        if (spinning) {
                            elm.removeClass('ng-hide');
                        } else {
                            elm.addClass('ng-hide');
                        }
                    });
                }
            };

    };
    
    app.directive('usSpinner', usSpinner);
    usSpinner.$inject = ['$http', '$rootScope'];

})(angular.module('common.ui'));
