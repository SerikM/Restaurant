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






