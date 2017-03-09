// this is left over from the reference app, not used
// feeds
app.factory('HomeFeeds', function($http, Config) {
	var data = {};
	data.getPosts = function () {
		return $http(
			{
				method: 'GET', url:Config.ApiUrl
			}
		);
	}
  	return data;
});
// posts from a demo url
app.factory('Photos', function($http, Config) {
	var data = {};
	data.getPosts = function () {
		return $http(
			{
				method: 'GET', url:Config.PhotoUrl
			}
		);
	}
  	return data;
});
// posts from a demo url
app.factory('Friends', function($http, Config) {
	var data = {};
	data.getFriends = function () {
		return $http(
			{
				method: 'GET', url:Config.FriendsUrl
			}
		);
	}
  	return data;
});
// comments factory -- fetching comments from an api -- just sample api
//
app.factory('Comments', function($http, Config) {
	var data = {};
	data.getComments = function () {
		return $http(
			{
				method: 'GET', url:Config.CommentUrl
			}
		);
	}
  	return data;
});
// push notification push to server
app.factory('SendPush', function($http, Config) {
	var SendPush = {};
	SendPush.android = function(token) {
		return  $http({method: "post", url: 'http://www.skyafar.com/tools/push/push.php',
			data: {
				token: token,
			}
		});
	}
  	return SendPush;
});
app.factory('SideBar', function(){
    var data = {};
    data.items = [
	 	{
			title: 'Home',
			datahref: 'home',
			icon : 'ion-ios-home'
		},
		{
			title: 'Profile',
			datahref: 'profile',
			icon : 'ion-ios-person'
		},
		{
			title: 'Friends',
			datahref: 'friends',
			icon : 'ion-ios-people'
		},
		{
			title: 'Photos',
			datahref: 'photos',
			icon : 'ion-ios-photos'
		},
		{
			title: 'Forms',
			datahref: 'forms',
			icon : 'ion-ios-gear'
		},
		{
			title: 'Contact us',
			datahref: 'contact',
			icon : 'ion-ios-email'
		},
		{
			title: 'Admob',
			datahref: 'admob',
			icon : 'ion-social-usd'
		},
		{
			title: 'Push Notification',
			datahref: 'push',
			icon : 'ion-ios-paperplane'
		}
	];
	return data;
});
app.factory('Forms', function(){
    var data = {};
    data.items = [
        {
            url: 'loginsample',
            name: 'Login',
        },
        {
            url: 'registersample',
            name: 'Register',
        },
        {
            url: 'commentform',
            name: 'Comment Form',
        },
        {
            url: 'commentformfooter',
            name: 'Comment Form Simple',
        },
        {
            url: 'contact',
            name: 'Contact Form',
        },
		  {
            url: 'formwitheverything',
            name: 'Sample Form',
        },
		  {
            url: 'formtitlesave',
            name: 'Title Bar Save',
        },
		  {
            url: 'camera',
            name: 'Form With Camera',
        }

    ];

    return data;
});

app.factory('Camera', ['$q', function($q) {
	return {
		getPicture: function(x,options) {
			var q = $q.defer();
			if(x == 1) {
				var options =   {
					quality: 50,
					sourceType: 0,
					encodingType: 0,
					saveToPhotoAlbum: false
				}
			} else if( x == 2 ){
				var options =   {
					quality: 50,
					saveToPhotoAlbum: false
        		}
			}
			navigator.camera.getPicture(function(result) {
				q.resolve(result);
			}, function(err) {
				q.reject(err);
			}, options);
			return q.promise;
		}
	}

}]);
app.factory('myPushNotification', function ($http, PushNoti) {
  return {
		registerPush: function(fn) {
			var myPushNotification = window.plugins.pushNotification,
			successHandler = function(result) {
				 //alert('result = ' + result);
			},
			errorHandler = function(error) {
				 //alert('error = ' + error);
			};
			if (device.platform == 'android' || device.platform == 'Android') {
				// myPushNotification.unregister(successHandler, errorHandler);
				myPushNotification.register(successHandler, errorHandler, {
					 'senderID': PushNoti.senderID, // **ENTER YOUR SENDER ID HERE**
					 'ecb': 'onNotificationGCM'
				});
		  }
		}
  };
});
