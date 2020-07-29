(function () {

    angular.module('common.core',
        ['ngRoute',
            'base64',
            'ngUpload',
            'ngAria',
            'ngAnimate',
            'ngMaterial',
            'ngMessages'
           ]);
})();





(function () {
    'use strict';

    angular.module('common.ui', [
        'ngMdIcons',
        'ui.bootstrap',
        'ui.bootstrap.tpls',
        'ui.bootstrap.accordion',
        'chieffancypants.loadingBar',
        'ui.bootstrap.alert',
        'ui.bootstrap.buttons',
        'ui.bootstrap.carousel',
        'ui.bootstrap.collapse',
        'ui.bootstrap.dateparser',
        'ui.bootstrap.datepicker',
        'ui.bootstrap.dropdown',
        'ui.bootstrap.modal',
        'ui.bootstrap.pagination',
        'ui.bootstrap.popover',
        'ui.bootstrap.position',
        'ui.bootstrap.progressbar',
        'ui.bootstrap.rating',
        'ui.bootstrap.stackedMap',
        'ui.bootstrap.tabs',
        'ui.bootstrap.timepicker',
        'ui.bootstrap.tooltip',
        'ui.bootstrap.typeahead',
        'angularSpinner'
    ]);

})();




(function () {
    'use strict';

    angular.module('hm.reservation', [
        'ui.bootstrap',
        'ngMessages',
        'ngNumberPicker'
    ]);
})();


(function (app) {

    function reservationConfigProvider() {

        var config = {
            getAvailableDatesAPIUrl: "/api/Booking/AvailableDates", //API url endpoint to load list of available dates
            getAvailableHoursAPIUrl: "/api/Booking/AvailableHours", //API url endpoint to load list of available hours
            reserveAPIUrl: "/api/Booking/Reserve", //API url endpoint to do a reserve
            dateFormat: "yyyy-MM-dd",
            showConfirmationModal: true,
            datepickerTemplate: "/js/store/reservation/datepicker.html",
            availableHoursTemplate: "/js/store/reservation/availableHours.html",
            noAvailableHoursTemplate: "/js/store/reservation/noAvailableHours.html",
            clientFormTemplate: "/js/store/reservation/clientForm.html",
            confirmationModalTemplate: "/js/store/reservation/confirmationModal.html",
            date: "Date",
            time: "Time",
            client: "Client",
            name: "Name",
            save: "Save",
            cancel: "Cancel",
            select: "Select",
            phone: "Phone",
            email: "Email",
            required: "This field is required",
            minLength: "Minimum length is 10 digits",
            maxLength: "Maximum length is 10 digits",
            invalidCharacters: "Not allowed characters",
            invalidPhone: "Invalid phone number",
            invalidEmail: "Invalid email address",
            invalidNumber: "Invalid number of guests",
            reserveText: "Reserve",
            confirmOK: "Yes, reserve",
            confirmCancel: "No, cancel",
            confirmTitle: "Confirm reservation",
            noAvailableHours: "There are not available hours for selected date, please select another date"

        };

        //Public API for the provider
        return ({
            $get: function () {
                return config;
            },
            set: function (values) {
                angular.extend(config, values);
            }
        });

    }
    app.provider('reservationConfig', [reservationConfigProvider]);
})(angular.module('hm.reservation'));



(function (app) {

    function reservationCtrl($scope, $filter, reservationAPIFactory, reservationConfig, reservationService) {
        //Capture the this context of the Controller using vm, standing for viewModel
        var vm = this;
        vm.selectedTab = 0;
        vm.secondTabLocked = true;
        vm.thirdTabLocked = true;
        vm.selectedDate = new Date();
        vm.selectedHour = {};
        vm.userData = {};
        vm.dateFormat = reservationConfig.dateFormat;
        vm.datepickerTemplate = reservationConfig.datepickerTemplate;
        vm.availableHoursTemplate = reservationConfig.availableHoursTemplate;
        vm.noAvailableHoursTemplate = reservationConfig.noAvailableHoursTemplate;
        vm.clientFormTemplate = reservationConfig.clientFormTemplate;
       
        vm.date = reservationConfig.date; 
        vm.time = reservationConfig.time;
        vm.client = reservationConfig.client;
        vm.name = reservationConfig.name;
        vm.save = reservationConfig.save;
        vm.cancel = reservationConfig.cancel;
        vm.select = reservationConfig.select;
        vm.phone = reservationConfig.phone;
        vm.email = reservationConfig.email;
        vm.required = reservationConfig.required;
        vm.minLength = reservationConfig.minLength;
        vm.maxLength = reservationConfig.maxLength;
        vm.invalidCharacters = reservationConfig.invalidCharacters;
        vm.invalidPhone = reservationConfig.invalidPhone;
        vm.invalidEmail = reservationConfig.invalidEmail;
        vm.invalidNumber = reservationConfig.invalidNumber;
        vm.reserveText = reservationConfig.reserveText;
        vm.confirmOK = reservationConfig.confirmOk;
        vm.confirmCancel = reservationConfig.confirmCancel;
        vm.confirmTitle = reservationConfig.confirmTitle;
        vm.confirmText = reservationConfig.confirmText;
        vm.noAvailableHours = reservationConfig.noAvailableHours;
        vm.reservationMessage = '';
        vm.availableDates = [];
        getAvailableDates();
        setBookingInput();
        //Disable not available dates in datepicker
        vm.datepickerOptions = { dateDisabled: disableDates, showWeeks: false }



        //METHODS
        vm.onSelectDate = function (date) {
            vm.selectedDate = date;
            vm.secondTabLocked = false;
            vm.selectedTab = 1;
            getAvailableHours(date);
        }

        vm.selectHour = function (hour) {
            vm.thirdTabLocked = false;
            vm.selectedHour = hour;
            vm.selectedTab = 2;
        }

        vm.reserve = function (date, hour, userData) {
            onBeforeReserve(date, hour, userData);
        }


        //PRIVATE METHODS
        function setBookingInput() {
            $scope.input = {
                num: 0
            };

            $scope.getNumber = function () {
                alert('The number is: [' + $scope.input.num + ']');
            };

            $scope.onChanged = function () {
                console.log('The number is Changed ', $scope.input.num);
            };
        }
        /**
         * Get available dates
         */
        function getAvailableDates() {
     
            reservationAPIFactory.getAvailableDates().then(function () {            
                var status = vm.availableDatesStatus = reservationAPIFactory.status;

                //Success
                if (status == '200') {
                    vm.availableDates = reservationAPIFactory.availableDates;

                    //Preselect first available date
                    if (vm.availableDates.length > 0) {
                        vm.selectedDate = new Date(vm.availableDates[0]);
                    }

                    //Error
                } else {
                    //Error get available hours callback
                   // do smth with the the status
                }
            });
        }

        /**
         * Check if a date is available <=> it is in availableDates array
         * @param date
         * @returns {boolean}
         */
        function isDateAvailable(date) {
            if (vm.availableDates.indexOf(date.toISOString().substr(0, 10)) !== -1) {
                return true;
            }

            return false;
        }

        /**
         * Function to disable all dates not in available dates list
         * @param dateAndMode
         * @returns {boolean}
         */
        function disableDates(dateAndMode) {
            var date = dateAndMode.date,
                mode = dateAndMode.mode;

            return (mode === 'day' && !isDateAvailable(date));
        }

       

        /**
         * Get available hours for a selected date
         */
        function getAvailableHours(date) {
            var selectedDateFormatted = $filter('date')(date, vm.dateFormat);
            var params = { selectedDate: selectedDateFormatted };

            reservationAPIFactory.getAvailableHours(params).then(function () {
                var status = vm.availableHoursStatus = reservationAPIFactory.status;

                //Success
                if (status == '200') {
                    vm.availableHours = reservationAPIFactory.availableHours;

                    //Error
                } else {
                    //Error get available hours callback
                    reservationService.onErrorGetAvailableHours(status, date);
                }
            });
        }

        /**
         * Function executed before reserve function
         */
        function onBeforeReserve(date, hour, userData) {
            reservationService.onBeforeReserve(date, hour, userData).then(function () {
                reserve(date, hour, userData);

            }, function () {
            });
        }

        /**
         * Do reserve POST with selectedDate, selectedHour and userData as parameters of the call
         */
        function reserve(date, hour, userData) {
            var selectedDateFormatted = $filter('date')(date, vm.dateFormat);
            var params = {
                selectedDate: selectedDateFormatted,
                selectedHour: hour,
                email: userData.email,
                phone: userData.phone,
                name: userData.name,
                quantity: userData.quantity
            };

            reservationAPIFactory.reserve(params).then(function () {
           
                var status = vm.reservationStatus = reservationAPIFactory.status;

                //Success
                if (status == '200') {
                    //Successful reserve calback
                    vm.reservationMessage = "A confirmation email has been sent to " + userData.email;

                    //Error
                } else {
                    //Error reserve callback
                    vm.reservationMessage = "Failed to process the booking. Please contact us on the phone number provided 0404 703 998.";

                }
            });
        }
    }

    app.controller('ReservationCtrl',  reservationCtrl);
    reservationCtrl.$inject = ['$scope', '$filter', 'reservationAPIFactory', 'reservationConfig', 'reservationService'];
})(angular.module('hm.reservation'));



(function (app) {
    //Directive
   app.directive('reservation', [function () {
        return {
            restrict: 'E',
            scope: {
                datepickerOptions: '='
            },
            controller: 'ReservationCtrl',
            controllerAs: 'reservationCtrl',
            templateUrl: '/js/store/reservation/index.html'
        };
    }]);

})(angular.module('hm.reservation'));



(function (app) {
    function reservationAPIFactory($http, reservationConfig) {

        var reservationAPI = {};

        // Error details
        reservationAPI.status = "";
        reservationAPI.availableHours = [];
        reservationAPI.availableDates = [];


        //METHODS

        //Call to get list of available dates
        reservationAPI.getAvailableDates = function () {
            return $http({
                method: 'GET',
                url: reservationConfig.getAvailableDatesAPIUrl,
                responseType: 'json'

            }).then(function (response) {

                reservationAPI.status = response.status;
                reservationAPI.availableDates = response.data.availableDates;

            }, function (response) {
                reservationAPI.errorManagement(response.status);
            });
        }

        //Call to get list of available hours
        reservationAPI.getAvailableHours = function (params) {
            return $http({
                method: 'GET',
                params: params,
                url: reservationConfig.getAvailableHoursAPIUrl,
                responseType: 'json'

            }).then(function (response) {
                //Success handler
                reservationAPI.status = response.status;
                reservationAPI.availableHours = response.data.availableHours;

            }, function (response) {
                reservationAPI.errorManagement(response.status);
            });
        }

        //Call to do a reserve
        reservationAPI.reserve = function (params) {
            return $http({
                method: 'POST',
                data: params,
                url: reservationConfig.reserveAPIUrl,
                responseType: 'json'

            }).then(function (response) {
                //Success handler
                reservationAPI.status = response.status;
            }, function (response) {
                reservationAPI.errorManagement(response.status);
            });
        }


        //Error management function, handles different kind of status codes
        reservationAPI.errorManagement = function (status) {
            console.log('error code ' + status);
            resetVariables();
            reservationAPI.status = "ERROR";
        }

        //Reset factory variables when an error occurred
        function resetVariables() {
            reservationAPI.status = "";
            reservationAPI.availableHours = "";
        }

        return reservationAPI;
    }
    app.factory('reservationAPIFactory', ['$http', 'reservationConfig', reservationAPIFactory]);
})(angular.module('hm.reservation'));



(function (app) {
    function reservationService($q, $filter, $uibModal, reservationConfig) {

        //Before reserve callback
        this.onBeforeReserve = function (selectedDate, selectedHour, userData) {
            var deferred = $q.defer();

            if (reservationConfig.showConfirmationModal) {
                openConfirmationModal(deferred, selectedDate, selectedHour, userData);

            } else {
                deferred.resolve();
                //deferred.reject();
            }

            return deferred.promise;
        }


        /**
         * Opens confirmation modal
         */
        function openConfirmationModal(deferred, selectedDate, selectedHour, userData) {
            var modalInstance = $uibModal.open({
                templateUrl: reservationConfig.confirmationModalTemplate,
                size: 'sm',
                controller: ['selectedDate', 'selectedHour', 'userData', confirmationModalCtrl],
                controllerAs: 'confirmationModalCtrl',
                resolve: {
                    selectedDate: function () {
                        return $filter('date')(selectedDate, reservationConfig.dateFormat);
                    },
                    selectedHour: function () {
                        return selectedHour;
                    },
                    userData: function () {
                        return userData;
                    }
                }
            });

            modalInstance.result.then(function () {
                deferred.resolve();

            }, function () {
                deferred.reject();
            })
        }

        /**
         * Controller for confirmation modal
         */
        function confirmationModalCtrl(selectedDate, selectedHour, userData) {
            var vm = this;
            vm.selectedDate = selectedDate;
            vm.selectedHour = selectedHour;
            vm.userData = userData;
            vm.confirmationParams =
                {
                    name: userData.name,
                    selectedDate: selectedDate,
                    selectedHour: selectedHour,
                    quantity: userData.quantity
                };
        }

    }
    app.service('reservationService', ['$q', '$filter', '$uibModal', 'reservationConfig', reservationService]);
})(angular.module('hm.reservation'));


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


(function (app)
{
    function whatsonCtrl($scope, apiService, notificationService)
    {
        $scope.events = [];
        $scope.current = 0;
        var numToLoad = 1;
        $scope.noMoreEventsToLoad = false;
        $scope.isLoading = false;

        function initializeLoadMoreEvents() {
            $(function ()
            {
                $(window).scroll(function ()
                {
                    if ($scope.noMoreEventsToLoad == true || $scope.isLoading == true) return;
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
                        $scope.isLoading = true;
                        loadEvents();
                      }
                });
            });
        }

        function loadEvents()
        {
            apiService.get('/api/Whatson/GetEvents/?num=' + numToLoad + '&current=' + $scope.current,
                null,
                eventsLoadCompleted,
                eventsLoadFailed);
        };

        function eventsLoadCompleted(result)
          {
              if (result.data.length > 0) {
                  $scope.events.push.apply($scope.events, result.data);
                  $scope.current += numToLoad;
              }
              else
              {
                  $scope.noMoreEventsToLoad = true;
              }
              $scope.isLoading = false;
          };

         function eventsLoadFailed(result)
          {
             notificationService.displayError('failed to load events on the page');
             $scope.isLoading = false;
          };
       

        function initEventsScroller() { 
            $(function ()
            { 
               $scope.$eventsScroller = $('#goToEvents').on('click', function (e) {
               e.preventDefault();
               var id = $(this).data('target');
               $('html, body').animate({ scrollTop: ($('#' + id).offset().top) - 70 }, 500, 'linear');
                });
            });
          };
        window.scroll(0, 0);
        initEventsScroller();
        loadEvents();
        initializeLoadMoreEvents();
    };

    app.controller('whatsonCtrl', whatsonCtrl);
    whatsonCtrl.$inject = ['$scope', 'apiService', 'notificationService'];

})(angular.module('store'));
(function (app)
{
    function menuCtrl($scope, $timeout, apiService, notificationService, $sce)
    {
        $scope.menus = [];
        $scope.downloadPdf = downloadPdf;
        var currentMenu = 0;
        var currentDish = 0;
        var numToLoad = 3;
        var isLoading = false;
        var noMoreItemsToLoad = false;


        function initializeLoadMoreMenus() {
            $(function () {
                $(window).scroll(function () {
                    if (noMoreItemsToLoad === true || isLoading === true) return;
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
                        isLoading = true;
                        loadMenus();
                    }
                });
            });
        }


        function downloadPdf(event, menu)
        {
            event.preventDefault();
            var link = document.getElementById('down-link-' + menu.ID);
            var byteString = atob(menu.PDF);
            var ab = new ArrayBuffer(byteString.length);
            var ia = new Uint8Array(ab);
            for (var i = 0; i < byteString.length; i++) {
                ia[i] = byteString.charCodeAt(i);
            }

            var file = new Blob([ab], { type: 'application/pdf' });
            var fileURL = URL.createObjectURL(file);
            fileURL = $sce.trustAsResourceUrl(fileURL);
            link.href = fileURL;
            link.download = 'Menu.pdf';
            link.click();
        }

        function loadMenus() {
            apiService.get('/api/Menu/GetMenus?num=' + numToLoad + '&currentMenu=' + currentMenu + '&currentDish=' + currentDish,
                null,
                menusLoadCompleted,
                menusLoadFailed);
        };

        function menusLoadCompleted(result) {
            if (!result.data || result.data.length === 0) {
                noMoreItemsToLoad = true;
            }
            else {
                if ($scope.menus.length <= currentMenu) {
                    $scope.menus.push.apply($scope.menus, result.data);
                }
                else {
                    $scope.menus[currentMenu].ITEMS.push
                        .apply($scope.menus[currentMenu].ITEMS,
                        result.data[result.data.length - 1].ITEMS);
                }
                if (result.data[result.data.length - 1].ITEMS.length < numToLoad) {
                    currentMenu++;
                    currentDish = 0;
                }
                else {
                    currentDish += numToLoad;
                }
            }
            isLoading = false;
        };


        function menusLoadFailed(result) {
            if (result && result.data && result.data.response) {
                notificationService.displayError(result.data.response);
            }
            else { notificationService.displayError('failed to load menu');}
            isLoading = false;
        };

        function initGoToMenu() {
            $(function () {
                $scope.$scroller = $('#goToMenu').on('click', function (e) {
                    e.preventDefault();
                    var id = $(this).data('target');
                    $('html, body').animate({ scrollTop: ($('#' + id).offset().top) - 70 }, 500, 'linear');
                });
            });
        };

        window.scroll(0, 0);
        loadMenus();
        initGoToMenu();
        initializeLoadMoreMenus();
    };

    app.controller('menuCtrl', menuCtrl);
    menuCtrl.$inject = ['$scope', '$timeout', 'apiService', 'notificationService', '$sce'];


})(angular.module('store'));






(function (app)
{
    function bookingsCtrl()
    {
        window.scroll(0, 0);
    };

    app.controller('bookingsCtrl', bookingsCtrl);

})(angular.module('store'));
(function (app) {
    'use strict';
    function adminCtrl($scope, $timeout, apiService, notificationService) {
        window.scroll(0, 0);
    }
      

    app.controller('adminCtrl', adminCtrl);
    adminCtrl.$inject = ['$scope', '$timeout', 'apiService', 'notificationService'];

})(angular.module('store'));







(function (app) {
    'use strict';
    function whatsonAdminCtrl($scope, $timeout, apiService, notificationService) {

        $scope.default64BasePlaceholder = 'iVBORw0KGgoAAAANSUhEUgAAARMAAAC4BAMAAAAyKxUSAAAAG1BMVEXMzMyWlpbFxcWqqqqcnJyjo6O+vr63t7exsbFF1ZRxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACeElEQVR4nO2Wv27bMBCHaf0fw5i2PFpJYXS02wLtKKbObgEZMlp5guoNrKQG/Ni944muEHsMl/b3DSRFEebnuxMlpQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOCf594+7lWkHUvF7e3Fmoab/Onx1V19ulzwIURW6/KsEl1X0dxs6NYvNwikkujvvykaX4lvWkWG+i/v1xSskuvno7PMrrh+CN2cArMWq1Jl0ytLVhtWSRYUj6mTD6SyIY2udsN+p/LF5YqMEkPdhAQqw8tCJaih9Fc3PIooT0Xp51sKQDIbqfCiigaRqQKp2L38YaVSikg89/MxiXVydbdyUSHLjtzSchJI5bT0UWlph/T2aA5uPtJrNdQQjdnU7DPLOrtQKkxfc8tVk8y0NkuZnBd6OVKJrNH6wGkMqJLRDlIqaqJpv52bTWaVr2GnolqtOYULFVClc9UZ84NacRakQnLd1GOVnE+/g2rrgCqxfuCuYoN7Ot6S4WyxcrZ6lda8rMiSyjyYSmRdUFR3M0wUck17n5ewyqbmpBVTFU6ldZVCB8zwuFDpSN/7qhUVSzHKTereVbMgJpGkh3qfjswME3p9XkON3rNlSJV0+NncxeKN9stlJja9P+8kKqxi4u12a83PICrtw1hpQw9yKmXblon/806lOVAZuVuhaqU/SC/PTVcqf9w3de5z5lQ4RlUZUqX5cTqdXv0u9PVylBJhD1uPVBL9/CanXygVO3y3te73+ZtO0pJQ8XaLkQrfkndCKBU9qPRyrHxuZpKVvuQ34PKviiqejHzbhnwdAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwn/EHUbRImWMB2gQAAAAASUVORK5CYII=';

        $scope.saveEventDetails = saveEventDetails;
        $scope.eventMediaUpdateCompleted = eventMediaUpdateCompleted;
        $scope.addNewImageBox = addNewImageBox;
        $scope.addNewVideoBox = addNewVideoBox;
        $scope.addNewEventBox = addNewEventBox;
        $scope.events = [];
        $scope.current = 0;
        var numToLoad = 1;
        $scope.isLoading = false;
        $scope.noMoreItemsToLoad = false;
        $scope.selectFile = selectFile;
        $scope.saveEventMedia = saveEventMedia;
        $scope.deleteMedia = deleteMedia;
        $scope.deleteEvent = deleteEvent;


        function deleteEvent(event) {
            event.preventDefault();
            var deleteId = event.target.attributes['data-target-event'].value;
            apiService.post('/api/Admin/DeleteEvent?id=' + deleteId, null,
                deleteEventSuccess, deleteEventFail);
        }

        function deleteMedia(event) {
            event.preventDefault();
            var deleteId = event.target.attributes['data-target-media'].value;
            apiService.post('/api/Admin/DeleteEventImage?id=' + deleteId, null,
                deleteMediaSuccess, deleteMediaFail);
        }

        function deleteEventSuccess(response) {
            reloadEvents($scope.current, 0);
            notificationService.displaySuccess('successfully deleted event');
        }

        function deleteEventFail(response) {
            notificationService.displayError('failed to delete event');
        }

        function deleteMediaSuccess(response) {
            reloadEvents($scope.current, 0);
            notificationService.displaySuccess('successfully deleted the media');
        }

        function deleteMediaFail(response) {
            notificationService.displayError('failed to delete the media');
        }


        function saveEventMedia(event) {
            var mediaId = event.target.attributes['data-target-media'].value;
            var uploadEl = angular.element(document.querySelector('#file-input-' + mediaId));
            var videoUrlInputEl = angular.element(document.querySelector('#video-url-input-' + mediaId));

            if ((!uploadEl || !uploadEl[0] || !uploadEl[0].value || uploadEl[0].value === '')
                && (!videoUrlInputEl || !videoUrlInputEl[0] || !videoUrlInputEl[0].value || videoUrlInputEl[0].value === '')) {
                event.preventDefault();
                notificationService.displayWarning('please select image to upload or provide video url');
                return;
            }
        }

        function setFancybox() {
            $(function ()
            { 
               $('.fancybox').fancybox({
                'padding': 0,
                'autoScale': true,
                'transitionIn': 'none',
                'transitionOut': 'none',
                'type': 'iframe',
                'scrolling': 'no',
                'iframe': {
                    preload: false,
                    scrolling: 'no'
                }
                });
            });
        }

        function selectFile(event)
        {
            if (event)
            {
                if (event.target)
                {
                    if (event.target.files)
                    {
                        if (event.target.files.length > 0)
                        {
                            var mediaId = event.target.attributes['data-target-media'].value;
                            var image = event.target.files[0];
                            var fileReader = new FileReader();
                            fileReader.onload = function (fileLoadedEvent)
                            {
                                var imageData = fileLoadedEvent.target.result;
                                for (var j = 0; j < $scope.events.length; j++)
                                {
                                    for (var i = 0; i < $scope.events[j].MEDIAS.length; i++) {
                                        if ($scope.events[j].MEDIAS[i].ID == mediaId) {
                                            $scope.events[j].MEDIAS[i].IMAGE = imageData.split(',')[1];
                                            $scope.$apply()
                                            break;
                                        }
                                    }
                                }
                            }
                            fileReader.readAsDataURL(image);
                        }
                    }
                }
            }
            
        }

        function initializeLoadMoreEvents() {
            $(function () {
                $(window).scroll(function () {
                    if ($scope.noMoreItemsToLoad == true || $scope.isLoading == true) return;
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 100)
                    {
                        $scope.isLoading = true;
                        loadEvents();
                     }
                });
            });
        }

        function addNewEventBox() {
            $scope.events.unshift(
                {
                    ID: 0,
                    NAME: '',
                    DESCRIPTION: ''
                });
        }

        function addNewImageBox(event) {
            event.MEDIAS.push({ ID: 0, IMAGE: $scope.default64BasePlaceholder, URL: '' });
        }

        function addNewVideoBox(event) {
            event.MEDIAS.push({ ID: 0, IMAGE: null, URL: 'https://www.youtube.com/watch?v=z82L0EDmbms' });
        }

        function saveEventDetails(event) {
            var data =
                {
                    ID: event.ID,
                    NAME: event.NAME,
                    DESCRIPTION: event.DESCRIPTION
                }
            apiService.post('/api/Admin/SaveEvent', data, saveEventDetailsComplete, saveEventDetailsFail);
        }

        function saveEventDetailsComplete(result) {
            reloadEvents($scope.current +1, 0);
            notificationService.displaySuccess(result.data.response);
        }

        function saveEventDetailsFail(error) {
            notificationService.displayError(error.data.response);
        }

        function eventMediaUpdateCompleted(result) {
            reloadEvents($scope.current + 1, 0);
            notificationService.displaySuccess('successfully updated event');
        };

        function reloadEvents(numToLoad, current)
        {
            apiService.get('/api/Admin/GetEvents/?num=' + numToLoad + '&current=' + current, null,
                eventsReloadCompleted,
                eventsReloadFailed);
        }

        function loadEvents() {
            apiService.get('/api/Admin/GetEvents?num=' + numToLoad + '&current=' + $scope.current, null,
                eventsLoadCompleted,
                eventsLoadFailed);
        };

        function eventsReloadCompleted(result) {
            $scope.events = result.data;
            setFancybox();
        };

        function eventsReloadFailed(result) {
            notificationService.displayError('failed to load events on the page');
        };

        function eventsLoadCompleted(result) {
            if (result.data.length > 0)
            {
                $scope.events.push.apply($scope.events, result.data);
                $scope.current += numToLoad;
            }
            else {
                $scope.noMoreItemsToLoad = true;
            }
            $scope.isLoading = false;
            setFancybox();
        };

        function eventsLoadFailed(result) {
            notificationService.displayError('failed to load events on the page');
            $scope.isLoading = false;
        };
        
        window.scroll(0, 0);
        loadEvents();
        initializeLoadMoreEvents();
    };

    app.controller('whatsonAdminCtrl', whatsonAdminCtrl);
    whatsonAdminCtrl.$inject = ['$scope', '$timeout', 'apiService', 'notificationService'];

})(angular.module('store'));







(function (app) {
    'use strict';
    function carouselAdminCtrl($scope, $timeout, apiService, notificationService) {

        $scope.default64BasePlaceholder = 'iVBORw0KGgoAAAANSUhEUgAAARMAAAC4BAMAAAAyKxUSAAAAG1BMVEXMzMyWlpbFxcWqqqqcnJyjo6O+vr63t7exsbFF1ZRxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACeElEQVR4nO2Wv27bMBCHaf0fw5i2PFpJYXS02wLtKKbObgEZMlp5guoNrKQG/Ni944muEHsMl/b3DSRFEebnuxMlpQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOCf594+7lWkHUvF7e3Fmoab/Onx1V19ulzwIURW6/KsEl1X0dxs6NYvNwikkujvvykaX4lvWkWG+i/v1xSskuvno7PMrrh+CN2cArMWq1Jl0ytLVhtWSRYUj6mTD6SyIY2udsN+p/LF5YqMEkPdhAQqw8tCJaih9Fc3PIooT0Xp51sKQDIbqfCiigaRqQKp2L38YaVSikg89/MxiXVydbdyUSHLjtzSchJI5bT0UWlph/T2aA5uPtJrNdQQjdnU7DPLOrtQKkxfc8tVk8y0NkuZnBd6OVKJrNH6wGkMqJLRDlIqaqJpv52bTWaVr2GnolqtOYULFVClc9UZ84NacRakQnLd1GOVnE+/g2rrgCqxfuCuYoN7Ot6S4WyxcrZ6lda8rMiSyjyYSmRdUFR3M0wUck17n5ewyqbmpBVTFU6ldZVCB8zwuFDpSN/7qhUVSzHKTereVbMgJpGkh3qfjswME3p9XkON3rNlSJV0+NncxeKN9stlJja9P+8kKqxi4u12a83PICrtw1hpQw9yKmXblon/806lOVAZuVuhaqU/SC/PTVcqf9w3de5z5lQ4RlUZUqX5cTqdXv0u9PVylBJhD1uPVBL9/CanXygVO3y3te73+ZtO0pJQ8XaLkQrfkndCKBU9qPRyrHxuZpKVvuQ34PKviiqejHzbhnwdAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwn/EHUbRImWMB2gQAAAAASUVORK5CYII=';

        $scope.slides = [];
        $scope.imageSaveCompleted = imageSaveCompleted;
        $scope.addNewSlideBox = addNewSlideBox;
        $scope.selectFile = selectFile;
        $scope.saveSlideImage = saveSlideImage;
        $scope.deleteSlide = deleteSlide;


        function deleteSlide(event)
        {
            event.preventDefault();
            var deleteId = event.target.attributes['data-target-slide'].value;
            apiService.post('/api/Admin/DeleteSlide?id=' + deleteId, null,
            deleteSlideSuccess, deleteSlideFail);
        }

        function deleteSlideSuccess(response)
        {
            loadSlides();
            notificationService.displaySuccess('successfully deleted the image');
        }

        function deleteSlideFail(response)
        {
            notificationService.displayError('failed to delete the image');
        }

        function saveSlideImage(event)
        {
            var imageUploadId = event.target.attributes['data-target-slide'].value;
            var uploadElement = angular.element(document.querySelector('#file-input-' + imageUploadId));
            if (!uploadElement[0].value || uploadElement[0].value === '') {
                event.preventDefault();
                notificationService.displayWarning('please select image to upload');
                return;
            }
        }

        function selectFile(event)
        {
            if (event)
            {
                if (event.target)
                {
                    if (event.target.files)
                    {
                        if (event.target.files.length > 0)
                        {
                            var slideId = event.target.attributes['data-target-slide'].value;
                            var image = event.target.files[0];
                            var fileReader = new FileReader();
                            fileReader.onload = function (fileLoadedEvent)
                            {
                                var imageData = fileLoadedEvent.target.result;
                                                       
                                for (var i = 0; i < $scope.slides.length; i++)
                                {
                                  if ($scope.slides[i].ID == slideId)
                                  {
                                      $scope.slides[i].IMAGE = imageData.split(',')[1];
                                      $scope.$apply()
                                      break;
                                  }
                                }
                            }
                            fileReader.readAsDataURL(image);
                        }
                    }
                }
            }
            
        }

        function loadSlides() {
            apiService.get('/api/Home/GetSlides/', null,
                slidesLoadCompleted,
                slidesLoadFailed);
        };

        function addNewSlideBox() {
            $scope.slides.push({ ID: 0, IMAGE: $scope.default64BasePlaceholder });
        }

        function slidesLoadCompleted(result) {
            $scope.slides = result.data;
        };

        function slidesLoadFailed(response) {
            notificationService.displayError(response.data);
        };


        function imageSaveCompleted(response) {
            loadSlides();
            notificationService.displaySuccess('successfully saved new image');
        };

        window.scroll(0, 0);
        loadSlides();
    };

    app.controller('carouselAdminCtrl', carouselAdminCtrl);
    carouselAdminCtrl.$inject = ['$scope', '$timeout', 'apiService', 'notificationService'];

})(angular.module('store'));







(function (app) {
    'use strict';
    function menuAdminCtrl($scope, $timeout, apiService, notificationService) {

        $scope.default64BasePlaceholder = 'iVBORw0KGgoAAAANSUhEUgAAARMAAAC4BAMAAAAyKxUSAAAAG1BMVEXMzMyWlpbFxcWqqqqcnJyjo6O+vr63t7exsbFF1ZRxAAAACXBIWXMAAA7EAAAOxAGVKw4bAAACeElEQVR4nO2Wv27bMBCHaf0fw5i2PFpJYXS02wLtKKbObgEZMlp5guoNrKQG/Ni944muEHsMl/b3DSRFEebnuxMlpQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOCf594+7lWkHUvF7e3Fmoab/Onx1V19ulzwIURW6/KsEl1X0dxs6NYvNwikkujvvykaX4lvWkWG+i/v1xSskuvno7PMrrh+CN2cArMWq1Jl0ytLVhtWSRYUj6mTD6SyIY2udsN+p/LF5YqMEkPdhAQqw8tCJaih9Fc3PIooT0Xp51sKQDIbqfCiigaRqQKp2L38YaVSikg89/MxiXVydbdyUSHLjtzSchJI5bT0UWlph/T2aA5uPtJrNdQQjdnU7DPLOrtQKkxfc8tVk8y0NkuZnBd6OVKJrNH6wGkMqJLRDlIqaqJpv52bTWaVr2GnolqtOYULFVClc9UZ84NacRakQnLd1GOVnE+/g2rrgCqxfuCuYoN7Ot6S4WyxcrZ6lda8rMiSyjyYSmRdUFR3M0wUck17n5ewyqbmpBVTFU6ldZVCB8zwuFDpSN/7qhUVSzHKTereVbMgJpGkh3qfjswME3p9XkON3rNlSJV0+NncxeKN9stlJja9P+8kKqxi4u12a83PICrtw1hpQw9yKmXblon/806lOVAZuVuhaqU/SC/PTVcqf9w3de5z5lQ4RlUZUqX5cTqdXv0u9PVylBJhD1uPVBL9/CanXygVO3y3te73+ZtO0pJQ8XaLkQrfkndCKBU9qPRyrHxuZpKVvuQ34PKviiqejHzbhnwdAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwn/EHUbRImWMB2gQAAAAASUVORK5CYII=';

        $scope.saveMenuDetails = saveMenuDetails;
        $scope.menus = [];
        $scope.addNewMenuBox = addNewMenuBox;
        $scope.addNewDishBox = addNewDishBox;
        $scope.saveDish = saveDish;
        $scope.dishUpdateCompleted = dishUpdateCompleted;
        $scope.selectDishImage = selectDishImage;
        $scope.selectMenuBanner = selectMenuBanner;
        $scope.selectMenuPdf = selectMenuPdf;
        $scope.deleteMenu = deleteMenu;
        $scope.deleteDish = deleteDish;
        $scope.saveMenuDetailsCompleted = saveMenuDetailsCompleted;
        var isLoading = false;
        $scope.noMoreItemsToLoad = false;
        $scope.currentMenu = 0;
        $scope.currentDish = 0;
        var numToLoad = 4;

        function initializeLoadMoreMenus() {
            $(function () {
                $(window).scroll(function () {
                    if ($scope.noMoreItemsToLoad == true || isLoading == true) return;
                    if ($(window).scrollTop() + $(window).height() > $(document).height() - 200) {
                        isLoading = true;
                        loadMenus();
                    }
                });
            });
        }

        function deleteMenu(event, menu) {
            event.preventDefault();
            apiService.post('/api/Admin/DeleteMenu?id=' + menu.ID, null,
                deleteMenuSuccess, deleteMenuFail);
        }

        function deleteMenuSuccess(result) {
            reloadMenus();
            notificationService.displaySuccess(result.data.response);
        }

        function deleteMenuFail(result) {
            notificationService.displayError(result.data.response);
        }


        function deleteDish(event, dish) {
            event.preventDefault();
            apiService.post('/api/Admin/DeleteDish?id=' + dish.ID, null,
                deleteDishSuccess, deleteDishFail);
        };

        function deleteDishSuccess(result) {
            reloadMenus();
            notificationService.displaySuccess(result.data.response);
        }

        function deleteDishFail(result) {
            notificationService.displayError(result.data.response);
        }

        function selectMenuPdf(event) {
            if (event.target.files.length > 0) {
                var itemId = event.target.attributes['data-target-item'].value;
                var pdf = event.target.files[0];
                var displayEl = angular.element(document.querySelector('#pdf-name-display-' + itemId));
                displayEl[0].appendChild(document.createTextNode(pdf.name));
            }
          }
        

        
        function selectMenuBanner(event) {
            if (event.target.files.length > 0) {
                var itemId = event.target.attributes['data-target-item'].value;
                var image = event.target.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var imageData = fileLoadedEvent.target.result;
                    for (var j = 0; j < $scope.menus.length; j++) {
                        if ($scope.menus[j].ID == itemId) {
                            $scope.menus[j].BANNER = imageData.split(',')[1];
                                $scope.$apply();
                                break;
                            }
                    }
                }
                fileReader.readAsDataURL(image);
            }
        }


        function selectDishImage(event) {
            if (event.target.files.length > 0) {
                var dishId = event.target.attributes['data-target-item'].value;
                var image = event.target.files[0];
                var fileReader = new FileReader();
                fileReader.onload = function (fileLoadedEvent) {
                    var imageData = fileLoadedEvent.target.result;
                    for (var j = 0; j < $scope.menus.length; j++) {
                        for (var i = 0; i < $scope.menus[j].ITEMS.length; i++) {
                            if ($scope.menus[j].ITEMS[i].ID == dishId) {
                                $scope.menus[j].ITEMS[i].IMAGE = imageData.split(',')[1];
                                $scope.$apply();
                                break;
                            }
                            
                        }
                    }
                }
                fileReader.readAsDataURL(image);
            }
        }

        function dishUpdateCompleted() {
            reloadMenus();
            notificationService.displaySuccess('successfully updated dish');
        };

        function saveMenuDetails(event, menu) {         
            var uploadEl = angular.element(document.querySelector('#menu-banner-input-' + menu.ID));
            if (!uploadEl || !uploadEl[0] || !uploadEl[0].value || uploadEl[0].value === '') {
                event.preventDefault();
                notificationService.displayWarning('please select banner image');
                return;
            }
        };

        function saveMenuDetailsCompleted() {
            reloadMenus();
            notificationService.displaySuccess('successfully updated menu');
        };


        function saveDish(event, dish) {         
            var uploadEl = angular.element(document.querySelector('#dish-file-input-' + dish.ID));
            if (!uploadEl || !uploadEl[0] || !uploadEl[0].value || uploadEl[0].value === '')
            {
                event.preventDefault();
                notificationService.displayWarning('please select image to upload');
                return;
            }
        };

       function addNewDishBox(menu) {
           menu.ITEMS.push({
               ID: 0,
               IMAGE: $scope.default64BasePlaceholder,
               NAME: '',
               DESCRIPTION: '',
               IS_SPECIAL: false,
               PRICE:''
           })};
    

           function loadMenus() {
               apiService.get('/api/Admin/GetMenus/?num=' + numToLoad + '&currentMenu=' + $scope.currentMenu + '&currentDish=' + $scope.currentDish,
                   null,
                   menusLoadCompleted,
                   menusLoadFailed);
           };

           function reloadMenus() {
               apiService.get('/api/Admin/GetMenusBulk?currentMenu=' + $scope.currentMenu + '&currentDish=' + $scope.currentDish,
                   null,
                   menusReloadCompleted,
                   menusReloadFailed);
           }

           function menusReloadCompleted(result) {
               $scope.menus = result.data;
           };

           function menusReloadFailed(result) {
               notificationService.displayError('failed to load menu items on the page');
           };

           function menusLoadCompleted(result) {
               if (!result.data || result.data.length === 0) {
                   $scope.noMoreItemsToLoad = true;
               }
               else {
                   if ($scope.menus.length <= $scope.currentMenu) {
                       $scope.menus.push.apply($scope.menus, result.data);
                   }
                   else {
                       $scope.menus[$scope.currentMenu].ITEMS.push
                           .apply($scope.menus[$scope.currentMenu].ITEMS,
                              result.data[result.data.length - 1].ITEMS);
                   }
                   if (result.data[result.data.length - 1].ITEMS.length < numToLoad) {
                           $scope.currentMenu++;
                           $scope.currentDish = 0;
                   }
                   else {
                       $scope.currentDish += numToLoad;
                   }
               }
               isLoading = false;
           };


           function menusLoadFailed(result) {
               if (result && result.data && result.data.response) {
                   notificationService.displayError(result.data.response);
               }
               else { notificationService.displayError('failed to load menu'); }
               isLoading = false;
           };

        function addNewMenuBox() {
         $scope.menus.unshift(
                {
                    ID: 0,
                    NAME: '',
                    PDF: null,
                    BANNER: $scope.default64BasePlaceholder
                });
        };
        
        window.scroll(0, 0);
        loadMenus();
        initializeLoadMoreMenus();
    };

      

    app.controller('menuAdminCtrl', menuAdminCtrl);
    menuAdminCtrl.$inject = ['$scope', '$timeout', 'apiService', 'notificationService'];

})(angular.module('store'));







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
(function (app) {
    'use strict';

    function notificationService() {

        toastr.options = {
    
            "positionClass": "toast-top-center",           
            "closeButton": true,
            "closeEasing": 'swing',
            "progressBar": true,
            "showDuration": 300,
            "hideDuration": 1000,
            "timeOut": 5000,
            "extendedTimeOut": 1000,
            "showEasing": "swing",
            "hideEasing": "linear",
            "showMethod": "fadeIn",
            "hideMethod": "fadeOut"
        };

        function displaySuccess(message) {
            toastr.success(message);
        };

        function displayError(error) {
            if (Array.isArray(error)) {
                error.forEach(function (err) {
                    toastr.error(err);
                });
            } else {
                toastr.error(error);
            }
        };

        function displayWarning(message) {
            toastr.warning(message);
        };

        function displayInfo(message) {
            toastr.info(message);
        };
        var service = {
            displaySuccess: displaySuccess,
            displayError: displayError,
            displayWarning: displayWarning,
            displayInfo: displayInfo
        };
        return service;
    };

    app.factory('notificationService', notificationService);

})(angular.module('common.core'));