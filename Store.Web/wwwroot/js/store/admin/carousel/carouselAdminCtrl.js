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






