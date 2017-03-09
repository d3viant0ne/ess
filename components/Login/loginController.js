/**
 * Controllers for the Login logic
 */
angular.module('ess.logincontroller', [])

// demo login controller -- but can access values from $scope.login[]
app.controller('LoginCtrl', function( $scope, $state, $interval, $rootScope, myPushNotification, EssService ){

	//login --
	$scope.login = [];
	$scope.login.email = "";
	$scope.login.password = "";
	// login function --
	$scope.loginAccount = function(){

            $scope.login.email = $scope.login.email.toUpperCase();
				// default the username
            $rootScope.userName = 'QT19684'; //$scope.login.email;

				// check to see if we have a BMW connection
				EssService.ping()
				.then(function(result) {
					$rootScope.isConnected = result;
					if ($rootScope.isConnected == false)
					{
						$scope.showAlert('Info', 'It appears your phone is offline or eServices is unavailable, the app will use mock data.');
					}
				})
				.then(function(d) {
					  $scope.isLoading = true;
						EssService.synchEmployee($rootScope.userName).then(function(d) {
							$scope.isLoading = false;
							$state.go('dashboard');
						});
				});


				/*EssService.ping().then(function(d) {
					$rootScope.isConnected = true;
				},
				// error callback
				function (error)
				{
					$rootScope.isConnected = false;
					//$scope.showAlert('Info', 'It appears your phone is offline or eServices is unavailable, the app will use mock data.');
				//});
			}).then(function(d) {
            $scope.isLoading = true;
              EssService.synchEmployee().then(function(d) {
                $scope.isLoading = false;
								$rootScope.isConnected = true;
                $state.go('dashboard');
            },
						// error callback
						function (error)
						{
							$scope.showAlert('Info', 'It appears your phone is offline, the app requires an internet connection.  Please check your connection and retry.')
							$scope.isLoading = false;
							$rootScope.isConnected = false;
							//$scope.showAlert('Error', 'It appears your phone is offline or eServices is unavailble.')
							//return;
						});
					});*/
	}
})

// Login Passcode controller
app.controller('LoginPasscodeCtrl', function( $scope, $state, $interval, $rootScope, myPushNotification, EssService ) {

  $scope.init = function() {
    $scope.passcode = "";
  }

  $scope.add = function(value) {
    if($scope.passcode.length < 4) {
      $scope.passcode = $scope.passcode + value;
      if($scope.passcode.length == 4) {
        $timeout(function() {
          console.log("The four digit code was entered");
        }, 500);
      }
    }
  }

  $scope.delete = function() {
    if($scope.passcode.length > 0) {
      $scope.passcode = $scope.passcode.substring(0, $scope.passcode.length - 1);
    }
  }
})

// logoff controller
app.controller('logoffController', function( $scope, $state ){
    
  	$scope.showLogin = function(){
        $state.go('login');
	}
})

// sign up controller
app.controller('SignUpCtrl', function( $scope, $state ){
  	$scope.createAccount = function(){
		// create account and redirect here
		//$state.go('home');
        $state.go('dashboard');
	}
});
