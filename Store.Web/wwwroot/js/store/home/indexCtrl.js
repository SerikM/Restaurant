(function (app) {

    function indexCtrl($scope, apiService, notificationService) {

        $scope.slides = [];
               
        function slidesLoadCompleted(result)
        {
            $scope.slides = result.data;
        };
        function slidesLoadFailed(response)
        {
            notificationService.displayError(response.data);
        };
        function loadCarousel()
        {
            apiService.get('/api/Home/GetSlides/', null,
                slidesLoadCompleted,
                slidesLoadFailed);
        };
        function initScroller()
        {
            $(function () {

                $scope.$scroller1 = $('#goToCarousel').on('click', function (e) {
                    e.preventDefault();
                    var id = $(this).data('target');
                    $('html, body').animate({ scrollTop: ($('#' + id).offset().top) - 70 }, 500, 'linear');
                });


                $scope.$scroller2 = $("#back-top").on("click", function (i) {
                    i.preventDefault();
                    $("body, html").animate({ scrollTop: 0 }, 800);
                });


                $scope.$scrollerShower = $(window).scroll(function () {
                    $(this).scrollTop() > 300 ? $('#back-top').addClass('cd-is-visible') :
                        $('#back-top').removeClass("cd-is-visible cd-fade-out");
                    $(this).scrollTop() > 1200 && $("#back-top").addClass("cd-fade-out");
                });

            });
        };
        function showAddressPopup() {

            //var myLatLng = { lat: -33.878500, lng: 151.215100 };
            var myLatLng = { lat: -33.878000, lng: 151.215000 };
            var mapCanvas = document.getElementById('mapMain');
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


            google.maps.event.addListenerOnce(map, 'idle', function () {
                google.maps.event.trigger(map, 'resize');
            });
        }
        window.scroll(0, 0);
        loadCarousel();
        initScroller();
        showAddressPopup();
    };

    app.controller('indexCtrl', indexCtrl);
    indexCtrl.$inject = ['$scope', 'apiService', 'notificationService'];



})(angular.module('store'));

