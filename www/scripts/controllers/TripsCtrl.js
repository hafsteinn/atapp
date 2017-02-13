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
            /*var client = new XMLHttpRequest();
            var obj = {};
            client.open('GET', "scripts/controllers/loftmyndir.js");
            client.onreadystatechange = function () {
              if (client.readyState == 4) {
                obj.funct = client.responseText;
                document.getElementById("mapSection" + index).contentWindow.postMessage(obj, "*");
              }
            }
            client.send();*/

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

            maps.push(map);


            vehicleService.getVehiclePath($routeParams.carLicence, trip.tripBeginsDate, trip.tripEndsDate).then(function (result) {

              //find center point
              var middle = result.data.length;
              var middleLat = result.data[Math.floor(middle/2)].latitude;
              var middleLon = result.data[Math.floor(middle/2)].longitude;
              setCenterAT(middleLon.replace(",","."),middleLat.replace(",","."),index);

              //update map
              updateFeatures(result.data, index);

            });

        },1000,1);

      };



    /*MAPS STARTS*/
    var setCenterAT = function(lon,lat,index){
/*      var obj2 = {};
      obj2.funct = "view.setCenter( ol.proj.transform(["+lon+","+lat+"],'EPSG:4326', 'EPSG:3057'));";
      document.getElementById("mapSection" + index).contentWindow.postMessage(obj2, "*");*/
      var latitude = parseFloat(lat);
      var longitude = parseFloat(lon);

      maps[index].setView(new ol.View({
            center: ol.proj.transform([longitude,latitude],'EPSG:4326', 'EPSG:3857'),
            zoom: 16
      }));
    };


    var updateFeatures = function(vehicleData,index){

      vehicleData.forEach(function(item)
      {

      var sp = Number(item.speed);
      var stp = Number(item.streetSpeed);
      var stpMAX = stp + 7;

      var icon = "blue";

      var ev = "Ekkert";

      if(item.eventID != null)
      {
         icon = "yellow";
      }

      if(sp > stpMAX)
      {
        icon = "red";
      }

      if(sp === 0)
      {
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
      

      maps[index].addLayer(vectorLayer);

      });

/*      var geojsonObject = {
        'type': 'FeatureCollection',
        'crs': {
          'type': 'name',
          'properties': {
            'name': 'EPSG:4326'
          }
        },
        'features': [
          ]
      };

      var counter = 0;
      vehicleData.forEach(function(item){

        var icon = "blue";
        var violation = "Engin frávik";
        var course = item.direction;

        if(item.eventID != null)
        {
          icon = "yellow";

          switch (item.eventID)
          {
            case "144":
                  violation = "Lausagangur";
                  break;
            case "153":
                  violation = "Gróf hröðun";
                  break;
            case "155":
                  violation = "Gróf hemlun";
                  break;
            case "236":
                  violation = "Gróf beygja";
                  break;
            default:
                  violation = "Glannalegur akstur";
          }
        }

        if(item.speed > item.streetSpeed)
        {
          icon = "red";
          violation = "Of hraður akstur";
        }

        if(item.speed < 1)
        {
          icon = "bluestop";
          course = 0;
        }


        var temp = {
          'type':'Feature',
          'id':counter,
          'geometry':{
            'type':'Point',
            'coordinates':[item.longitude.replace(",","."),item.latitude.replace(",",".")]
          },
          'geometry_name':'the_geom',
          'properties':{
            'Bílnúmer': $routeParams.carLicence,
            'course': course,
            'Hraði': item.speed,
            'Götuhraði': item.streetSpeed,
            'Frávik': violation,
            'icon': icon
          }
        };
        geojsonObject.features.push(temp);
        counter++;
      });

      var obj = {};
      obj.funct = "window.updateData(" + JSON.stringify(geojsonObject) + ");";
      document.getElementById("mapSection" + index).contentWindow.postMessage(obj, "*");*/


      /*var obj = {};
      //obj.funct = "var geojsonFormat = new ol.format.GeoJSON();var features = geojsonFormat.readFeatures(" + JSON.stringify(geojsonObject) + ", {featureProjection: 'EPSG:3057'});vectorLayer.getSource().clear();vectorLayer.getSource().addFeatures(features);";
      obj.funct = "console.log('posting!!!');var geoJSONSrc = new ol.source.GeoJSON({object:" + JSON.stringify(geojsonObject) + ",projection: 'EPSG:3057'});" +
      "var iconStyle = function (f) {return [new ol.style.Style({image: new ol.style.Icon(({anchor: [0.5, 0.5],anchorXUnits: 'fraction',anchorYUnits: 'fraction',src: 'http://m.at.is/images/0.png',rotation: f.getProperties().course * Math.PI / 180})),text: new ol.style.Text({textAlign: 'center',textBaseline: 'above',font: 'Normal 12px Arial',text: f.getProperties().course,fill: new ol.style.Fill({color: '#000000'}),stroke: new ol.style.Stroke({color: '#ffffff',width: 3}),offsetX: 0,offsetY: -8})})]};" +
      "var vectorLayer = new ol.layer.Vector({source: geoJSONSrc,params: {NAME: 'punktur'},style:iconStyle});" +
      "map.addLayer(vectorLayer);console.log('done posting!!');";
      document.getElementById("mapSection").contentWindow.postMessage(obj, "*")*/;

    };

    /*MAPS ENDS*/




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
