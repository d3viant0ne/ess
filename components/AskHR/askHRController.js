/**
 * Controllers for the Ask HR 
 */
angular.module('ess.askhrcontroller', [])

// ask hr controller
.controller('askHRDashboardController', function( $scope, $state ){

})

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

});
