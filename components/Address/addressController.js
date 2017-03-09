/**
 * Controllers for the Pay Statements
 */
angular.module('ess.addresscontroller', [])

// in the address form controller
.controller('addressFormController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'Main Address';
    
    $scope.currentAddress = angular.copy($rootScope.employeeData.TBL_ADDRESSES[0]);
    $scope.updatedAddress = angular.copy($rootScope.employeeData.TBL_ADDRESSES[0]);
    
    $scope.saveUpdate = function()
    {
     
        if ($scope.currentAddress == $scope.updatedAddress)
        {
            $scope.showAlert('Error', 'No changes detected');
            return;
        }
        
        $scope.isLoading = true;
        EssService.saveAddressUpdate($scope.updatedAddress).then(function(d){
              $scope.isLoading = false;
              $scope.showAlert('Success', 'Address information updated');
            
              $scope.isLoading = true;
              EssService.synchEmployee().then(function(d) { //now refresh the employee data
                  $scope.isLoading = false;
            });	
            
        });
    }
    
    $scope.goBack = function()
    {
     $window.history.back();
    }
    
});



