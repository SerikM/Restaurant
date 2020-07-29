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

