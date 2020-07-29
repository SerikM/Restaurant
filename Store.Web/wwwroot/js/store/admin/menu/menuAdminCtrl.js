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






