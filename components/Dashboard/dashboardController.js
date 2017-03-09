/**
 * Controllers for the Vacation / APTO
 */
angular.module('ess.controllers', [])

angular.module('ess.dashboardcontroller', [])
.controller('DashboardController', function($scope, $rootScope, $state, $stateParams, $window, EssService) {

    console.log('in dashboard controller');

    $scope.synchEmployeeData = function()
    {
            $scope.isLoading = true;
              EssService.synchEmployee().then(function(d) {
                  $scope.isLoading = false;
            });
    }

    $scope.goBack = function()
    {
     $window.history.back();
    }

    $scope.showProfile = function()
    {
     $window.history.back();
    }
    
    // done in login
    $scope.synchEmployeeData();

});
/* not using the alt controller
.controller('DashboardAltController', function($scope, $rootScope, $state, $stateParams, $window, EssService) {
    $scope.synchEmployeeData = function()
    {
            $scope.isLoading = true;
              EssService.synchEmployee().then(function(d) {
                  $scope.isLoading = false;
            });
    }

    $scope.goBack = function()
    {
     $window.history.back();
    }

    // done in login
    $scope.synchEmployeeData();

});*/
