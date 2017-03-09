/**
 * Controllers for the Vacation / APTO
 */
angular.module('ess.timeoffcontroller', [])
.controller('timeOffController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'Time Off';

	$scope.submitTimeOffRequest = function() {
			$scope.showAlert('Success', 'Your request has been submitted');
	};

	$scope.goToApto = function(){
		$state.go('timeOffApto');
	}

	$scope.goToContingencies = function(){
		$state.go('timeOffContingencies');
	}

	$scope.timeOffDetail = {};

	$scope.getTimeOffDetails = function()
	{
		if ($rootScope.isConnected == true && $rootScope.employeeData.TBL_APTO_SUMMARY)
			{
				for (var x=0; x<$rootScope.employeeData.TBL_APTO_SUMMARY.length; x++)
				{
						$scope.timeOffDetail.remainingBalance = $rootScope.employeeData.TBL_APTO_SUMMARY[x].BALANCE;
						$scope.timeOffDetail.futureBalance = $rootScope.employeeData.TBL_APTO_SUMMARY[x].FUTURE_BALANCE;
						$scope.timeOffDetail.renumerated = $rootScope.employeeData.TBL_APTO_SUMMARY[x].RENUMERATED;
						$scope.timeOffDetail.used = $rootScope.employeeData.TBL_APTO_SUMMARY[x].DEDUCTED;
						console.log($scope.timeOffDetail);
				}
			}
			else { //not connected, use mock data
				$scope.timeOffDetail.remainingBalance = 62;
				$scope.timeOffDetail.futureBalance = 74;
				$scope.timeOffDetail.renumerated = 0;
				$scope.timeOffDetail.used = 12;
			}
	}

	// read the time off details
	$scope.getTimeOffDetails();
})
.controller('timeOffAptoController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'APTO Used';

  $scope.noHoursUsed = false;
  $scope.usedAPTOList = [];
  $scope.message = '';

  $scope.getUsedAPTOList = function()
  {
		if ($rootScope.isConnected == true && $rootScope.employeeData.TBL_APTO_SUMMARY)
			{
			    for (var x=0; x<$rootScope.employeeData.TBL_APTO_DETAIL.length; x++)
			    {
			        $scope.usedAPTOList.push($rootScope.employeeData.TBL_APTO_DETAIL[x]);
			    }

			    if ($scope.usedAPTOList.length == 0)
			    {
			      $scope.message = 'No APTO used this year';
			      $scope.noHoursUsed = true;
			    }
			}
			else { //use mock data
				var aptoDetail = {};
				aptoDetail.DATUM = '1/4/2017';
				aptoDetail.HOURS = 4;
				$scope.usedAPTOList.push(aptoDetail);
				var aptoDetail = {};
				aptoDetail.DATUM = '1/5/2017';
				aptoDetail.HOURS = 8;
				$scope.usedAPTOList.push(aptoDetail);
			}
  }

  $scope.getUsedAPTOList();

})
.controller('timeOffContingenciesController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'Contingencies Used';

  $scope.noHoursUsed = false;
  $scope.usedContingenciesList = [];
  $scope.message = '';

  $scope.getUsedContingenciesList = function()
  {
		if ($rootScope.isConnected == true && $rootScope.employeeData.TBL_APTO_SUMMARY)
			{

				$scope.message = 'No Contingencies used this year';
				$scope.noHoursUsed = true;

			    /*for (var x=0; x<$rootScope.employeeData.TBL_APTO_DETAIL.length; x++)
			    {
			        $scope.usedAPTOList.push($rootScope.employeeData.TBL_APTO_DETAIL[x]);
			    }

			    if ($scope.usedAPTOList.length == 0)
			    {
			      $scope.message = 'No APTO used this year';
			      $scope.noHoursUsed = true;
			    }*/
			}
			else { //use mock data

				$scope.message = 'No Contingencies used this year';
				$scope.noHoursUsed = true;
				/*var aptoDetail = {};
				aptoDetail.DATUM = '1/4/2017';
				aptoDetail.HOURS = 4;
				$scope.usedAPTOList.push(aptoDetail);
				var aptoDetail = {};
				aptoDetail.DATUM = '1/5/2017';
				aptoDetail.HOURS = 8;
				$scope.usedAPTOList.push(aptoDetail);*/
			}
  }

  $scope.getUsedContingenciesList();
});
