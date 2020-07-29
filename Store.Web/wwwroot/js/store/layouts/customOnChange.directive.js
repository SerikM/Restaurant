(function (app) {
    'use strict';
    function customOnChange() {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                var onChangeHandler = scope.$eval(attrs.customOnChange);
                element.on('change', onChangeHandler);
                element.on('$destroy', function () {
                    element.off();
                });
                
            }
        };
    };
    app.directive('customOnChange', customOnChange);
})(angular.module('common.ui'));
