(function (app) {
    'use strict';
    function owlCarousel() {
        return {
            restrict: 'A',
            transclude: false,
            link: function ($scope, element, attributes) {
                $scope.initCarousel = function initCarousel() {
                    $(element).owlCarousel({
                        items: 3,
                        loop: true,
                        autoPlay: true,
                        dots: true,
                        margin: 10,
                        video: true,
                        center: true
                    });
                };
            }
        };
    };

    app.directive('owlCarousel', owlCarousel);

})(angular.module('common.ui'));

(function (app) {
    'use strict';
    function owlCarouselItem() {

        return {
            restrict: 'A',
            transclude: false,
            link: function ($scope, element, attributes) {
                var elm = '';
                if (attributes.videourl)
                {
                  elm = '<a class="owl-video" href="' + attributes.videourl +
                        '" ></a >';
                }
                else
                {
                    elm = '<img src="data:image/JPEG;base64,' + attributes.imagedata +
                        '" />'; 
                }
                $(element).append(elm);
                if ($scope.$last) {
                    $scope.initCarousel();
                }
              }
            
        };
    };

    app.directive('owlCarouselItem', owlCarouselItem);

})(angular.module('common.ui'));












