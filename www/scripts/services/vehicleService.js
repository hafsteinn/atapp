/**
 * Created by hafsteinnh on 21-Sep-15.
 */
/**
 * Created by hafsteinnh on 20-Sep-15.
 */
'use strict';
app.factory('vehicleService', ['$http','ngAuthSettings', function ($http,ngAuthSettings) {

  var serviceBase = ngAuthSettings.apiServiceBaseUri;
  var vehicleServiceFactory = {};

  var _getWeeklyGrade = function(carID){

    var data = carID;

    return $http.get(serviceBase + 'api/vehicles/WeeklyGrade/' + data + '/').then(function (results) {
      return results;
    });
  };

  var _getTrips = function(carLicence){
    var data = carLicence;

    return $http.get(serviceBase + 'api/vehicles/trips/' + data + '/7/').then(function(results){
      return results;
    });
  };

  var _getPath = function(carLicence,start,end){

    return $http.get(serviceBase + 'api/vehicles/path/' + carLicence + '/' + start + '/' + end ).then(function(results){
      return results;
    });
  };


  vehicleServiceFactory.getWeeklyGrade = _getWeeklyGrade;
  vehicleServiceFactory.getTrips = _getTrips;
  vehicleServiceFactory.getVehiclePath = _getPath;

  return vehicleServiceFactory;

}]);

