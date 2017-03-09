/**
 * beginnings of a controller to login to system
 * here for the purpose of showing how a service might
 * be used in an application
 */
angular.module('ess.profilecontroller', [])
.controller('profileController', function($scope, $rootScope, $state, $stateParams, $window, EssService) {

    $scope.user = {};

    $scope.user.phone = '555-555-1212';
    $scope.user.email = 'johndoe@gmail.com';


});
