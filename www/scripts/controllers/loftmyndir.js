//SET MAP LAYER
view.setZoom(8);
config.baselayers[0].setVisible(false); //map + image
config.baselayers[1].setVisible(false); //image
config.baselayers[2].setVisible(true); //map


var geojsonObject = {
'type': 'FeatureCollection',
  'crs': {
    'type': 'name',
    'properties': {
      'name': 'EPSG:4326'
    }
  },
  'features': [
    /*{
      'type': 'Feature',
      'id':"joi",
      'geometry': {
        'type': 'Point',
        'coordinates': [-21.79728,64.12235]
      },
      "geometry_name":"the_geom",
      "properties":{"licencePlate":"PZ940","lat":64.12235,"lon":-21.79728,"course":30,"speed":0,"name":"ÓMAR","lastMovement":"2015-11-26T00:00:00"}
    }*/]

};


var iconStyle = function(f) {
  return [
    new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'http://images.sagasystem.is/images/mobile/' + f.getProperties().icon + '.png',
        rotation: f.getProperties().course * Math.PI / 180
      })),
      text: new ol.style.Text({
        textAlign: "center",
        textBaseline: "above",
        font: 'Normal 12px Arial',
        text: f.getProperties().name,
        fill: new ol.style.Fill({
          color: '#000000'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffffff',
          width: 3
        }),
        offsetX: 0,
        offsetY: -8

      })
    })
    ]
}


/*var iconStyleH = function(f) {

  return [
    new ol.style.Style({
      image: new ol.style.Icon(({
        anchor: [0.5, 0.5],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        src: 'http://images.sagasystem.is/images/mobile/blue.png',
        rotation: f.getProperties().course * Math.PI / 180
      })),
      text: new ol.style.Text({
        textAlign: "center",
        textBaseline: "above",
        font: 'Normal 12px Arial',
        text: f.getProperties().licencePlate,
        fill: new ol.style.Fill({
          color: '#000000'
        }),
        stroke: new ol.style.Stroke({
          color: '#ffffff',
          width: 3
        }),
        offsetX: 0,
        offsetY: -8

      })
    })
  ]
}*/


var geoJSONSrc = new ol.source.GeoJSON({
  object:geojsonObject,
  projection: 'EPSG:3057'
})

var vectorLayer = new ol.layer.Vector({
  source: geoJSONSrc,
  params: {NAME: "punktur"},
  style:iconStyle
});

map.addLayer(vectorLayer);

window.updateData = function(g){

  var vectorLayer = ut_getLayerByName("punktur");
  var geojsonFormat = new ol.format.GeoJSON();
  var features = geojsonFormat.readFeatures(g, {
    featureProjection: 'EPSG:3057'
  });

  vectorLayer.getSource().clear();
  vectorLayer.getSource().addFeatures(features);

  /*var geoJSONSrc = new ol.source.GeoJSON({object:" + JSON.stringify(geojsonObject) + ",projection: 'EPSG:3057'});
  var vectorLayer = new ol.layer.Vector({source: geoJSONSrc,params: {NAME: 'punktur'},style:function (f) {return [new ol.style.Style({image: new ol.style.Icon(({anchor: [0.5, 0.5],anchorXUnits: 'fraction',anchorYUnits: 'fraction',src: 'http://m.at.is/images/0.png',rotation: " + vehicleData.course + "})),text: new ol.style.Text({textAlign: 'center',textBaseline: 'above',font: 'Normal 12px Arial',text: '',fill: new ol.style.Fill({color: '#000000'}),stroke: new ol.style.Stroke({color: '#ffffff',width: 3}),offsetX: 0,offsetY: -8})})]}});
  map.addLayer(vectorLayer);*/

};


//map.addLayer(vectorLayer);

map.on('click', function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  if (hit) {
    var feature = map.forEachFeatureAtPixel(pixel,
      function (feature, layer) {
        return feature;
      });

    showInfo(feature.getProperties())

  }
});


/*
* INFOWINDOW START
* */

var ATpop = new lm_pop();
ATpop.enableDrag();
ATpop.showHeader();


function showInfo(obj){
  ATpop.headerText(obj.Bílnúmer )

  var data="";
  for(var i in obj){
    if(typeof(obj[i])!="object") {
      switch (i)
      {
        case "Frávik":
          data += i + ":   " + obj[i] + "<br />";
          break;
        case "Hraði":
          data += i + ":   " + obj[i] + "<br />";
          break;
        case "Götuhraði":
          data += i + ":   " + obj[i] + "<br />";
          break;
        case "Síðasta hreifing":
          data += i + ":   " + obj[i] + "<br />";
          break;
      }

    }
  }
  ATpop.bodyContent(data);
  ATpop.show();
}


/*
 * INFOWINDOW END
 * */





/*var activePoint=null;

map.on('pointermove', function(evt) {
  if (evt.dragging) {
    return;
  }
  var pixel = map.getEventPixel(evt.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  if (hit) {
    var feature = map.forEachFeatureAtPixel(pixel,
      function (feature, layer) {
        return feature;
      });
    //vectorLayer.setStyle(iconStyleH(feature))
    activePoint = feature;
  } else if(activePoint!=null) {
    vectorLayer.setStyle(iconStyle(activePoint));
    activePoint=null;
  }
});*/




