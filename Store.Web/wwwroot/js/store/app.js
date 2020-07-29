(function () {
   
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "js/store/home/index.html",
                controller: "indexCtrl"
            })
            .when('/menu', {
                templateUrl: 'js/store/menu/index.html',
                controller: 'menuCtrl'
            })
            .when('/whatson', {
                templateUrl: 'js/store/whatson/index.html',
                controller: 'whatsonCtrl'
            })
            .when('/admin', {
                templateUrl: 'js/store/admin/index.html',
                controller:'adminCtrl'
            })
            .when('/bookings', {
                templateUrl: 'js/store/bookings/index.html',
                controller: 'bookingsCtrl'
            })
            .when('/admin/carousel', {
                templateUrl: 'js/store/admin/carousel/index.html',
                controller: 'carouselAdminCtrl'
            })
            .when('/admin/whatson', {
                templateUrl: 'js/store/admin/whatson/index.html',
                controller: 'whatsonAdminCtrl'
            })
            .when('/admin/menu', {
                templateUrl: 'js/store/admin/menu/index.html',
                controller: 'menuAdminCtrl'
            })
            .otherwise({ redirectTo: "/" });

        $locationProvider.html5Mode({ enabled: true });
    };

    config.$inject = ['$routeProvider', '$locationProvider'];
    angular
        .module('store', ['common.core', 'common.ui', 'hm.reservation'])
        .config(config);
})();
