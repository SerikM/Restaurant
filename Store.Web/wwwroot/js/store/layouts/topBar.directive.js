(function (app) {
    'use strict';

    function topBar() {
        return {
            restrict: 'E',
            link: function ($scope, $element, $attrs)
            {
                $scope.currentNavItem = 'home';
                $(function ()
                {
                    $('.mobile-navbar').mouseleave(function ()
                    {
                        var drDown = $('.navbar-collapse');
                        if (drDown.hasClass('in'))
                        {
                            $('button.navbar-toggle').click();
                        }
                     
                    });
                });
            },
            replace: true,
            templateUrl: 'js/store/layouts/topBar.html'
        }
    };
    app.directive('topBar', topBar);

    app.config(function ($mdThemingProvider) {
        $mdThemingProvider.theme('docs-dark', 'default')
            .primaryPalette('grey')
            .warnPalette('red')
            .accentPalette('blue')
            .dark();
    });

})(angular.module('common.ui'));

