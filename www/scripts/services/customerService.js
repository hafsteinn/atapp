/**
 * Created by hafsteinnh on 20-Sep-15.
 */
'use strict';
app.factory('customerService', ['$http','ngAuthSettings','authService','$rootScope','localStorageService', function ($http,ngAuthSettings,authService,$rootScope,localStorageService) {

  var serviceBase = ngAuthSettings.apiServiceBaseUri;
  var customerServiceFactory = {};
  var authentication = $rootScope.globals.currentUser;


  var _getCustomer = function(){

    var data = authentication.username;

    return $http.get(serviceBase + 'api/customers/info/' + data).then(function (results) {
      return results;
    });
  };

  var _getCustomerVehicles = function(){

    var data = $rootScope.globals.currentUser.ssn;

    return $http.get(serviceBase + 'api/customers/vehicles/' + data).then(function (results) {
      return results;
    });
  };

  var _getCustomerVehiclesByModule = function(moduleId){

    var data = {
      ssn :$rootScope.globals.currentUser.ssn,
      moduleId: moduleId
    }

    return $http.get(serviceBase + 'api/customers/vehicles/' + $rootScope.globals.currentUser.ssn + '/' + moduleId).then(function (results) {
      return results;
    });
  };

  customerServiceFactory.getCustomer = _getCustomer;
  customerServiceFactory.getCustomerVehicles = _getCustomerVehicles;
  customerServiceFactory.getCustomerVehiclesByModule = _getCustomerVehiclesByModule;

  return customerServiceFactory;

}]);

