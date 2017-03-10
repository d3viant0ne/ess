/**
 * Controllers for the Attendance Points
 */
angular.module('ess.attendancepointscontroller', [])
.controller('attendancePointsController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'Attendance Points';

    $scope.noAttendancePointsUsed = false;
    $scope.attendancePointList = [];
	  $scope.totalAttendancePoints = 0;
    $scope.message = '';

	$scope.totalAttendancePoints = 0;

	$scope.getAttendancePoints = function()
	{

		if ($rootScope.employeeData.TBL_ATTENDANCE_POINTS)
			{
			    for (var x=0; x<$rootScope.employeeData.TBL_ATTENDANCE_POINTS.length; x++)
			    {
			        $scope.attendancePointList.push($rootScope.employeeData.TBL_ATTENDANCE_POINTS[x]);
			    }

			    if ($scope.attendancePointList.length == 0)
			    {
			      $scope.message = 'No Attendance Points this year';
			      $scope.noAttendancePointsUsed = true;
			    }

				$scope.totalAttendancePoints = $rootScope.employeeData.TOTAL_ATTENDANCE_POINTS;
			}

	}

    $scope.showHelp = function()
    {
        $state.go('attendancePointsHelp');
    }

	// read the attendance points
	$scope.getAttendancePoints();
})
.controller('attendancePointsHelpController', function( $scope, $rootScope, $state, $stateParams, EssService ){

})
/* not used anymore...
.controller('attendancePointDetailController', function( $scope, $rootScope, $state, $stateParams, EssService ){

  $scope.noAttendancePointsUsed = false;
  $scope.attendancePointList = [];
	$scope.totalAttendancePoints = 0;
  $scope.message = '';

  $scope.getAttendancePointsUsed = function()
  {
		if ($rootScope.isConnected == true && $rootScope.employeeData.TBL_ATTENDANCE_POINTS)
			{
			    for (var x=0; x<$rootScope.employeeData.TBL_ATTENDANCE_POINTS.length; x++)
			    {
			        $scope.attendancePointList.push($rootScope.employeeData.TBL_ATTENDANCE_POINTS[x]);
			    }

			    if ($scope.attendancePointList.length == 0)
			    {
			      $scope.message = 'No Attendance Points this year';
			      $scope.noAttendancePointsUsed = true;
			    }

					$scope.totalAttendancePoints = $rootScope.employeeData.TOTAL_ATTENDANCE_POINTS;
			}
			else { //use mock data
				var attendancePointDetail = {};
				attendancePointDetail.DATUM = '1/4/2017';
				attendancePointDetail.ANZHL = 4;
				$scope.attendancePointList.push(attendancePointDetail);
				var attendancePointDetail = {};
				attendancePointDetail.DATUM = '1/5/2017';
				attendancePointDetail.ANZHL = 8;
				$scope.attendancePointList.push(attendancePointDetail);
				$scope.totalAttendancePoints = 12;
			}
  }

  $scope.getAttendancePointsUsed();

})*/
;
