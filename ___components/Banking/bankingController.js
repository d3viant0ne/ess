/**
 * Controllers for the Banking
 */
angular.module('ess.bankingcontroller', [])
// select from the list of banks
.controller('bankListSelectController', function($scope, $rootScope, $state, $stateParams, $window, EssService) {

    $rootScope.selectedBank = '';
    
    $scope.selectBank = function(bank)
    {
        $rootScope.selectedBank = bank; 
        $window.history.back();
    }
    
})
.controller('bankingUpdateController', function($scope, $rootScope, $state, $stateParams, $window, $mdSidenav, $log, EssService) {

    $scope.toggleRight = buildToggler('right');
    $scope.title_head = '';
    
    $scope.bankId = $stateParams.id; //$routeParams.id;
    $scope.updateType;
    $scope.currentBank = {}; 
    $scope.updatedBank = {};
    
    $scope.getBank = function()
    {
        for (var x = 0; x < $rootScope.employeeData.TBL_BANKDETAIL.length; x++)
        {
            if ($scope.bankId == $rootScope.employeeData.TBL_BANKDETAIL[x].KEY)
            {
                $scope.currentBank = angular.copy($rootScope.employeeData.TBL_BANKDETAIL[x]);
                $scope.updatedBank = angular.copy($rootScope.employeeData.TBL_BANKDETAIL[x]);
                break;
            }
        }
    }   
    
    $scope.isOpenRight = function(){
      return $mdSidenav('right').isOpen();
    };
    
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
    
    $scope.selectBank = function(bankKey)
    {

        for (var x=0; x< $rootScope.bankList.BANK_LIST.length; x++)
        {
            if (bankKey == $rootScope.bankList.BANK_LIST[x].BANK_KEY)
            {
                $scope.updatedBank.BANKKEY        = $rootScope.bankList.BANK_LIST[x].BANK_KEY;
                $scope.updatedBank.NAMEOFBANKKEY  = $rootScope.bankList.BANK_LIST[x].BANK_NAME;
                break;
            }
        }
        
        //alert('bank chosen' + bankKey);
        $scope.close(); //close the bank select
    }
    
    $scope.getListOfBanks = function()
    {
        EssService.synchBankList().then(function(d) { //now refresh the employee data
        });	   
    }
  
    $scope.saveDelete = function()
    {

        $scope.isLoading = true;
        $scope.getBank();
        $scope.updatedBank.ACTION = 'DELETE';
        EssService.deleteBank($scope.updatedBank).then(function(d){
            
            $scope.isLoading = false;            
              if (d.data.RETURN.TYPE != "E")
              {
               $scope.showAlert('Success', 'Bank information deleted')
              }
              else
              {
               $scope.showAlert('Error', 'SAP Error' + d.data.RETURN.MESSAGE)   
              }
            
             $scope.isLoading = true;
              EssService.synchEmployee().then(function(d) { //now refresh the employee data
                  $scope.isLoading = false;
                  $state.go('bankingList');
            });	
            
        });
    }
    
    $scope.saveUpdate = function()
    {
        if ($scope.currentBank == $scope.updatedBank)
        {
             $scope.showAlert('Info', 'No changes detected')
            return;
        }
        
        $scope.isLoading = true;
        EssService.saveBankUpdate($scope.updatedBank).then(function(d){
            
            $scope.isLoading = false;
              if (d.data.RETURN.TYPE != "E")
              {
               $scope.showAlert('Success', 'Bank information updated')
              }
              else
              {
               $scope.showAlert('Error', 'SAP Error' + d.data.RETURN.MESSAGE)   
              }
            
             $scope.isLoading = true;
              EssService.synchEmployee().then(function(d) { //now refresh the employee data
                  $scope.isLoading = false;
                  $state.go('bankingList');
            });	
            
        });
    }

    $scope.getListOfBanks();
    
    // get the bank details
    if ($scope.bankId)
    {
        if ($scope.bankId == 'AddOther' || $scope.bankId == 'AddMain')
        {
          $scope.updateType = 'Add';
          $scope.title_head = 'Add Bank';

            if ($scope.bankId == 'AddMain')
            {
                $scope.updatedBank.BANKTYPE = '0';
                $scope.updatedBank.BANK_TYPE = 'Main Bank';
                $scope.updatedBank.EMPLOYEENO = $rootScope.employeeData.EMPLOYEE_DETAIL.EMPLOYEENUMBER;
                $scope.updatedBank.ACTION = 'ADD';
            }
            
            if ($scope.bankId == 'AddOther')
            {
                $scope.updatedBank.BANKTYPE = '1';
                $scope.updatedBank.BANK_TYPE = 'Other Bank';
                $scope.updatedBank.EMPLOYEENO = $rootScope.employeeData.EMPLOYEE_DETAIL.EMPLOYEENUMBER;
                $scope.updatedBank.ACTION = 'ADD';
            }
            
        }
        else
        {
            $scope.updateType = 'Edit';
            $scope.title_head = 'Edit Bank';
            $scope.getBank();
            $scope.updatedBank.ACTION = 'UPDATE';
        }
    }
  
    function buildToggler(navID) {
      return function() {
        $mdSidenav(navID)
          .toggle()
          .then(function () {
            $log.debug("toggle " + navID + " is done");
          });
      }
    }
    
})
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close()
        .then(function () {
          $log.debug("close RIGHT is done");
        });
    };
  })
.controller('bankingFormController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'Details';
    
    $scope.bankId = $stateParams.id; //$routeParams.id;
    $scope.currentBank = {}; 
    $scope.updatedBank = {};
    
    $scope.editBank = function()
    {
        $state.go('bankingUpdate', {id: $scope.bankId});    
    }
    
    $scope.getBank = function()
    {
        for (var x = 0; x < $rootScope.employeeData.TBL_BANKDETAIL.length; x++)
        {
            if ($scope.bankId == $rootScope.employeeData.TBL_BANKDETAIL[x].KEY)
            {
                $scope.currentBank = angular.copy($rootScope.employeeData.TBL_BANKDETAIL[x]);
                $scope.updatedBank = angular.copy($rootScope.employeeData.TBL_BANKDETAIL[x]);
                break;
            }
        }
    }   
    //$state.go('app.partDetail', {id: row.entity.MATWA});
    $scope.goBack = function()
    {
     $window.history.back();
    }
    
    // get the bank details
    if ($scope.bankId)
    {
        $scope.getBank();
    }
})
.controller('bankingListDisplayController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'My Banks';
    
    $scope.currentBank = angular.copy($rootScope.employeeData.TBL_BANKDETAIL[0]);
    $scope.updatedBank = angular.copy($rootScope.employeeData.TBL_BANKDETAIL[0]);
    $scope.hasMainBank = false;
    
    $scope.goBack = function()
    {
     $window.history.back();
    }
    
    $scope.hasMainBankCheck = function ()
    {
        for (var x=0; x<$rootScope.employeeData.TBL_BANKDETAIL.length; x++)
        {
          if ($rootScope.employeeData.TBL_BANKDETAIL[x].BANKTYPE == '0') //main bank
          {
              $scope.hasMainBank = true;
              break;
          }
        }
    }
    
    $scope.addOtherBank = function()
    {
        $state.go('bankingUpdate', {id: 'AddOther'});   
    }
   
    $scope.addMainBank = function()
    {
        $state.go('bankingUpdate', {id: 'AddMain'}); 
    }
    
    $scope.changeBank = function()
    {
            $state.go('bankingForm');
    }
    
    // check to see if we have a main bank already
    $scope.hasMainBankCheck();
    
});






