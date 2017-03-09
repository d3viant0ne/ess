'use strict';
app.config(['$urlRouterProvider', '$stateProvider', function($urlRouterProvider, $stateProvider) {

    $urlRouterProvider.otherwise('/login');
    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'components/Login/login-alt.html',
		  controller: 'LoginCtrl'
    });
    $stateProvider.state('login-passcode', {
        url: '/login-passcode',
        templateUrl: 'components/Login/login-passcode.html',
		  controller: 'LoginPasscodeCtrl'
    });
    $stateProvider.state('signup', {
        url: '/signup',
        templateUrl: 'components/Login/sign-up.html',
		  controller: 'SignUpCtrl'
    });
    $stateProvider.state('logoff', {
        url: '/logoff',
        templateUrl: 'components/Login/logoff.html',
		  controller: 'logoffController'
    });
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        templateUrl: 'components/Dashboard/dashboard.html',
		  controller: 'DashboardController'
    });
    $stateProvider.state('lifeEvents', {
        url: '/lifeEvents',
        templateUrl: 'components/LifeEvents/lifeEvents.html',
		  controller: 'lifeEventsController'
    });
    $stateProvider.state('eventMarried', {
        url: '/eventMarried',
        templateUrl: 'components/LifeEvents/eventMarried.html',
		  controller: 'lifeEventsController'
    });
    $stateProvider.state('eventBaby', {
        url: '/eventBaby',
        templateUrl: 'components/LifeEvents/eventBaby.html',
		  controller: 'lifeEventsController'
    });
    $stateProvider.state('eventLoan', {
        url: '/eventLoan',
        templateUrl: 'components/LifeEvents/eventLoan.html',
		  controller: 'lifeEventsController'
    });
    $stateProvider.state('eventMoved', {
        url: '/eventMoved',
        templateUrl: 'components/LifeEvents/eventMoved.html',
		  controller: 'lifeEventsController'
    });
    $stateProvider.state('payrollDetail', {
        url: '/payrollDetail/:id',
        templateUrl: 'components/Pay/pay-statement.html',
		  controller: 'payStatementController'
    });
    $stateProvider.state('pay-statementList', {
        url: '/pay-statementList',
        templateUrl: 'components/Pay/pay-statementList.html',
		  controller: 'payStatementListController'
    });
    $stateProvider.state('attendancePoints', {
        url: '/attendancePoints',
        templateUrl: 'components/AttendancePoints/attendancePoints.html',
		  controller: 'attendancePointsController'
    });
    $stateProvider.state('attendancePointsHelp', {
        url: '/attendancePointsHelp',
        templateUrl: 'components/AttendancePoints/attendancePointsHelp.html',
		  controller: 'attendancePointsHelpController'
    });
    $stateProvider.state('timeOff-summary', {
        url: '/timeOff-summary',
        templateUrl: 'components/TimeOff/timeOffSummary.html',
		  controller: 'timeOffController'
    });
    $stateProvider.state('timeOff', {
        url: '/timeOff',
        templateUrl: 'components/TimeOff/time-off.html',
		  controller: 'timeOffController'
    });
    $stateProvider.state('timeOffApto', {
        url: '/time-off-apto',
        templateUrl: 'components/TimeOff/time-off-apto.html',
		  controller: 'timeOffAptoController'
    });
    $stateProvider.state('timeOffContingencies', {
        url: '/time-off-contingencies',
        templateUrl: 'components/TimeOff/time-off-contingencies.html',
        controller: 'timeOffContingenciesController'
    });
    $stateProvider.state('time-statement', {
        url: '/time-statement',
        templateUrl: 'components/Time/time-statement.html',
        controller: 'timeStatementController'
    });
    $stateProvider.state('timeStatementWeekSummary', {
        url: '/timeWeekSummary/:id',
        templateUrl: 'components/Time/timeStatementWeekSummary.html',
		  controller: 'timeWeekSummaryController'
    });
    $stateProvider.state('workSchedule', {
        url: '/workSchedule',
        templateUrl: 'components/WorkSchedule/workSchedule.html',
        controller: 'workScheduleController'
    });
	 $stateProvider.state('addressForm', {
        url: '/addressForm',
        templateUrl: 'components/Address/addressForm.html',
		  controller: 'addressFormController'
    });
	 $stateProvider.state('bankingNew', {
        url: '/bankingForm',
        templateUrl: 'components/Banking/bankingForm.html',
		  controller: 'bankingFormController'
    });
	 $stateProvider.state('bankingForm', {
        url: '/bankingForm/:id',
        templateUrl: 'components/Banking/bankingForm.html',
		  controller: 'bankingFormController'
    });
	 $stateProvider.state('bankingUpdate', {
        url: '/bankingUpdate/:id',
        templateUrl: 'components/Banking/bankingUpdate.html',
		  controller: 'bankingUpdateController'
    });
	 $stateProvider.state('bankingList', {
        url: '/bankingList',
        templateUrl: 'components/Banking/bankingListDisplay.html',
		  controller: 'bankingListDisplayController'
    });
	 $stateProvider.state('bankList', {
        url: '/bankList',
        templateUrl: 'components/Banking/bankList.html',
		  controller: 'bankListSelectController'
    });
	 $stateProvider.state('linkList', {
        url: '/linkList',
        templateUrl: 'templates/linkListDisplay.html',
		  controller: 'linkListController'
    });
	 $stateProvider.state('myMessages', {
        url: '/myMessages',
        templateUrl: 'components/Messages/myMessages.html',
		  controller: 'myMessagesController'
    });
	 $stateProvider.state('messageDetail', {
        url: '/messageDetail/:id',
        templateUrl: 'components/Messages/messageDetail.html',
		  controller: 'messageDetailController'
    });
	 $stateProvider.state('askHRDashboard', {
        url: '/askHRDashboard',
        templateUrl: 'components/AskHR/askHRDashboard.html',
		  controller: 'askHRDashboardController'
    });
	 $stateProvider.state('askHR', {
        url: '/askHR',
        templateUrl: 'components/AskHR/askHR.html',
		  controller: 'askHRController'
    });
	 $stateProvider.state('ticketDetail', {
        url: '/ticketDetail/:id',
        templateUrl: 'components/AskHR/ticketDetail.html',
		  controller: 'ticketDetailController'
    });
	 $stateProvider.state('ticketCreate', {
        url: '/ticketCreate',
        templateUrl: 'components/AskHR/ticketCreate.html',
		  controller: 'ticketCreateController'
    });
	 $stateProvider.state('documentDetail', {
        url: '/documentDetail/:id',
        templateUrl: 'components/AskHR/documentDetail.html',
		  controller: 'documentDetailController'
    });
	 $stateProvider.state('browseHR', {
        url: '/browseHR',
        templateUrl: 'components/AskHR/browseHR.html',
		  controller: 'browseHRController'
    });
	 $stateProvider.state('searchHR', {
        url: '/searchHR',
        templateUrl: 'components/AskHR/searchHR.html',
		  controller: 'searchHRController'
    });
	 $stateProvider.state('w4Form', {
        url: '/w4Form',
        templateUrl: 'components/W4/w4Form.html',
		  controller: 'w4FormController'
    });
	 $stateProvider.state('news', {
        url: '/news',
        templateUrl: 'components/News/news.html',
		  controller: 'newsController'
    });
	 $stateProvider.state('newsDetail', {
        url: '/news/:id',
        templateUrl: 'components/News/news.html',
		  controller: 'newsDetailController'
    });
	 $stateProvider.state('profile', {
        url: '/profile',
        templateUrl: 'components/Profile/profile.html',
		  controller: 'profileController'
    });
}]);
