// Material Cordova
// angular.module is a global place for creating, registering and retrieving Angular modules
var app = angular.module( 'eServices',
[ 'ngMaterial',
    'ui.router',
    'ngCordova',
    'ess.controllers',
    'ess.dashboardcontroller',
    'ess.logincontroller',
    'ess.timecontroller',
    'ess.bankingcontroller',
    'ess.paycontroller',
    'ess.addresscontroller',
    'ess.timeoffcontroller',
    'ess.askhrcontroller',
    'ess.w4controller',
    'ess.attendancepointscontroller',
    'ess.schedulecontroller',
    'ess.profilecontroller',
    'ess.services',
    'ngStorage',
    'ngSanitize',
    'ngPDFViewer' ] )
/*app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('pink')
    .accentPalette('orange');
});*/
//app run getting device id
app.run(function ($rootScope, $window, myPushNotification) {

        // use device ready event to trigger mixpanel initialization
        // may not need it as it is done later.
        console.log('app run');
        document.addEventListener("deviceready", function () {
            //alert('device ready');
            //mixpanel.init("693473250cb92fbd9bd8e40f49227c6a"); // myBMW eServices
            //console.log('initialized mixpanel');
            //alert('initialized mixpanel');
            //mixpanel.track("BMW Angular is ready to be tracked");
            //console.log('triggered event');
            //alert('triggered event');
            // then override any default you want
            cordova.getAppVersion.getVersionNumber().then(function (version) {
              $rootScope.appVersion = version;
          });

          // initialize hockey app for testing and deployment
          hockeyapp.start(null, null, "cba2edf8a72a46e3b5c86e3f1b839181");
          console.log('hockey app init');

        }, false);

   // variables for root scope
   $rootScope.isConnected = false;
   $rootScope.appVersion;
   $rootScope.employeeData = new Object();
   $rootScope.bankList = new Array();
   $rootScope.userName;
   $rootScope.currentBank = {};
   $rootScope.serverURLCloud = 'http://access.wftcloud.com:8059';
   $rootScope.serverURL = 'http://tmcddi31.bmwgroup.net:8031';
   //http://tmcddi31.bmwgroup.net:8031/sap(bD1lbiZjPTAwMQ==)/bc/bsp/bmw/eservices/index.html#/login

   // default message list...
   $rootScope.messageList =
    [
    {name: "Manufacturing process update", description:"Based on engineering refinement, we will adjust our process for assembling the gear shaft in the following method.  Please follow the new instructions and quality verification that is posted at your work center", author:"Manufacturing", target:"Manufacturing team", priority:"Standard"},
    {name: "BMW cares", description:"We are announcing the global kickoff for our charitable giving campaign.  We encourage all employees and families to make a contribution to their community in any way possible.  Please help out those that are less fortunate and make the world a better place!", author:"Chris Benson", target:"Global employees", priority:"Standard"}
    ];

   $rootScope.browseList = [];
   $rootScope.askHRItems = 0;

	// app device ready
	document.addEventListener("deviceready", function(){
		if(!localStorage.device_token_syt || localStorage.device_token_syt == '-1'){
			myPushNotification.registerPush();
		}

    // setup analytics link
    //mixpanel.init("693473250cb92fbd9bd8e40f49227c6a"); // myBMW eServices
    //console.log('initialized mixpanel');
    //alert('initialized mixpanel');
    //mixpanel.track("BMW eServices is ready to be tracked");


	});
   $rootScope.get_device_token = function () {
      if(localStorage.device_token_syt) {
         return localStorage.device_token_syt;
      } else {
         return '-1';
      }
   }
   $rootScope.set_device_token = function (token) {
      localStorage.device_token_syt = token;
      return localStorage.device_token_syt;
   }

    $rootScope.goBack = function()
    {
     $window.history.back();
    }


});
//myservice device registration id to localstorage
app.service('myService', function($http) {
   this.registerID = function(regID, platform) {
		localStorage.device_token_syt = regID;
		//alert(regID);
   }
});

// main controller -- where we will render web pages here
app.controller('MainCtrl', function($scope, $mdSidenav, $state, $http, $rootScope, $mdDialog, SideBar, myPushNotification){


	//go back function -- go back to revious state
	$scope.goBackSingle = function(){
		window.history.back();
	}

    // basic navigation functions
    $scope.goToDashboard = function(){
        $state.go('dashboard');
	}

   // cancel function
   $scope.cancel = function() {
	  window.history.back();
   };

	// sidebar toggle function
	$scope.toggleSidenav = function(menuId) {
		$mdSidenav(menuId).toggle();
	};
	// array menu sidebar
	$scope.links = SideBar.items;
	// swipe left to close sidebar menu
	$scope.onSwipeLeftMenu = function(){
		$scope.toggleSidenav('left');
	}
    /*
	// open link items from side bar -- close menu on link click
	$scope.openLinkMaterial = function(index){
		$scope.toggleSidenav('left');
		$scope.selectedLink = $scope.links[index].datahref;
		$state.go($scope.selectedLink);
	}
	// sharing plugin
	$scope.shareMain = function(){
		var title = "Download Smove For Android";
		var url = "https://play.google.com/store/apps/details?id=com.myspecialgames.swipe";
		window.plugins.socialsharing.share(title, null, null, url)
	}*/

    $scope.isLoading = false;
    var alert;
    $scope.showAlert = function(title, message)
    {
          alert = $mdDialog.alert({
            title: title,
            content: message,
            ok: 'Close'
          });
          $mdDialog
            .show( alert )
            .finally(function() {
              alert = undefined;
            });
    }

      $scope.hide = function() {
        $mdDialog.hide();
      };
      $scope.cancel = function() {
        $mdDialog.cancel();
      };
      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };

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
            console.log('Infor log in failed');
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
    // use this when we are ready for inforLogin
    //$scope.loginInfor();

});

/*
home page -- feed page --
a demo page similar to latest news page of a social media app
just a sample design with like box and comment
*/
/*
app.controller('HomeCtrl', function($scope, HomeFeeds, $state){

	// setting heading of page
	$scope.title_head = 'Home';
	// define posts
	$scope.posts = [];
	// get posts function -- should modify here according to your needs
	$scope.getPosts = function(){
		HomeFeeds.getPosts()
		.success(function (posts) {
			$scope.posts = $scope.posts.concat(posts);
			HomeFeeds.posts = $scope.posts
		})
		.error(function (error) {
			$scope.posts = [];
		});
	}
	// calling get posts -- on page load
   $scope.getPosts();
	// a demmo like button -- to shoe case how you can implement in it --
	$scope.liked = true;
	// like post function
	$scope.likeThisPost = function(status){
		if(status == true){
			$scope.liked = false;
		} else {
			$scope.liked = true;
		}
	}
	// function to navigate to post --
	// getting index of array and redirecting post
	$scope.showPost = function(index){
		$state.go('post',{
			Id:index
		});
	}
});
*/

/*
// single post page
app.controller('PostCtrl', function( $scope, $state, $stateParams, HomeFeeds, Comments, $anchorScroll ){
	// getting post id from Id stateParams
	var postId = $stateParams.Id;
	// user
	$scope.user = [];
	// posts
	$scope.posts = [];
	// comments
	$scope.comments = [];
	// setting user name and profile image -- should do it dynamically in your app
	$scope.user.username = 'Admin';
	$scope.user.userImage = 'img/profile.jpg';
	//getting comments of a photo /
	$scope.getComments = function(id){
		Comments.getComments()
		.success(function (comments) {
			$scope.comments = $scope.comments.concat(comments);
		})
		.error(function (error) {
			$scope.comments = [];
		});
	}
	// photos from temperory url //
	$scope.getPosts = function(){
		HomeFeeds.getPosts()
		.success(function (posts) {
			$scope.posts = $scope.posts.concat(posts);
			// selecting a particular post from posts json data
			// we recommend to you to fetch details from server using a key
			// cache or saving data in a scope variable will also be fine
			$scope.myPost = $scope.posts[postId];
			$scope.title_head = $scope.myPost.title;
			// getting comments -- demo comments -- postId here is not using
			$scope.getComments(postId);
		})
		.error(function (error) {
			$scope.posts = [];
		});
	}
   $scope.getPosts();
	// go to profile function
	$scope.goToProfile = function(){
		$state.go('profile');
	}
	$scope.liked = true;
	$scope.likeThisPost = function(status){
		if(status == true){
			$scope.liked = false;
		} else {
			$scope.liked = true;
		}
	}
	// always keep content at top -- avoding scroll issues
  	$anchorScroll();
});


// sign up controller
app.controller('ProfileCtrl', function( $scope, $state ){
	// its all demo data
  	$scope.phones = [
      { type: 'Home', number: '(555) 251-1234' },
      { type: 'Cell', number: '(555) 786-9841' },
   ];
	$scope.Emails = [
      { type: 'Office', number: 'admin@skyafar.com' },
      { type: 'Personal', number: 'info@skyafar.com' },
		{ type: 'Support', number: 'weblogtemplatesnet@gmail.com' },
   ];
});
// photos controller grid -- how it will look
app.controller('PhotosCtrl', function( $scope, $state, Photos ){
  	$scope.posts = [];
	$scope.title_head = 'Photos';
	$scope.getPosts = function(){
		Photos.getPosts()
		.success(function (posts) {
			$scope.posts = $scope.posts.concat(posts);
		})
		.error(function (error) {
			$scope.posts = [];
		});
	}
   $scope.getPosts();
	$scope.navigateToPhoro = function(index){
		$state.go('photo',{Id:index});
	}
});
// single photos page
app.controller('PhotoCtrl', function( $scope, $state, $stateParams, Photos, Comments ){

	var photoId = $stateParams.Id;
	$scope.user = [];
	$scope.posts = [];
	$scope.comments = [];

	$scope.user.username = 'Admin';
	$scope.user.userImage = 'img/profile.jpg';
	// getting comments of a photo //
	$scope.getComments = function(id){
		Comments.getComments()
		.success(function (comments) {
			$scope.comments = $scope.comments.concat(comments);
		})
		.error(function (error) {
			$scope.comments = [];
		});
	}
	// photos from temperory url //
	$scope.getPosts = function(){
		Photos.getPosts()
		.success(function (posts) {
			$scope.posts = $scope.posts.concat(posts);
			$scope.myPost = $scope.posts[photoId];
			$scope.title_head = $scope.myPost.title;
			$scope.getComments(photoId);
		})
		.error(function (error) {
			$scope.posts = [];
		});
	}
   $scope.getPosts();

	$scope.goToProfile = function(){
		$state.go('profile');
	}
	$scope.liked = true;
	$scope.likeThisPost = function(status){
		if(status == true){
			$scope.liked = false;
		} else {
			$scope.liked = true;
		}
	}

});
// show ad mob here in this page
app.controller('AdmobCtrl', function($scope, ConfigAdmob){
	// if admob create and show admob banner
	$scope.title_head = 'Admob';
	if(AdMob) {
		// show admob banner ad
		AdMob.createBanner( {
			adId: ConfigAdmob.banner,
			position: AdMob.AD_POSITION.BOTTOM_CENTER,
			autoShow: true
		} );
		// preparing admob interstitial ad
		AdMob.prepareInterstitial( {
			adId:ConfigAdmob.interstitial,
			autoShow:false
		} );
	}
	// show admob Interstitial ad
	$scope.showInterstitial = function(){
		if(AdMob) AdMob.showInterstitial();
	}
});
// friends listing page
app.controller('FriendsCtrl', function( $scope, $state, Friends ){
  	$scope.friends = [];
	$scope.title_head = 'Friends';
	$scope.getPosts = function(){
		Friends.getFriends()
		.success(function (posts) {
			$scope.friends = $scope.friends.concat(posts);
		})
		.error(function (error) {
			$scope.friends = [];
		});
	}
   $scope.getPosts();
});
// sample form listing page
app.controller('FormsCtrl', function( $scope, $state, Forms ){
	$scope.title_head = 'Forms';
	$scope.forms = Forms;
});
// sample login form -- example
app.controller('LoginSampleCtrl', function( $scope ){
	$scope.title_head = 'Login';
});
// sample register form -- example
app.controller('RegisterSampleCtrl', function( $scope ){
	$scope.title_head = 'Register';
});
// comment form -- example
app.controller('CommentFormCtrl', function( $scope ){
	$scope.title_head = 'Comment';
});
// a sticky simple comment form -- example
app.controller('CommentFormFooterCtrl', function( $scope ){
	$scope.title_head = 'Comment';
});
//contact form controller -- real example
app.controller('ContactCtrl', function($scope, ConfigContact) {

	$scope.title_head = 'Contact Us';
	$scope.user = [];
	// contact form submit event
	$scope.submitForm = function(isValid) {
		if (isValid) {
			cordova.plugins.email.isAvailable(
				function (isAvailable) {
					window.plugin.email.open({
						to:      [ConfigContact.EmailId],
						subject: ConfigContact.ContactSubject,
						body:    '<h1>'+$scope.user.email+'</h1><br><h2>'+$scope.user.name+'</h2><br><p>'+$scope.user.details+'</p>',
						isHtml:  true
					});
				}
			);
		}
	}
})
// a sticky simple comment form -- example
app.controller('FormWithEverythingCtrl', function( $scope ){
	$scope.title_head = 'Sample Form';
});
// a sticky simple comment form -- example
app.controller('FormTitleSaveCtrl', function( $scope, $mdToast, $animate ){

	$scope.title_head = 'Title Bar Save';
	$scope.toastPosition = {
    	bottom: false,
    	top: true,
    	left: false,
    	right: true
  	};
	$scope.getToastPosition = function() {
  		return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  	};
  	$scope.showCustomToast = function() {
    	$mdToast.show({
      	controller: 'ToastCtrl',
      	templateUrl: 'templates/partials/toast-template.html',
      	hideDelay: 6000,
      	position: $scope.getToastPosition()
    	});
  	};

});
// a toast controller
app.controller('ToastCtrl', function($scope, $mdToast) {
  $scope.closeToast = function() {
    $mdToast.hide();
  };
});
// push controller
app.controller('PushCtrl', function($scope, SendPush){

	$scope.title_head = 'Test Push Notification';
	$scope.device_token = $scope.get_device_token();
	$scope.sendNotification = function(){
		SendPush.android($scope.device_token)
		.success(function () {
		})
		.error(function (error) {
		});
	}
});
// camera controller
app.controller('CameraCtrl', function( $scope, Camera ) {
	$scope.imageCamera = '';
	$scope.title_head = 'Camera';
	$scope.type_file = 'camera';
	$scope.getPhoto = function () {
      Camera.getPicture(2).then(function (imageURI) {
			$scope.imageCamera = imageURI;
      }, function (err) {
         alert(err);
      });
   }
});
// camera controller
app.controller('CameraFileCtrl', function( $scope, Camera ) {
	$scope.imageCamera = '';
	$scope.title_head = 'File Uploader';
	$scope.type_file = 'file';
	$scope.getPhoto = function () {
      Camera.getPicture(1).then(function (imageURI) {
			$scope.imageCamera = imageURI;
      }, function (err) {
         alert(err);
      });
   }
});
/*
//

/* This file contains all functions that execute outside of the application controller */

function EM_Linklist_FetchTopic(tabId, code, topicid) {
	var controller = EnwisenMobile.app.getController(tabId == 'Browse' ? 'Browse' : 'Search');
	var activeId   = controller.getMainView().getActiveItem().getId();
	var idx        = 0;
	controller.getMainView().getItems().each(function(i) {
		if (i.getId() == activeId) {
			return false;
		} else { idx++; }
	}, this);
	console.log(code +':'+topicid);
	try {
	controller.fetchTopic(controller, '', code, topicid, null, idx);
	} catch(exception) {console.log(exception);}
}

function EM_Linklist_FetchPDF(tabId, name, code) {
	EnwisenMobile.app.getController('Main').historyStoreAddView('pdfview', Ext.encode({ name: name, code: code }));
	EnwisenMobile.app.getController(tabId == 'Browse' ? 'Browse' : 'Search').showPDF(name, code);
}

function EM_Linklist_Flyout(tabId, s) {
	var controller = EnwisenMobile.app.getController(tabId == 'Browse' ? 'Browse' : 'Search');
	var activeId   = controller.getMainView().getActiveItem().getId();
	var idx        = 0;
	controller.getMainView().getItems().each(function(i) {
		if (i.getId() == activeId) {
			return false;
		} else { idx++; }
	}, this);

	s = s.split('&');
	var links = [];
	Ext.each(s, function(l) {
		var t = unescape(l).split('|');
		links[links.length] = {
			name:		t[0],
			code:		t[1],
			topicid:	t[2]
		};
	});
	var data  = [{
		text:	EM_MSG_IIQL_TOPICS_FLYOUT,
		value:	-1
	}];
	Ext.each(links, function(lnk) {
		data[data.length] = {
			text:	lnk.name,
			value:	data.length-1
		}
	});
	var picker = Ext.create('Ext.Picker', {
		doneButton:	{
			handler:	function() {
				picker.hide();
				var idx = picker.getValues().idx;
				Ext.Viewport.remove(picker);
				if (idx != null && idx >=0) {
					var tmp = links[idx];
					controller.fetchTopic(controller, tmp.name, tmp.code, tmp.topicid, null, idx);
				}
			}
		},
		cancelButton: {
			handler:	function() {
				Ext.Viewport.remove(picker);
			}
		},
		slots:	[{
			name:	'idx',
			data:	data
		}]
	});
	Ext.Viewport.add(picker);
	picker.show();
}


/************* The following is for Ask HR **************/
/*
 *  According to offshore, we need to use a function named "encodeSwE5" from the file
 *      /asi/Scripts/Smartware/V3-14/Form/X3e_ExtSwBase.js
 *  to encode the data before sending to the server. We need to encode data when
 *      1) adding new note (cm 5.0)
 *      2) adding new case (both cm 4.4 and 5.0)
 *  however, the file above will generate error when loaded with Sencha Touch which
 *  will prevent the client from sending data to the server. Therefore, I extracted
 *  the code from the file and put it here.
 *  -- we need to fix this
 */
var swE5Str;
var swE5Count;
var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encodeSwE5(s) {
    setSwE5Str(s);
    var strVH;
    strVH = sw4(encode(s).toString());
    var strRes = sw3(strVH).toString();
    return strRes;
}

function setSwE5Str(str) {
    swE5Str = str;
    swE5Count = 0;
}

function encode(input) {
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = utf8_encode(input);
    while(i < input.length) {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);
        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;
        if(isNaN(chr2)) {
            enc3 = enc4 = 64;
        } else if(isNaN(chr3)) {
            enc4 = 64;
        }
        output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
    }
    return output;
}

function utf8_encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";
    for(var n = 0; n < string.length; n++) {
        var c = string.charCodeAt(n);
        if(c < 128) {
            utftext += String.fromCharCode(c);
        } else if((c > 127) && (c < 2048)) {
            utftext += String.fromCharCode((c >> 6) | 192);
            utftext += String.fromCharCode((c & 63) | 128);
        } else {
            utftext += String.fromCharCode((c >> 12) | 224);
            utftext += String.fromCharCode(((c >> 6) & 63) | 128);
            utftext += String.fromCharCode((c & 63) | 128);
        }
    }
    return utftext;
}

function sw4(strVH) {
    var intIndexOfMatch = strVH.indexOf('\n');
    while(intIndexOfMatch != -1) {
        strVH = strVH.replace('\n', '');
        intIndexOfMatch = strVH.indexOf('\n');
    }
    return strVH;
}

function sw3(str) {
    var counter = 0, result = '', modValue, limit;
    modValue = str.length % 2;
    if(modValue == 1) {
        limit = str.length - 3;
    } else {
        limit = str.length - 2;
    }
    while(counter <= limit) {
        if(counter % 4 == 0) {
            result += str.charAt(counter + 2).toLowerCase();
        }
        result += str.charAt(counter + 1);
        result += str.charAt(counter);
        counter += 2;
    }
    if(modValue == 1) {
        result += str.charAt(counter);
    }
    str = result;
    return str;
}

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
