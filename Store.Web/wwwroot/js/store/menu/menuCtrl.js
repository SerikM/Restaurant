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





