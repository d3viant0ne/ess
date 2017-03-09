 // not used anymore...
/**
 * Controllers for the app
 */
angular.module('ess.controllers', [])
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

    // done in login
    $scope.synchEmployeeData();

})
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

})
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

})

// the list of links controller
.controller('linkListController', function($scope, $rootScope, $state, $stateParams, $window, EssService) {
	$scope.title_head = 'HR Links';
    $scope.launchLink = function(link)
    {
        $scope.showAlert('Info', 'This will open the link')
        //$window.open('http://' + link, "_system");
    }

})
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

})
.controller('payStatementListController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'My Pay';

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
       EssService.getPayStatementDetails($scope.payStatementId).then(function(d){
           $scope.isLoading = false;
           $scope.payStatementItems = d.TBL_PAYROLL_LINES;

           for (var x=0; x<$scope.payStatementItems.length; x++)
           {
            if ($scope.payStatementItems[x].CATEGORY == 'GROSS_TOTAL')
            {
                $scope.payStatement.Gross = $scope.payStatementItems[x].AMOUNT;
            }
            else if ($scope.payStatementItems[x].CATEGORY == 'TAXES_TOTAL')
            {
                $scope.payStatement.Taxes = $scope.payStatementItems[x].AMOUNT;
            }
            else if ($scope.payStatementItems[x].CATEGORY == 'DED_TOTAL')
            {
                $scope.payStatement.Deductions = $scope.payStatementItems[x].AMOUNT;
            }
            else if ($scope.payStatementItems[x].CATEGORY == 'NET_TOTAL')
            {
                $scope.payStatement.Net = $scope.payStatementItems[x].AMOUNT;
            }
           }

           if (!$scope.payStatement.Deductions)
           {
               $scope.payStatement.Deductions = 0;
           }

        });
    }

    // get the statement details
    if ($scope.payStatementId)
    {
        $scope.getPayStatementDetails();
    }
})
.controller('w4FormController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'W4 Info';


})
// life events controller
.controller('newsController', function( $scope, $state, $http ){

})
// life events controller
.controller('newsDetailController', function( $scope, $state, $http ){

})

// life events controller
.controller('lifeEventsController', function( $scope, $state, $http ){

})
// my messages controller
.controller('myMessagesController', function( $scope, $state, $stateParams, $rootScope ){
  //console.log('in messages');

    $scope.showMessage = function showMessage(message)
    {
        var messageLink = {};
        messageLink.name = message.name;
        messageLink.description = message.description;
        messageLink.priority = message.priority;
        messageLink.author = message.author;
        messageLink.target = message.target;
        messageLink = JSON.stringify(messageLink);
        $state.go('messageDetail', {id: messageLink});
    }

})
// message detail controller
.controller('messageDetailController', function( $scope, $state, $stateParams, $rootScope ){
  //console.log('in messages');
        //$scope.messageDetail = JSON.parse($stateParams.id); //$routeParams.id;
    $scope.messageDetail = JSON.parse($stateParams.id);

})
// infor controller
.controller('inforController', function( $scope, $state ){

})
.controller('askHRController', function( $scope, $state, $rootScope, $http ){

    // need to login to infor.
    $scope.loginInfor = function loginInfor()
    {
        var headerData = 'organization=bmwmc&profileId=a6988c3d-3b97-4948-8d30-4235d876a4aa&PIN=1068';

        var req = {
         method: 'POST',
         url: 'https://uat.enwisen.com/asi/MobileLogin.aspx?_dc=1469748412341',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         withCredentials: true,
         data: headerData
        }

        $http(req).then(function(response, request){
            // success function
            console.log('logged in');
            $scope.getMyTickets();
            },
        function(response, request){
            // error function
            console.log('log in failed');
        });
    }

    $scope.myTickets = [];
    // gets your tickets from the infor system
    $scope.getMyTickets = function getMyTickets()
    {
        var req = {
         method: 'GET',
         url: 'https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-MyTickets&_dc=1469934676402',
         withCredentials: true
        }

        $http(req).then(function(response, request){
            // success function
            console.log('got tickets');
            $scope.myTickets = response.data;
            $rootScope.askHRItems = $scope.myTickets.reportData.length;
            //$scope.getTicketDetails();
            },
        function(response, request){
            // error function
            console.log('tickets failed');
        });
    }

    // will launch the create ticket
    $scope.createTicket = function createTicket()
    {
        $state.go('ticketCreate');
    }

    // initialize via a login
    $scope.loginInfor();

})
.controller('ticketDetailController', function( $scope, $state, $stateParams, $http ){

    $scope.ticket = JSON.parse($stateParams.id); //$routeParams.id;

    // need to login to infor.
    $scope.loginInfor = function loginInfor()
    {
        var headerData = 'organization=bmwmc&profileId=a6988c3d-3b97-4948-8d30-4235d876a4aa&PIN=1068';

        var req = {
         method: 'POST',
         url: 'https://uat.enwisen.com/asi/MobileLogin.aspx?_dc=1469748412341',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         withCredentials: true,
         data: headerData
        }

        $http(req).then(function(response, request){
            // success function
            console.log('logged in');
            $scope.getTicketDetail();
            $scope.getTicketNotes();
            $scope.getTicketAttachments();
            },
        function(response, request){
            // error function
            console.log('log in failed');
        });
    }

    $scope.ticketDetail = {};
    // gets your tickets from the infor system
    $scope.getTicketDetail = function getTicketDetail()
    {
        var ticketUrl = 'https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketDetails&_dc=1469934676402&ticketGuID=' + $scope.ticket.caseGuID + '&inactive=false';

        //https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketDetails&_dc=1469936598647&ticketGuID=703f4076-4650-4bb9-ac14-0d8cd62662b1&inactive=false
        var req = {
         method: 'GET',
         url: ticketUrl,
         withCredentials: true
        }

        $http(req).then(function(response, request){
            // success function
            console.log('got ticket detail');
            $scope.ticketDetail = response.data.reportData[0];
            },
        function(response, request){
            // error function
            console.log('tickets failed');
        });
    }

    $scope.ticketNotes = []
    $scope.getTicketNotes = function getTicketNotes()
    {
        var ticketUrl = 'https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketNote&_dc=1469934676402&ticketCode=' +
            $scope.ticket.caseId + '&ticketGuID=' + $scope.ticket.caseGuID + '&inactive=false';

        //    https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketNote&_dc=1469936598779&ticketCode=CXYE2UMZ&ticketGuID=703f4076-4650-4bb9-ac14-0d8cd62662b1&inactive=false
        var req = {
         method: 'GET',
         url: ticketUrl,
         withCredentials: true
        }

        $http(req).then(function(response, request){
            // success function
            console.log('got ticket notes');
            $scope.ticketNotes = response.data.reportData;
            },
        function(response, request){
            // error function
            console.log('tickets failed');
        });
    }

    $scope.ticketAttachments = []
    $scope.getTicketAttachments = function getTicketAttachments()
    {
        var ticketUrl = 'https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketAttachment&_dc=1469934676402&ticketCode=' +
            $scope.ticket.caseId + '&ticketGuID=' + $scope.ticket.caseGuID + '&inactive=false';

        // https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketAttachment&_dc=1469936878755&ticketCode=CXYE2UMZ&ticketGuID=703f4076-4650-4bb9-ac14-0d8cd62662b1&inactive=false
        // https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketAttachment&_dc=1469934676402&ticketCode=NP2KWZ6X&ticketGuID=834187a2-c646-4347-a748-83a737f522cd&inactive=false
        var req = {
         method: 'GET',
         url: ticketUrl,
         withCredentials: true
        }

        $http(req).then(function(response, request){
            // success function
            console.log('got ticket attachments');
            $scope.ticketAttachments = response.data.reportData;
            },
        function(response, request){
            // error function
            console.log('tickets failed');
        });
    }

    $scope.addNotes = function addNotes()
    {

    }

    // initialize via a login
    if ($scope.ticket)
        {
            $scope.loginInfor();
        }

})
.controller('ticketCreateController', function( $scope, $state, $stateParams, $http ){


    // need to login to infor.
    $scope.loginInfor = function loginInfor()
    {
        var headerData = 'organization=bmwmc&profileId=a6988c3d-3b97-4948-8d30-4235d876a4aa&PIN=1068';

        var req = {
         method: 'POST',
         url: 'https://uat.enwisen.com/asi/MobileLogin.aspx?_dc=1469748412341',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         withCredentials: true,
         data: headerData
        }

        $http(req).then(function(response, request){
            // success function
            console.log('logged in');
            $scope.getTicketTopics();
            },
        function(response, request){
            // error function
            console.log('log in failed');
        });
    }

    $scope.ticketDetail = {};
    $scope.ticketNotes = []
    $scope.ticketAttachments = []

    $scope.ticketTopics = []
    $scope.getTicketTopics = function getTicketTopics()
    {
        var ticketTopicsUrl = 'https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-topic&_dc=1470016473546&popID=1';

        var req = {
         method: 'GET',
         url: ticketTopicsUrl,
         withCredentials: true
        }

        $http(req).then(function(response, request){
            // success function
            console.log('got ticket topics');
            $scope.ticketTopics = response.data.reportData;
            //$scope.createTopics();
            },
        function(response, request){
            // error function
            console.log('tickets failed');
        });
    }

    $scope.createTopics = function createTopics()
    {
        $("#topicSelect").empty(); //removes all existing entries
        var option = $('<option />').val('').text('Select a Category');
        $("#topicSelect").append(option);

         $.each($scope.ticketTopics,function(key,value)
         {
             var option = $('<option />').val(value.topicId).text(value.topicName);
            $("#topicSelect").append(option);
         });
    }

    $scope.showTopics =  function showTopics()
    {
        $("#createTicket").hide(0);
        $("#topicList").show(400);
    }
    //$('#massMaterialListScreen').hide(0);

    //$("#topicList").hide()
    $scope.selectTopic =  function selectTopic(topic)
    {
        $scope.ticketDetail.topicName = topic.topicName;
        $scope.ticketDetail.topicId = topic.topicId;

        $("#topicList").hide(0);
        $("#createTicket").show(400);
    }

    // ticket categories
    //https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-topic&_dc=1470016473546&popID=1

    // http://www.mozenda.com/ for screen form posting
    //  detailViewSendBtnTapped: function() in the app.js line 37042 approx
    // "{'topicId' :'3','subject':'test','details':'testissue'}"
    $scope.saveNewTicket = function saveNewTicket()
    {
        console.log('saving ticket');
        var docLink = 'https://uat.enwisen.com/asi/Page.aspx?code=cm-mobile-r-TicketDetailsForm&_dc=1469814361048';
        //var ticketData = "{'topicId' :'3','subject':'test','details':'testissue'}";

        var ticketData = "{'topicId' :'" + $scope.ticketDetail.topicId + "','subject':'" + $scope.ticketDetail.subject + "','details':'" + $scope.ticketDetail.details + "'}";

        var encodedData = encodeSwE5(ticketData);
       // var encodedData = 'dye0db3bpBl0YklayJ6AmzJnMdCLzdjWdqJnWZ0NozJno1mY31jHIvJt2YztwyJnwvGZ0VlWYslcyc6cj2JtJbyd0BnXZ0N03J=0';
        //var formData = 'InstanceJSON=dye0db3bpBl0YklayJ6AmzJnMdCLzdjWdqJnWZ0NozJno1mY31jHIvJt2YztwyJnwvGZ0VlWYslcyc6cj2JtJbyd0BnXZ0N03J%3D0&varhash=';
        var formData = 'InstanceJSON=' + encodedData + '&varhash=';
        var req = {
         method: 'POST',
         url: docLink,
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
         },
         withCredentials: true,
            data: formData
         //data: {
        //     InstanceJSON: encodedData,
        //     varhash: ""
        //    }
        }

        $http(req).then(function(response, request){
            // success function
            console.log('ticket saved successfully');
            $state.go('askHR'); //go back to ticket list
            },
        function(response, request){
            // error function
            console.log('ticket save failed');
        });
    }

    $scope.addNotes = function addNotes()
    {

    }

    $("#topicList").hide(0);
    $scope.loginInfor();

})
.controller('browseHRController', function( $scope, $state, $http, $rootScope ){


    // need to login to infor.
    $scope.loginInfor = function loginInfor()
    {
        var headerData = 'organization=bmwmc&profileId=a6988c3d-3b97-4948-8d30-4235d876a4aa&PIN=1068';

        var req = {
         method: 'POST',
         url: 'https://uat.enwisen.com/asi/MobileLogin.aspx?_dc=1469748412341',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         withCredentials: true,
         data: headerData
        }

        $http(req).then(function(response, request){
            // success function
            console.log('logged in');
            $scope.getBrowseList();
            },
        function(response, request){
            // error function
            console.log('log in failed');
        });

    }

    $scope.browseList = [];

    $scope.getBrowseList = function getBrowseList()
    {
        var req = {
         method: 'GET',
         url: 'https://uat.enwisen.com/asi/Page.aspx?alias=mobilestart&_dc=1469812559949',
         withCredentials: true
        }

        $http(req).then(function(response, request){
            // success function
            console.log('got browse list');
            $scope.browseList = response.data.result;
            $rootScope.browseList = $scope.browseList;
            },
        function(response, request){
            // error function
            console.log('browse list failed');
        });

    }

    $scope.showDocument = function showDocument(link)
    {
        var documentLink = {};
        documentLink.url = link.url;
        documentLink.name = link.name;
        documentLink.filetype = link.filetype;
        documentLink = JSON.stringify(documentLink);
        $state.go('documentDetail', {id: documentLink});
    }

    // call initial login
    $scope.loginInfor();

})
.controller('documentDetailController', function( $scope, $state, $stateParams, $window, $sce, $http, PDFViewerService){

    //https://uat.enwisen.com/asi/
    //$scope.content;
    $scope.documentLink = JSON.parse($stateParams.id); //$routeParams.id;
    $scope.documentDetail = {};
    $scope.isPdf = false;

    // need to login to infor.
    $scope.loginInfor = function loginInfor()
    {
        var headerData = 'organization=bmwmc&profileId=a6988c3d-3b97-4948-8d30-4235d876a4aa&PIN=1068';

        var req = {
         method: 'POST',
         url: 'https://uat.enwisen.com/asi/MobileLogin.aspx?_dc=1469748412341',
         headers: {
           'Content-Type': 'application/x-www-form-urlencoded'
         },
         withCredentials: true,
         data: headerData
        }

        $http(req).then(function(response, request){
            // success function
            console.log('logged in');
            $scope.getDocument();
            },
        function(response, request){
            // error function
            console.log('log in failed');
        });

    }

    $scope.getDocument = function getDocument()
    {

        documentText = "";
        // render pdf document
        if ($scope.documentLink.filetype == 'pdf')
            {
                 // Disable workers to avoid yet another cross-origin issue (workers need
  // the URL of the script to be loaded, and dynamically loading a cross-origin
  // script does not work).
  //
                //PDFJS.disableWorker = true;

                $scope.isPdf = true;

                $scope.documentDetail.topicName = $scope.documentLink.name;

                if ($scope.documentLink.fileName == "12 Hour Shift 160 Benefit Impact")
                    {
                        $scope.documentLink.fileUrl = 'https://dl.dropboxusercontent.com/u/74710899/BMW/files/12%20Hour%20Shift%20160%20Benefit.png';
                    }

                if ($scope.documentLink.fileName == "Tax Form 1095-C FAQs")
                    {
                        $scope.documentLink.fileUrl = 'https://dl.dropboxusercontent.com/u/74710899/BMW/files/TaxForm%201095.png';
                    }

                /*var fileURL = "https://uat.enwisen.com/asi/Toolset/DownloadPosting.aspx?code=52fdaa5b";
                //$scope.pdfURL = $scope.content = $sce.trustAsResourceUrl(fileURL);
                //$scope.instance = PDFViewerService.Instance("viewer");
                $scope.documentDetail.topicName = $scope.documentLink.name;

                console.log('rendering document');
                var fileURL = 'http://www.pdf995.com/samples/pdf.pdf';
                renderPDF(fileURL, document.getElementById('holder'));

                // this is a pdf document
                //var docLink = 'https://uat.enwisen.com/asi/' + $scope.documentLink.url + '&topicid=&view=ajaxv10';
                var docLink = "https://uat.enwisen.com/asi/Toolset/DownloadPosting.aspx?code=52fdaa5b"
                var req = {
                 method: 'GET',
                 url: docLink,
                 withCredentials: true,
                 responseType: 'arraybuffer'
                }*/

                /*
                $http(req).then(function(response, request){
                    // success function
                    console.log('got pdf document');
                    var base64Data = btoa(response);
                    //var file = new Blob([response], {type: 'application/pdf'});
                    //var fileURL = URL.createObjectURL(file);

                    //$scope.content = $sce.trustAsResourceUrl(fileURL);
                    //$scope.pdfURL = $scope.content = $sce.trustAsResourceUrl(fileURL);
                    //$scope.instance = PDFViewerService.Instance("viewer");
                    //$scope.documentDetail.topicName = $scope.documentLink.name;


                    },
                function(response, request){
                    // error function
                    console.log('document failed');
                });*/

            }
        else
            {
                // this is a html document
                var docLink = 'https://uat.enwisen.com/asi/' + $scope.documentLink.url + '&topicid=&view=ajaxv10';
                var req = {
                 method: 'GET',
                 url: docLink,
                 withCredentials: true
                }

                $http(req).then(function(response, request){
                    // success function
                    console.log('got document');
                    $scope.documentDetail = response.data;
                    traverse(response.data,process);
                    $scope.documentDetail.html = documentText;
                    $scope.documentDetail.html = htmlDecode($scope.documentDetail.html);
                    //$element()
                    document.getElementById('documentBody').innerHTML = $scope.documentDetail.html;

                    },
                function(response, request){
                    // error function
                    console.log('document failed');
                });

            }


        //$window.location = 'https://uat.enwisen.com/asi/Toolset/DownloadPosting.aspx?code=52fdaa5b&topicid=&view=ajaxv10';
       /* var docLink = 'https://uat.enwisen.com/asi/' + $scope.documentLink.url + '&topicid=&view=ajaxv10'; //Toolset/DownloadPosting.aspx?code=52fdaa5b'
        var req = {
         method: 'GET',
         url: docLink,
         withCredentials: true
        }

        $http(req).then(function(response, request){
            // success function
            console.log('got document');
            $scope.documentDetail = response.data;
            var file = new Blob([response], {type: 'application/pdf'});
            var fileUrl = URL.createObjectURL(file);
            $scope.content = $sce.trustAsResourceUrl(fileUrl);

            //$scope.documentDetail.fullUrl = docLink;
            },
        function(response, request){
            // error function
            console.log('document failed');
        });*/
    }

    // initialize via a login
    if ($scope.documentLink)
        {
            $scope.loginInfor(); //$scope.getDocument();
        }


        $scope.nextPage = function() {
            $scope.instance.nextPage();
        };

        $scope.prevPage = function() {
            $scope.instance.prevPage();
        };

        $scope.gotoPage = function(page) {
            $scope.instance.gotoPage(page);
        };

        $scope.pageLoaded = function(curPage, totalPages) {
            $scope.currentPage = curPage;
            $scope.totalPages = totalPages;
        };

        $scope.loadProgress = function(loaded, total, state) {
            console.log('loaded =', loaded, 'total =', total, 'state =', state);
        };


})
.controller('TestController', [ '$scope', '$sce', 'PDFViewerService', function($scope, $sce, pdf) {
	console.log('TestController: new instance');

	//$scope.pdfURL = "test.pdf";
    //$scope.pdfURL = "https://uat.enwisen.com/asi/Toolset/DownloadPosting.aspx?code=52fdaa5b";
    var fileUrl = "https://uat.enwisen.com/asi/Toolset/DownloadPosting.aspx?code=52fdaa5b";

    $scope.pdfURL = $scope.content = $sce.trustAsResourceUrl(fileUrl);
	$scope.instance = pdf.Instance("viewer");

	$scope.nextPage = function() {
		$scope.instance.nextPage();
	};

	$scope.prevPage = function() {
		$scope.instance.prevPage();
	};

	$scope.gotoPage = function(page) {
		$scope.instance.gotoPage(page);
	};

	$scope.pageLoaded = function(curPage, totalPages) {
		$scope.currentPage = curPage;
		$scope.totalPages = totalPages;
	};

	$scope.loadProgress = function(loaded, total, state) {
		console.log('loaded =', loaded, 'total =', total, 'state =', state);
	};
}])
.controller('searchHRController', function( $scope, $state ){

})
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
})
.controller('timeOffAptoController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'APTO Used';
})
.controller('timeOffContingenciesController', function( $scope, $rootScope, $state, $stateParams, EssService ){
	$scope.title_head = 'Contingencies Used';
})

// time statement includes calendar controls
.controller('timeStatementController', function( $scope, $rootScope, $state, $stateParams, $compile, EssService ){

    /*if (!$rootScope.sessionUser) //user not logged in
    {
        $state.go('signin');
    }*/

	$scope.title_head = 'My Time';

    var daysInMonth=[31,28,31,30,31,30,31,31,30,31,30,31];
    var monthNames=['January','February','March','April','May','June',
              'July','August','September','October','November','December'];

    $scope.selectedWeek = 0;
    //$scope.weekRow = 0;

    // this will be used to track the days for a calendar.
    $scope.calendarArray = [];

    $scope.day1Hours = '';
    $scope.day2Hours = '';
    $scope.day3Hours = '';
    $scope.day4Hours = '';
    $scope.day5Hours = '';
    $scope.day6Hours = '';
    $scope.day7Hours = '';
    $scope.totalHours = '';
    $scope.overtimeHours = '';
    $scope.vacationHours = '';
    $scope.firstDay = '';
    $scope.lastDay = '';

    $scope.toggleRow = function(weekRow, monthIn, yearIn)
    {
        if ($scope.selectedWeek == weekRow)
        {
            $scope.selectedWeek = 0;
        }
        else
        {
            $scope.selectedWeek = weekRow;
        }

            $scope.day1Hours = '';
            $scope.day2Hours = '';
            $scope.day3Hours = '';
            $scope.day4Hours = '';
            $scope.day5Hours = '';
            $scope.day6Hours = '';
            $scope.day7Hours = '';
            $scope.totalHours = '';
            $scope.firstDay = '';
            $scope.lastDay = '';

            var calendarRow = document.getElementById('calendar-row'+weekRow);


            // Set all rows .collapsed
            var allCalendarRows = document.getElementsByClassName("time-calendar-week");
            var i;
            for (i = 0; i < allCalendarRows.length; i++) {
              allCalendarRows[i].className = "time-calendar-week collapsed";
            }
            // Set clicked row not .collapsed
            calendarRow.className = "time-calendar-week";


            for (var x = 0; x<calendarRow.children.length; x++)
            {
               if (calendarRow.children[x].innerHTML != "") //we have a value.
               {
                   var day = calendarRow.children[x].innerHTML;
                   var requestedDate = yearIn + '-' + ('0' + ( monthIn +1 )).slice(-2) + '-' + ('0' + day).slice(-2);
                   var hoursWorked = $scope.getTimesheetValue(requestedDate);

                   if (!hoursWorked)
                   {
                    hoursWorked = 0;
                   }

                   if (x == 0)
                   {
                    $scope.day1Hours = hoursWorked;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day1Hours);
                    $scope.firstDay = day;
                    $scope.lastDay = day;
                   }

                   if (x == 1)
                   {
                    $scope.day2Hours = hoursWorked;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day2Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 2)
                   {
                    $scope.day3Hours = hoursWorked;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day3Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 3)
                   {
                    $scope.day4Hours = hoursWorked;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day4Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 4)
                   {
                    $scope.day5Hours = hoursWorked;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day5Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 5)
                   {
                    $scope.day6Hours = hoursWorked;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day6Hours);
                    $scope.lastDay = day;
                       if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }

                   if (x == 6)
                   {
                    $scope.day7Hours = hoursWorked;
                    $scope.totalHours =  parseFloat($scope.totalHours + $scope.day7Hours);
                    $scope.lastDay = day;
                           if ($scope.firstDay == '')
                            $scope.firstDay = day;
                   }
               }
            }


            //$('#time-detail-1').style.display='block';
            /*$('time-detail-1').style.display='none';
            $('time-detail-2').style.display='none';
            $('time-detail-3').style.display='none';
            $('time-detail-4').style.display='none';
            $('time-detail-5').style.display='none';
            $('time-detail-6').style.display='none';*/


    }

    $scope.getTimesheetValue = function(requestedDate)
    {
     var timesheetLength = $rootScope.employeeData.TBL_TIMEOVERVIEW.length;

        for (var x=0; x<timesheetLength; x++)
             {
                 if ($rootScope.employeeData.TBL_TIMEOVERVIEW[x].VALIDITYDATE == requestedDate)
                 {
                     return parseFloat($rootScope.employeeData.TBL_TIMEOVERVIEW[x].REGULARHOURS +
                            $rootScope.employeeData.TBL_TIMEOVERVIEW[x].OVERTIMEHOURS);
                     break;
                 }
             }
     }

    $scope.buildCalendar = function()
    {
            var currentDate = new Date();
            var currentMonth = currentDate.getMonth();
            $scope.month = currentMonth;

            //$scope.month=0;
            var year=2015;
            months=13;

            var calendarHTML = '';
            var dayOfWeek = 1;

            $scope.calendarArray.length = 0;

            for (var i=0; i <months; i++){

                var weekRow = 0;

               // title
               calendarHTML = calendarHTML + '<div id="calendarMonth'+ i + '">' +
                                '<div class="month-picker">' +
                                  '<h3>' + monthNames[$scope.month] + ' ' + year + '</h3>' +
                                '</div>';

              // days of the week
               calendarHTML =  calendarHTML +
                                  '<div class="time-calendar">' +
                                  '<div class="time-calendar-heading">' +
                                    '<span>S</span>' +
                                    '<span>M</span>' +
                                    '<span>T</span>' +
                                    '<span>W</span>' +
                                    '<span>T</span>' +
                                    '<span>F</span>' +
                                    '<span>S</span>' +
                                  '</div>';

              firstDayDate = new Date(year,$scope.month,1);
              firstDay=firstDayDate.getDay();

              for (j=0;j<42;j++)
                {
                    if (j%7 == 0)
                    {
                        weekRow = weekRow + 1;
                        dayOfWeek = 1;
                        calendarHTML = calendarHTML +
                        '<div id="calendar-row' + weekRow + $scope.month + year +
                         '" class="time-calendar-week collapsed" data-toggle="collapse" ' +
                         'ng-click="toggleRow(' + weekRow + $scope.month + year + ',' + $scope.month + ',' + year + ')" data-target="#time-detail-' + weekRow + '">';
                    }

                    var daysinMonth = getDaysInMonth($scope.month,year);

                    if ((j >= firstDay + daysinMonth))
                    {
                      calendarHTML += '<span></span>';
                      dayOfWeek += 1;
                    }
                    else if ((j < firstDay))
                    {
                      calendarHTML += '<span></span>';
                      dayOfWeek += 1;
                    }
                    else
                    {
                        thisDay = (j - firstDay + 1)
                        calendarHTML = calendarHTML +  '<span>' + thisDay + '</span>';
                        dayOfWeek += 1;
                        calendarDate = {};
                        calendarDate.day = thisDay;
                        calendarDate.month = $scope.month;
                        calendarDate.year = year;
                        calendarDate.weekRow = weekRow;
                        calendarDate.dayOfWeek = dayOfWeek;
                        $scope.calendarArray.push(calendarDate);

                        /*document.write('<td class="calendarDay" '
                          +'onClick="dateClicked('
                          +(j-firstDay+1)+','+(month+1)+','+year+')">'
                          +(j-firstDay+1)+'');*/
                    }

                    if (j%7==6)
                    {
                        calendarHTML = calendarHTML +  '</div>'; // end of the week

                        //now show hours worked during that week.
                        calendarHTML = calendarHTML +
                             '<div id="time-detail-' + weekRow + $scope.month + year +
                                '" ng-show="selectedWeek == ' + weekRow + $scope.month + year + '">' +
                                '<div class="time-calendar-values time-calendar-values-worked">' +
                                  '<span>{{day1Hours}}</span>' +
                                  '<span>{{day2Hours}}</span>' +
                                  '<span>{{day3Hours}}</span>' +
                                  '<span>{{day4Hours}}</span>' +
                                  '<span>{{day5Hours}}</span>' +
                                  '<span>{{day6Hours}}</span>' +
                                  '<span>{{day7Hours}}</span>' +
                                '</div>' +
                                '<div class="time-calendar-values time-calendar-values-scheduled">' +
                                  '<span><small>of</small> {{day1Hours}}</span>' +
                                  '<span><small>of</small> {{day2Hours+1.25}}</span>' +
                                  '<span><small>of</small> {{day3Hours+1.25}}</span>' +
                                  '<span><small>of</small> {{day4Hours+1.25}}</span>' +
                                  '<span><small>of</small> {{day5Hours+1.25}}</span>' +
                                  '<span><small>of</small> {{day6Hours+1.25}}</span>' +
                                  '<span><small>of</small> {{day7Hours}}</span>' +
                                '</div>' +
                                '<div class="time-calendar-detail">' +
                                  '<h4 class="time-calendar-detail-heading">' + monthNames[$scope.month]+ ' {{firstDay}} - {{lastDay}}</h4>' +
                                  '<dl class="time-calendar-detail-text">' +
                                    '<dt>Scheduled</dt><dd>{{totalHours+6.25}} hours</dd>' +
                                    '<dt>Actual</dt><dd>{{totalHours}} hours</dd>' +
                                    '<dt>Overtime</dt><dd>2.33 hours</dd>' +
                                  '</dl>' +
                                  '<button type="button" class="md-button" md-ripple-size="full">Week Summary</button>' +
                                  '<button type="button" class="md-button" md-ripple-size="full">Payslip</button>' +
                                '</div>' +
                              '</div>';

                    }
              }

              calendarHTML = calendarHTML +   '</div></div>';  //end of the month.
              $scope.month++; // go to next month.
              if ($scope.month>=12){
                $scope.month=0;
                year++;
              }
            }

        var $calendar = $('#calendar');
        $('#calendar').html(calendarHTML);
        $compile($calendar)($scope);
        //document.getElementById('calendar').innerHTML = calendarHTML;
        console.log(calendarHTML);
    }

      // Returns the number of days in the month in a given year (January=0)
      var getDaysInMonth = function getDaysInMonth(month,year){
        if ((month==1)&&(year%4==0)&&((year%100!=0)||(year%400==0))){
          return 29;
        }else{
          return daysInMonth[month];
        }
      }

      // Performs an action when a date is clicked
      var dateClicked = function dateClicked(day,month,year){
        document.forms.calendar.date.value=
           month+'/'+day+'/'+year; // American
          //day+'/'+month+'/'+year;    // European
          // year+'/'+month+'/'+day' // Far Eastern
      }

      // Sets the displayed month
      var setDisplayedMonth = function setDisplayedMonth(month){

        $scope.selectedWeek = 0;
        if (month < 0){
            $scope.showAlert('Info', 'You have reached the beginning of this calendar');
           //alert('You have reached the beginning of this calendar');
        }else if ($scope.month>=months){
            $scope.showAlert('Info', 'You have reached the end of this calendar');
           //alert('You have reached the end of this calendar');
        }else{
          for (var i=0;i<months;i++){
            document.getElementById('calendarMonth'+i).style.display='none';
          }
            document.getElementById('calendarMonth'+month).style.display='block';
        }
      }

      // Sets the displayed month
      $scope.nextMonth = function()
      {
          if ($scope.month != months)
          {
              $scope.month = $scope.month+1;
              setDisplayedMonth($scope.month)
          }
      }

      // Sets the displayed month
      $scope.prevMonth = function()
      {
          $scope.month = $scope.month-1;
          setDisplayedMonth($scope.month)
      }

    $scope.buildCalendar();
    // initialize displayed month.

    //var currentDate = new Date();
    //var currentMonth = currentDate.getMonth();
    $scope.month = 12;
    setDisplayedMonth(12);
});


// getting dom elements
//your object
var o = {
    foo:"bar",
    arr:[1,2,3],
    subo: {
        foo2:"bar2"
    }
};
var foundText = false;
var documentText = "";

function htmlDecode(value) {
    return $('<div/>').html(value).text();
}

//called with every property and it's value
function process(key,value) {

    if (foundText == true)
        {
            console.log(key + " : "+ value);
            documentText += value;
            foundText = false;
        }

    if (key == 'className' && value == 'sw-text ')
        {
           foundText = true;
            //console.log(key + " : "+value);
        }

}

function traverse(o,func) {
    for (var i in o) {
        func.apply(this,[i,o[i]]);
        if (o[i] !== null && typeof(o[i])=="object") {
            //going on step down in the object tree!!
            traverse(o[i],func);
        }
    }
}

function renderPDF(url, canvasContainer, options) {
    var options = options || { scale: 1 };

    function renderPage(page) {
        var viewport = page.getViewport(options.scale);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var renderContext = {
          canvasContext: ctx,
          viewport: viewport
        };

        canvas.height = viewport.height;
        canvas.width = viewport.width;
        canvasContainer.appendChild(canvas);

        page.render(renderContext);
    }

    function renderPages(pdfDoc) {
        for(var num = 1; num <= pdfDoc.numPages; num++)
            pdfDoc.getPage(num).then(renderPage);
    }
    PDFJS.disableWorker = true;
    PDFJS.getDocument(url).then(renderPages);
}
