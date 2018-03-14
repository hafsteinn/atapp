'use strict';

/**
 * @ngdoc function
 * @name atApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the atApp
 */
angular.module('atApp')
  .controller('TripsCtrl', ['$scope','$location','authService','customerService','vehicleService','$routeParams','$interval', function ($scope,$location,authService,customerService,vehicleService,$routeParams,$interval) {

      vehicleService.getTrips($routeParams.carLicence).then(function(result){
        $scope.trips = result.data;
      });

      var maps = [];


      $scope.getPath = function(trip,index){

        $interval(function(){

            //Start by initializing the map
            var map = new ol.Map({
              target: 'mapSection' + index,
              layers: [
                  new ol.layer.Tile({
                      source: new ol.source.OSM()
                  })
              ],
              view: new ol.View({
                  center: ol.proj.transform([-19.507084,64.776466],'EPSG:4326', 'EPSG:3857'),
                  zoom: 6
              })
            });

            //maps.push(map);


            vehicleService.getVehiclePath($routeParams.carLicence, trip.tripBeginsDate, trip.tripEndsDate).then(function (result) {

              //find center point
              var middle = result.data.length;
              var middleLat = result.data[Math.floor(middle/2)].latitude;
              var middleLon = result.data[Math.floor(middle/2)].longitude;
              setCenterAT(middleLon.replace(",","."),middleLat.replace(",","."),map);

              //update map
              updateFeatures(result.data, map);

            });

        },1000,1);

      };



    /*MAPS STARTS*/
    var setCenterAT = function(lon,lat,map){
      var latitude = parseFloat(lat);
      var longitude = parseFloat(lon);

      map.setView(new ol.View({
            center: ol.proj.transform([longitude,latitude],'EPSG:4326', 'EPSG:3857'),
            zoom: 16
     }));
    };

    var updateFeatures = function(vehicleData,map){

      vehicleData.forEach(function(item)
      {

      var sp = Number(item.speed);
      var stp = Number(item.streetSpeed);
      var stpMAX = stp + 7;

      var icon = "blue";

      var ev = "Ekkert";

      if(item.eventID != null)
      {
        //console.log("yellow")
         icon = "yellow";
      }

      if(sp > stpMAX)
      {
        //console.log("red")
        icon = "red";
      }

      if(sp === 0)
      {
        //console.log("bluestop")
        icon = "bluestop";
      }

      var lat = parseFloat(item.latitude.replace(",","."));
      var lon = parseFloat(item.longitude.replace(",","."));

      if(vehicleData.speed < 1)
      {
        icon = "bluestop";
        rotate = 0;
      }

      var iconFeatures=[];

      var iconFeature = new ol.Feature({
        geometry: new ol.geom.Point(ol.proj.transform([lon,lat], 'EPSG:4326',     
        'EPSG:3857')),
        name: 'Null Island',
        population: 4000,
        rainfall: 500
      });

      iconFeatures.push(iconFeature);

      var vectorSource = new ol.source.Vector({
        features: iconFeatures //add an array of features
      });

      var iconStyle = new ol.style.Style({
        image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          anchor: [0.5, 0.5],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels',
          opacity: 0.75,
          src: 'http://m.at.is/images/' + icon + '.png',
          rotation: item.direction * Math.PI / 180
        }))
      });


      var vectorLayer = new ol.layer.Vector({
        source: vectorSource,
        style: iconStyle
      });
      

      map.addLayer(vectorLayer);

      });

      
    };


  }]).animation('.slide', function() {
    var NG_HIDE_CLASS = 'ng-hide';
    return {
      beforeAddClass: function(element, className, done) {
        if(className === NG_HIDE_CLASS) {
          element.slideUp(done);
        }
      },
      removeClass: function(element, className, done) {
        if(className === NG_HIDE_CLASS) {
          element.hide().slideDown(done);
        }
      }
    }
  });
