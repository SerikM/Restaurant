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