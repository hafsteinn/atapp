'use strict';

/**
 * @ngdoc function
 * @name atApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the atApp
 */
angular.module('atApp')
  .controller('MainCtrl', ['$scope','$location','authService','customerService','vehicleService','radialIndicatorInstance','locationService','$http','$sce','$rootScope','$interval','localStorageService',
    function ($scope,$location,authService,customerService,vehicleService,radialIndicatorInstance,locationService,$http,$sce,$rootScope,$interval,localStorageService) {

      $scope.authentication = $rootScope.globals.currentUser;


    var cw = $('#mapSection').width();
    $('#mapSection').css({'height':(cw / 1.5)+'px'});

    $scope.indicatorOption = {
      interpolate: false,
      radius : 35,
      initValue : 0,
      barWidth: 10,
      maxValue: 10,
      barBgColor: "#fff", //WHITE
      barColor: {
        0: '#F44336', //RED
        5: '#F44336', //RED
        7: '#FF9800', //ORANGE
        10: '#8BC34A' //GREEN
      }
    };

      //Wait for the iframe to load before posting to it
      var myIframe = document.getElementById('mapSection');
      myIframe.onload = function() {


        //Start by initializing the map
        var client = new XMLHttpRequest();
        var obj = {};
        client.open('GET', "scripts/controllers/loftmyndir.js");
        client.onreadystatechange = function () {
          if (client.readyState == 4) {
            obj.funct = client.responseText;
            document.getElementById("mapSection").contentWindow.postMessage(obj, "*");
          }
        }
        client.send();


        if(!$scope.authentication)
        {
          $location.path('/login/');
        }
        else
        {

          customerService.getCustomerVehicles().then(function (results){

            if(results.data.length === 0)
            {
              $scope.noVehicles = true;
            }
            else
            {
              $scope.vehicleList = results.data;

              $scope.currentInDropdown = results.data[0].carLicence + " - " + results.data[0].vehicleType + " - " + results.data[0].vehicleSubType;

              $scope.currentCarLicence = results.data[0].carLicence;


              locationService.getVehicleLocation($scope.currentCarLicence).then(function(results){

                //Change map center
                setCenterAT(results.data.longitude,results.data.latitude);
                updateFeatures(results.data);

              });


              vehicleService.getWeeklyGrade($scope.vehicleList[0].carID).then(function (result) {
                if(result.data.length === 0)
                {
                  $scope.noVehicleData = true;
                }
                else
                {
                  $scope.noVehicleData = false;
                  $scope.currentVehicle = result.data;
                  radialIndicatorInstance['indicator1'].value(result.data.weekGrade.toPrecision(2));
                }

              });

            }

          });
        }

      };



    $scope.noVehicles = false;
    $scope.noVehicleData = false;

    $scope.dropdownChange = function(vehicleID,ind){

      $scope.currentInDropdown = $scope.vehicleList[ind].carLicence + " - " + $scope.vehicleList[ind].vehicleType + " - " + $scope.vehicleList[ind].vehicleSubType;

      $scope.currentCarLicence = $scope.vehicleList[ind].carLicence;

      locationService.getVehicleLocation($scope.currentCarLicence).then(function(results){

        //Change map center
        setCenterAT(results.data.longitude,results.data.latitude);
        updateFeatures(results.data);
      });

      vehicleService.getWeeklyGrade(vehicleID).then(function(result){
        if(result.data.length === 0)
        {
          $scope.noVehicleData = true;
        }
        else {
          $scope.noVehicleData = false;
          $scope.currentVehicle = result.data;
          radialIndicatorInstance['indicator1'].value(result.data.weekGrade.toPrecision(2));
        }
      });
    };




    var setCenterAT = function(lon,lat){
      var obj2 = {};
      obj2.funct = "view.setCenter( ol.proj.transform(["+lon+","+lat+"],'EPSG:4326', 'EPSG:3057'));";
      document.getElementById("mapSection").contentWindow.postMessage(obj2, "*");
    };


    var updateFeatures = function(vehicleData){


      var icon = "blue";
      var rotate = vehicleData.course;

      if(vehicleData.speed < 1)
      {
        icon = "bluestop";
        rotate = 0;
      }

      var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:4326'
          }
        },
        'features': [
          {
            'type': 'Feature',
            'id':$scope.currentCarLicence,
            'geometry': {
              'type': 'Point',
              'coordinates': [vehicleData.longitude,vehicleData.latitude]
            },
            "geometry_name":"the_geom",
            "properties":{"icon":icon,"Bílnúmer":$scope.currentCarLicence,"lat":vehicleData.latitude,"lon":vehicleData.longitude,"course":rotate,"Hraði":vehicleData.speed,"Nafn":$scope.currentCarLicence,"Síðasta hreifing":vehicleData.lastMovementTime}
          }]
      };


      var obj = {};
      obj.funct = "window.updateData(" + JSON.stringify(geojsonObject) + ");";
      document.getElementById("mapSection").contentWindow.postMessage(obj, "*");

      /*var obj = {};
      obj.funct = "var geoJSONSrc = new ol.source.GeoJSON({object:" + JSON.stringify(geojsonObject) + ",projection: 'EPSG:3057'});" +
      "var vectorLayer = new ol.layer.Vector({source: geoJSONSrc,params: {NAME: 'punktur'},style:function (f) {return [new ol.style.Style({image: new ol.style.Icon(({anchor: [0.5, 0.5],anchorXUnits: 'fraction',anchorYUnits: 'fraction',src: 'http://m.at.is/images/0.png',rotation: " + vehicleData.course + "})),text: new ol.style.Text({textAlign: 'center',textBaseline: 'above',font: 'Normal 12px Arial',text: '',fill: new ol.style.Fill({color: '#000000'}),stroke: new ol.style.Stroke({color: '#ffffff',width: 3}),offsetX: 0,offsetY: -8})})]}});" +
      "map.addLayer(vectorLayer);";
      document.getElementById("mapSection").contentWindow.postMessage(obj, "*");*/

    };


    $scope.logOut = function () {
      authService.logOut();
    };





  }]);
