'use strict';
app.factory('authService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout','ngAuthSettings','localStorageService', function (Base64, $http, $cookieStore, $rootScope, $timeout,ngAuthSettings,localStorageService) {

  var serviceBase = ngAuthSettings.apiServiceBaseUri;

  /*BASIC AUTH*/
  var service = {};

  service.logOut = function () {

   $rootScope.globals.currentUser.isAuth = false;
   $rootScope.globals.currentUser.username = "";
   $rootScope.globals.currentUser.authdata = "";
   $rootScope.globals.currentUser.ssn = "";

  };

  service.getUserInfo = function(usr){
    var email = usr;

    return $http.get(serviceBase + 'api/customers/info/' + email + '/').success(function (results) {
      localStorageService.set('customerInfo', {ssn: results.ssn, id: results.id, address: results.address, postalCode: results.postalCode, city: results.city, corpEmail: results.userCorpEmail, phone: results.userPhoneMobile,fullName:results.userName});
    });
  };

  service.Login = function (username, password, callback) {

    /* Dummy authentication for testing, uses $timeout to simulate api call
     ----------------------------------------------*/
    /*$timeout(function(){
      var response = { success: username === 'hafsteinnh@securitas.is' && password === 'test' };
      if(!response.success) {
        response.message = 'Username or password is incorrect';
      }
      callback(response);
    }, 1000);*/


    /* Use this for real authentication
     ----------------------------------------------*/
    $http.get(serviceBase + 'api/login/' + username + '/' + password)
        .success(function (response) {
        callback(response);
        });

  };

  service.SetCredentials = function (username, password,ssn) {
    //var authdata = Base64.encode(username + ':' + password);
    var authdata = btoa(username + ':' + password);

    console.log("setting global user")
    $rootScope.globals = {
      currentUser: {
        username: username,
        authdata: authdata,
        isAuth: true,
        ssn: ssn
      }
    };

    $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata; // jshint ignore:line
    $cookieStore.put('globals', $rootScope.globals);
  };

  service.ClearCredentials = function () {
    $rootScope.globals = {};
    $cookieStore.remove('globals');
    $http.defaults.headers.common.Authorization = 'Basic ';
  };

  return service;
  /*BASIC AUTH*/


  /*var serviceBase = ngAuthSettings.apiServiceBaseUri;
  var $http;
  var authServiceFactory = {};

  var _authentication = {
    isAuth: false,
    userName: "",
    useRefreshTokens: true,
    ssn: "",
    id: "",
    address: "",
    postalCode: "",
    city: "",
    corpEmail: "",
    phone: "",
    fullName: ""
  };

  var _saveRegistration = function (registration) {

    _logOut();

    $http = $http || $injector.get('$http');
    return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
      return response;
    });

  };

  var _getUserInfo = function(){
    var data = "?email=" + _authentication.userName;

    return $http.post(serviceBase + 'api/customer/getCustomerInfo' + data).success(function (results) {
      localStorageService.set('customerInfo', {ssn: results.ssn, id: results.id, address: results.address, postalCode: results.postalCode, city: results.city, corpEmail: results.userCorpEmail, phone: results.userPhoneMobile,fullName:results.userName});
      _authentication.ssn = results.ssn;
    });
  };

  var _login = function (loginData){

    var data = "api/account/login?username=" + loginData.userName + "&password=" + loginData.password;

    data = data + "&client_id=" + "AT";

    var deferred = $q.defer();

    $http = $http || $injector.get('$http');

    $http.post(serviceBase, data, {headers: { 'Content-Type' : 'application/x-www-form-urlencoded'} }).success(function(res){


      localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: false});

      _authentication.isAuth = true;
      _authentication.userName = loginData.userName;
      _authentication.useRefreshTokens = true;

      deferred.resolve(response);


    }).error(function (err, status) {
      _logOut();
      deferred.reject(err);
    });

  };

  var _login = function (loginData) {

    //var data = "api/accounts/login?username=" + loginData.userName + "&password=" + loginData.password;

    var data = "api/account/loasdfasdfgin";

    //data = data + "&client_id=" + "AT";

    var deferred = $q.defer();

    $http = $http || $injector.get('$http');

    $http.post(serviceBase + "api/account/login").success(function (response) {

      localStorageService.set('authorizationData', { userName: loginData.userName});

      _authentication.isAuth = true;
      _authentication.userName = loginData.userName;
      _authentication.useRefreshTokens = false;

      deferred.resolve(response);

    }).error(function (err, status) {
      _logOut();
      deferred.reject(err);
    });

    return deferred.promise;

  };

  *//*var _login = function (loginData) {

    var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;

    data = data + "&client_id=" + "AT";

    var deferred = $q.defer();

    $http = $http || $injector.get('$http');
    $http.post(serviceBase + 'token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {



      localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: response.refresh_token, useRefreshTokens: true});

        _authentication.isAuth = true;
        _authentication.userName = loginData.userName;
        _authentication.useRefreshTokens = true;

        deferred.resolve(response);



    }).error(function (err, status) {
      _logOut();
      deferred.reject(err);
    });

    return deferred.promise;

  };*//*

  var _logOut = function () {

    localStorageService.remove('authorizationData');

    _authentication.isAuth = false;
    _authentication.userName = "";
    _authentication.useRefreshTokens = true;
    _authentication.ssn = "";

  };

  var _fillAuthData = function () {
    var authData = localStorageService.get('authorizationData');
    var custInfo = localStorageService.get('customerInfo');
    if (authData && custInfo) {
      _authentication.isAuth = true;
      _authentication.userName = authData.userName;
      _authentication.useRefreshTokens = true;
      _authentication.ssn = custInfo.ssn;
      _authentication.id = custInfo.id,
      _authentication.address = custInfo.address,
      _authentication.postalCode = custInfo.postalCode,
      _authentication.city = custInfo.city,
      _authentication.corpEmail = custInfo.corpEmail,
      _authentication.phone = custInfo.phone,
      _authentication.fullName = custInfo.fullName
    }

  };


  authServiceFactory.saveRegistration = _saveRegistration;
  authServiceFactory.login = _login;
  authServiceFactory.logOut = _logOut;
  authServiceFactory.fillAuthData = _fillAuthData;
  authServiceFactory.authentication = _authentication;
  authServiceFactory.getUserInfo = _getUserInfo;

  return authServiceFactory;*/
}]).factory('Base64', function () {
  /* jshint ignore:start */

  var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

  return {
    encode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      do {
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)) {
          enc3 = enc4 = 64;
        } else if (isNaN(chr3)) {
          enc4 = 64;
        }

        output = output +
        keyStr.charAt(enc1) +
        keyStr.charAt(enc2) +
        keyStr.charAt(enc3) +
        keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";
      } while (i < input.length);

      return output;
    },

    decode: function (input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
        window.alert("There were invalid base64 characters in the input text.\n" +
        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
        "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
        enc1 = keyStr.indexOf(input.charAt(i++));
        enc2 = keyStr.indexOf(input.charAt(i++));
        enc3 = keyStr.indexOf(input.charAt(i++));
        enc4 = keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
    }
  };

  /* jshint ignore:end */
});
