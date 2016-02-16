'use strict';
app.factory('locationService', ['$http','ngAuthSettings', function ($http,ngAuthSettings) {

  var serviceBase = ngAuthSettings.apiServiceBaseUri;
  var locationServiceFactory = {};

  var _getVehicleLocation = function (licence) {

    return $http.get(serviceBase + 'api/vehicles/positionBASE/' + licence).then(function (results) {
      return results;
    });
  };


  locationServiceFactory.getVehicleLocation = _getVehicleLocation;

  return locationServiceFactory;

}]);
