'use strict';
angular.module('ess.services', [])
    .factory('EssService', function ($q, $rootScope, $http, $localStorage, $state) {

		var header_xcsrf_token = "";
		var cookie = "";

        var saveSuccess = function saveSuccess(result)
                {
                    console.log('save successful');
                    return result;
                }

        var saveFailure = function saveFailure(result)
                {
                    alert('error happened');
                    //showMessage('Error',  result.data.RETURN.MESSAGE);
                }

		var parseJSDateToString = function parseJSDateToString(jsDate)
		{

			if (!jsDate)
			{
			 return; //if there is no date, then return.
			}

			var jsDateString = ('0' + (jsDate.getMonth()+1)).slice(-2) + '/'
								 + ('0' + jsDate.getDate()).slice(-2) + '/' +
								(jsDate.getFullYear());
			return jsDateString;
		}

		var parseJSDateToSAPDate = function parseJSDateToSAPDate(jsDate)
		{
			if (!jsDate)
			{
			 return; //if there is no date, then return.
			}

			var SAPDateString = (jsDate.getFullYear() + ('0' + (jsDate.getMonth()+1)).slice(-2) +
								 + ('0' + jsDate.getDate()).slice(-2));
			return SAPDateString;
		}

        // actual service
        var essService =
               {

                init: function () {

                },

                ping: function () {
                    // checks for network connectivity.
                    var userName = $rootScope.userName; //'JONESM'; //access.wftcloud.com
                    var serverURL = $rootScope.serverURL;

                    // try the bmw network.

                    userName = 'QT19684';
                    var serviceUri = serverURL + '/sap/bc/zeservices_srv/|BMW|EHS_ESERVICE_HEALTHCHECK?format=json&sap-client=001'
                    //http://eccehp7tt.wftus.com:8059/sap/bc/zeasyess?sap-client=800

                    var promise = $http.get(serviceUri).then(function (response) {
                            $rootScope.isConnected = true;
                            return true;
                          },
                          function(reason)
                          {
                            $rootScope.isConnected = false;
                            return false;
                          });
                     // Return the promise to the controller
                     return promise;
                    // }
                },

                login: function(userName)
                {
                    //var userName = $rootScope.userName; //'JONESM'; //access.wftcloud.com

                },

                synchEmployee: function(userName)
                {
                    var userName = $rootScope.userName; //'JONESM'; //access.wftcloud.com
                    var serverURL = $rootScope.serverURL;

                    // try the bmw network.
                    if ($rootScope.isConnected == true)
                    {
                  // get real data, override if needed
                        if (!userName)
                        {
                         userName = 'XXXXXX';
                        }

                      var serviceUri = serverURL + '/sap/bc/zeservices_srv/|BMW|EHS_ESERVICE_EMP_READ?USERNAME=' + userName + '&format=json&sap-client=001'
                    }
                    else { //test data

                    if (!userName)
                        {
                          userName = 'XXXXXX';
                        }
                        //var serviceUri = 'https://dl.dropboxusercontent.com/u/74710899/BMW%20Test%20Data/testData.json';
                          var serviceUri = 'data/testData.json';
                    }

                      // get data from service
                      var promise = $http.get(serviceUri).then(function (response) {
                              // The then function here is an opportunity to modify the response
                              console.log(response);
                              // The return value gets picked up by the then in the controller.
                              $rootScope.employeeData = response.data;
                              $rootScope.employeeData.EMPLOYEE_PHOTO_URI = 'img/avatar.jpg';
                              //$rootScope.employeeData.EMPLOYEE_PHOTO_URI = 'http://access.wftcloud.com:8059/sap/bc/contentserver/800?get&pVersion=0046&contRep=MA&docId=0018FE7972821EE0B3BA08926E988803&compId=data';
                              $localStorage.employeeData = $rootScope.employeeData; //copy to local storage
                              return $rootScope.employeeData;
                            });
                       // Return the promise to the controller
                       return promise;


                  // }
                },
                 synchBankList: function()
                {
                    var userName = $rootScope.userName; //'JONESM'; //access.wftcloud.com
                    var serverURL = $rootScope.serverURL;
                    var serviceUri = serverURL + "/sap/bc/zeasyess/BAPI_BANK_GETLIST?BANK_CTRY=US&format=json&sap-client=800";
                    var promise = $http.get(serviceUri).then(function (response) {
                            // The then function here is an opportunity to modify the response
                            console.log(response);
                            // The return value gets picked up by the then in the controller.
                            $rootScope.bankList.length = 0;
                            $rootScope.bankList = response.data;
                            $localStorage.bankList = $rootScope.bankList; //copy to local storage
                            return $rootScope.bankList;
                          });
                     // Return the promise to the controller
                     return promise;
                  // }
                },

                synchTimeStatement: function()
                {
                    var userName = 'JONESM'; //access.wftcloud.com
                    var serverURL = $rootScope.serverURL;
                    var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_EMP_GETDETAIL?USERNAME=" + userName + "&format=json&sap-client=800";

                    //http://eccehp7tt.wftus.com:8059/sap/bc/zeasyess?sap-client=800

                    var promise = $http.get(serviceUri).then(function (response) {
                            // The then function here is an opportunity to modify the response
                            console.log(response);
                            // The return value gets picked up by the then in the controller.
                            $rootScope.employeeTimeStatement = response.data;
                            $localStorage.employeeTimeStatement = $rootScope.employeeTimeStatement; //copy to local storage
                            return $rootScope.employeeTimeStatement;
                          });
                     // Return the promise to the controller
                     return promise;
                },
                 getPayStatementDetails: function(statementId)
                {
                  // this is not needed as this data is all loaded at the beginning.
                    var serverURL = $rootScope.serverURL;
                    //var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_PAYSLIP_GETDETAIL?EMPLOYEENUMBER="
                    //+ $rootScope.employeeData.EMPLOYEE_DETAIL.EMPLOYEENUMBER +
                    //    "&PAYROLLNUMBER=" + statementId + "&format=json&sap-client=800";
                    var serviceUri = serverURL + '/sap/bc/zeservices_srv/|BMW|EHS_ESERVICE_PAYSTMT_DETL?EMPLOYEENUMBER='
                    + $rootScope.employeeData.EMPLOYEE_DETAIL.EMPLOYEENUMBER +
                        "&PAYROLLNUMBER=" + statementId + "&format=json&sap-client=001";

                    var promise = $http.get(serviceUri).then(function (response) {
                            // The then function here is an opportunity to modify the response
                            console.log(response);
                            // The return value gets picked up by the then in the controller.
                            return response.data;
                          });
                     // Return the promise to the controller
                     return promise;
                },
                getCSRFToken: function getCSRFToken(nextFunction, data)
                {
                        var serverURL = $rootScope.serverURL;
                        var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_TOKEN?format=json&sap-client=800"

                        // first we will read the token, we will do a dummy read to fetch the token first...
                        OData.request
                        ({
                        requestUri: serviceUri,
                        method: "GET",
                        headers:
                        {
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/atom+xml",
                        "DataServiceVersion": "2.0",
                        "X-CSRF-Token":"Fetch"
                        }

                        },

                        function (data, response)
                        {
                            alert('received');
                            //header_xcsrf_token = response.headers['x-csrf-token'];
                             //nextFunction(data); // call step 2 since we have the token now.
                        }
                    );
                    /*var serverURL = $rootScope.serverURL;
                    var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_TOKEN?format=json&sap-client=800";

                       var req = {
                            method: 'GET',
                            url: serviceUri,
                            headers:  {
                                "X-Requested-With": "XMLHttpRequest",
                                "Content-Type": "application/atom+xml",
                                "DataServiceVersion": "2.0",
                                "X-CSRF-Token":"Fetch"
                            }
                        };

                    var promise = $http(req).then(function (response) {
                            // The then function here is an opportunity to modify the response
                            console.log(response);
                        //header_xcsrf_token = response.headers['x-csrf-token'];
                            return;
                          });
                     // Return the promise to the controller
                     return promise;*/
                },

                saveAddressUpdate: function(addressData)
                {

                    var serverURL = $rootScope.serverURL;
                    var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_ADDRESS_CHANGE";
                    var requestURL = serviceUri;

                    var today = new Date();
                    addressData.VALIDITYBEGIN = parseJSDateToSAPDate(today); //'20160328'; //YYYYMMDD
                    addressData.VALIDITYEND = '99991231'; //YYYYMMDD

                       var newData = {
                        "EMPLOYEENUMBER": addressData.EMPLOYEENO,
                        "ADDRESSTYPE": addressData.ADDRESSTYPE,
                        "VALIDITYBEGIN": addressData.VALIDITYBEGIN,
                        "VALIDITYEND": addressData.VALIDITYEND,
                        "STREETANDHOUSENO": addressData.STREETANDHOUSENO,
                        "SCNDADDRESSLINE": addressData.SCNDADDRESSLINE,
                        "CITY": addressData.CITY,
                        "POSTALCODECITY": addressData.POSTALCODECITY,
                        "STATE": addressData.STATE   // in sap format YYYYMMDD - in local shipment
                        };

                        var config = {headers:  {
                                //'Accept': 'application/json;odata=verbose'
                            }
                        };
                 var promise = $http.post(requestURL, newData, config).then(saveSuccess, saveFailure);

                 // Return the promise to the controller
                 return promise;
                },

                saveBankUpdate: function(bankData)
                {
                    var serverURL = $rootScope.serverURL;
                    var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_BANK_CHANGE";
                    var requestURL = serviceUri;

                    var today = new Date();
                    bankData.VALIDITYBEGIN = parseJSDateToSAPDate(today); //'20160328'; //YYYYMMDD
                    bankData.VALIDITYEND = '99991231'; //YYYYMMDD

                       var newData = {
                        "EMPLOYEENUMBER": bankData.EMPLOYEENO,
                        "VALIDITYBEGIN": bankData.VALIDITYBEGIN,
                        "VALIDITYEND": bankData.VALIDITYEND,
                        "BANKTYPE": bankData.BANKTYPE,
                        "PAYMENTMETHOD": bankData.PAYMENTMETHOD,
                        "PAYEE": bankData.PAYEE,
                        "PAYEESTREET": bankData.PAYEESTREET,

                        "PAYEEPOSTALCODECITY": bankData.PAYEEPOSTALCODECITY,
                        "PAYEECITY": bankData.PAYEECITY,
                        "PAYEEREGION": bankData.PAYEEREGION,
                        "BANKCOUNTRY": bankData.BANKCOUNTRY,
                        "BANKKEY": bankData.BANKKEY,
                        "ACCOUNTNO": bankData.ACCOUNTNO,
                        "BANKREFERENCE": bankData.BANKREFERENCE,

                        "STANDARDVALUE": bankData.STANDARDVALUE,
                        "CURRENCY": bankData.CURRENCY,
                        "STANDARDPERCENT": bankData.STANDARDPERCENT,
                        "CHECKDIGIT": bankData.CHECKDIGIT,
                        "CONTROLKEY": bankData.CONTROLKEY,
                        "PURPOSE": bankData.PURPOSE,
                        "DEBIT": bankData.DEBIT,
                        "STANDARDVALUECURR": bankData.STANDARDVALUECURR,
                        "IBAN": bankData.IBAN,
                        "ACTION": bankData.ACTION
                        };

                        var config = {headers:  {
                                //'Accept': 'application/json;odata=verbose'
                            }
                        };
                        var promise = $http.post(requestURL, newData, config).then(
                            saveSuccess,
                            saveFailure);

                 // Return the promise to the controller
                 return promise;
                },

                deleteBank: function(bankData)
                {
                    var serverURL = $rootScope.serverURL;
                    var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_BANK_CHANGE";
                    var requestURL = serviceUri;


                       var newData = {
                        "EMPLOYEENUMBER": bankData.EMPLOYEENO,
                        "VALIDITYBEGIN": bankData.VALIDBEGIN,
                        "VALIDITYEND": bankData.VALIDEND,
                        "SUBTYPE_IN": bankData.SUBTYPE,
                        "OBJECTID": bankData.OBJECTID,
                        "LOCKINDICATOR": bankData.LOCKINDIC,
                        "RECORDNUMBER": bankData.RECORDNR,
                        "ACTION": bankData.ACTION
                        };


                        var config = {headers:  {
                                //'Accept': 'application/json;odata=verbose'
                            }
                        };
                        var promise = $http.post(requestURL, newData, config).then(
                            saveSuccess,
                            saveFailure);

                 // Return the promise to the controller
                 return promise;
                },

                synchTimeOff: function()
                {
                    var userName = 'JONESM'; //access.wftcloud.com
                    var serverURL = 'http://access.wftcloud.com:8059';
                    var serviceUri = serverURL + "/sap/bc/zeasyess/ZHR_EASYESS_EMP_GETDETAIL?USERNAME=" + userName + "&format=json&sap-client=800";

                    //http://eccehp7tt.wftus.com:8059/sap/bc/zeasyess?sap-client=800

                    var promise = $http.get(serviceUri).then(function (response) {
                            // The then function here is an opportunity to modify the response
                            console.log(response);
                            // The return value gets picked up by the then in the controller.
                            $rootScope.employeeTimeStatement = response.data;
                            $localStorage.employeeTimeStatement = $rootScope.employeeTimeStatement; //copy to local storage
                            return $rootScope.employeeTimeStatement;
                          });
                     // Return the promise to the controller
                     return promise;
                  // }
                }

            } //end of essService

        return essService;
        }); //end of service
