(function (app) {
    'use strict';

    function bottomBar() {

        return {
            restrict: 'E',
            replace: true,
            templateUrl: '/js/store/layouts/bottomBar.html',
            link: function ($scope, element, attrs)
            {
                $scope.showAddressPopup = function () {

                    //var myLatLng = { lat: -33.878500, lng: 151.215100 };
                    var myLatLng = { lat: -33.878000, lng: 151.215000 };
                    var mapCanvas = document.getElementById('map');
                    var mapOptions = {
                        center: myLatLng,
                        zoom: 16,
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    }
                    var map = new google.maps.Map(mapCanvas, mapOptions);

                    var marker = new google.maps.Marker({
                        position: myLatLng,
                        map: map,
                        animation: google.maps.Animation.BOUNCE,
                        title: 'Rumpus Room'
                    });

                    $("#mapModal").modal();

                    google.maps.event.addListenerOnce(map, 'idle', function () {
                        google.maps.event.trigger(map, 'resize');
                    });
                }
            }
        };
    };

    app.directive('bottomBar', bottomBar);
})(angular.module('common.ui'));



