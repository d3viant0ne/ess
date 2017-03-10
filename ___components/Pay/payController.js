/**
 * Controllers for the Pay Statements
 */
angular.module('ess.paycontroller', [])

.controller('payStatementListController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'My Pay';

	$scope.showPayStatement = function(key){
		$state.go('payrollDetail',{
			id:key
		});
	}

})
.controller('payStatementController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'My Pay';
    $scope.payStatement = {};

    $scope.payStatementId = $stateParams.id; //$routeParams.id;
    $scope.payStatementItems = [];
    $scope.prevStatementId;
    $scope.nextStatementId;

    $scope.getPayStatementDetails = function()
    {
        for (var x=0; x<$rootScope.employeeData.TBL_PAYROLL_LIST.length; x++)
        {
            if ($scope.payStatementId == $rootScope.employeeData.TBL_PAYROLL_LIST[x].SEQUENCENUMBER)
            {
                $scope.payStatement = $rootScope.employeeData.TBL_PAYROLL_LIST[x];

                // get the next statement
                if ( x==0 )
                {
                    $scope.nextStatementId = $rootScope.employeeData.TBL_PAYROLL_LIST[x].SEQUENCENUMBER
                }
                else
                {
                   $scope.nextStatementId = $rootScope.employeeData.TBL_PAYROLL_LIST[x-1].SEQUENCENUMBER
                }

                // get the previous statement
                if ( x == $rootScope.employeeData.TBL_PAYROLL_LIST.length-1 )
                {
                    $scope.prevStatementId = $rootScope.employeeData.TBL_PAYROLL_LIST[x].SEQUENCENUMBER
                }
                else
                {
                   $scope.prevStatementId = $rootScope.employeeData.TBL_PAYROLL_LIST[x+1].SEQUENCENUMBER
                }

                break;
            }
        }

       $scope.isLoading = true;
			 $scope.payStatement.Gross = 0;
			 $scope.payStatement.Taxes = 0;
			 $scope.payStatement.Deductions = 0;
			 $scope.payStatement.Net = 0;
			 $scope.payStatement.Benefits = 0;
        
       //EssService.getPayStatementDetails($scope.payStatementId).then(function(d){
           //$scope.isLoading = false;
           //$scope.payStatementItems = d.TBL_PAYROLL_LINES;
           $scope.payStatementItems = $scope.payStatement.TBL_PAYROLL_LINES;

           for (var x=0; x<$scope.payStatementItems.length; x++)
           {
            if ($scope.payStatementItems[x].CATEGORY == 'GROSS_TOTAL')
            {
                $scope.payStatement.Gross += parseFloat($scope.payStatementItems[x].AMOUNT);
            }
            else if ($scope.payStatementItems[x].CATEGORY == 'TAX_TOTAL')
            {
                $scope.payStatement.Taxes += parseFloat($scope.payStatementItems[x].AMOUNT);
            }
            else if ($scope.payStatementItems[x].CATEGORY == 'DED_TOTAL')
            {
                $scope.payStatement.Deductions += parseFloat($scope.payStatementItems[x].AMOUNT);
            }
            else if ($scope.payStatementItems[x].CATEGORY == 'NET_TOTAL')
            {
                $scope.payStatement.Net += parseFloat($scope.payStatementItems[x].AMOUNT);
            }
            else if ($scope.payStatementItems[x].CATEGORY == 'BENEFITS_TOTAL')
            {
                $scope.payStatement.Benefits += parseFloat($scope.payStatementItems[x].AMOUNT);
            }
            // remove '-' symbols as this causes issues with formatting.
           }

           if (!$scope.payStatement.Deductions)
           {
               $scope.payStatement.Deductions = 0;
           }

        //});
    }

    // get the statement details
    if ($scope.payStatementId)
    {
        $scope.getPayStatementDetails();
    }
});
