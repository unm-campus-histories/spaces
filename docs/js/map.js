"use strict";

/* ==============================
 * Google Sheets interface
 * ==============================
 */

function getMarkers(callback) {
  //console.log($('#sheetrock').html());
  console.log("now in getMarkers");
    // The spreadsheet must be either "visible to anyone with the link", or "public on the web".

    //var sheetURL = "https://docs.google.com/spreadsheets/d/1tpcVOeTci6Bc4cXYN-ytnImn6MzILDPH4W6fMfEPvkg/edit?usp=sharing#gid=0";

    // spring 2019 sheet
     // var sheetURL = "https://docs.google.com/spreadsheets/d/1AE1X-dDphqyYjVlUj1w0xvWivnu0e7EtyxzuGNjbock/edit#gid=0";

    // limited test version
    var sheetURL = "https://docs.google.com/spreadsheets/d/1-HDDwiVMH7thJ8A4hX4kz_RKTGh6Zx6C3aZz7CntBaI/edit?usp=sharing#gid=0";
    console.log("using test data");

    var markers = [];
    $('#sheetrock').sheetrock({
        url: sheetURL,
        query: "select *",
        fetchSize: 0,
        reset: true,
        target: document.getElementById("sheetrock"),
        rowTemplate: function(row) {
            //console.log(row);
            var m = row.cellsArray;
            // author is 0
            m.name = m[1];
            m.teaser = m[2];
            m.slug = m[4];
            console.log("found " + m.slug + " in sheet.");
            //m.kmlFile = m[4]; // now using essay-slug to encourage consistency
            m.imageFile = m[5];
            m.type = m[6];
            m.startDate = m[7];
            m.endDate = m[8];
            markers.push(m);
            //console.log("Row " + row.num + " is OK.");
            return $('<span></span>'); // appease the sheetrock table handler
        },
        callback: function (error, options, response) {
            console.log("Retrieved " + markers.length + " rows.");
            //console.log(error, options, response);

            // when data is done loading, execute supplied callback function
            callback(markers);
        }
    });
}

//function loadMarker(i, markerData) {
function loadMarker(markerData, dfd) {
  console.log("now in loadMarker...");

  var kmlFile = "kml/" + markerData.slug + ".kml";
  var imageFile = "essays/images/" + markerData.imageFile;
  var outline = {};

  //console.log("about to get KML file: " + kmlFile);

  $.ajax({
    url: kmlFile,
    success: function(xml) {
      console.log(kmlFile + " retrieved successfully");
      outline = toGeoJSON.kml(xml);

      console.log(markerData);

      // add relevant data to geoJSON from google sheet.
      var timeObj = new Date(markerData.startDate).getTime();
      outline.features[0].properties.start = timeObj;
      console.log(timeObj + " entered into properties");
      //outline.features[0].properties.start = markerData.startDate;
      outline.features[0].properties.end = markerData.endDate;

      if (!markerData.endDate) {
        outline.features[0].properties.extant = true;
      } else {
        outline.features[0].properties.extant = false;
      }

      //console.log(outline);

      // get features property from ouline (array of length 1) and add it to features array in allFeatures object (which is valid geoJSON).
      //console.log("FOUND FEATURE:");
      //console.log(outline.features[0]);
      allFeatures.features.push(outline.features[0]);
      //console.log("ALL FEATURES:");
      //console.log(allFeatures);


      var popupHTML = '<a href="essays/'+markerData.slug+'">';
      popupHTML += '<div class="map-popup">';
      popupHTML += '<img src="' + imageFile + '">';
      popupHTML += "<h4>" + markerData.name + "</h4>";
      popupHTML += '<p>' + markerData.teaser + '</p>';
      popupHTML += '</div></a>';

      var popup = L.responsivePopup().setContent(popupHTML);

      // add to either current or ghost layer
/*
      if (!markerData.endDate) {
        //console.log("found current building");
        var outlineLayer = L.geoJSON(outline,{style: myStyle}).bindPopup(popup, {maxWidth : 560}).on('click', function(e) {
          //console.log("click detected");
        });

        //auto pop-ups for mousing over footprint
        outlineLayer.on('mouseover', function (e) {
          this.openPopup();
        });
        outlineLayer.on('mouseout', function (e) {
          this.closePopup();
        });


        //currentGroup.addLayer(outlineLayer);
      }
      else {
        //console.log("found ghost building");
        //ghostGroup.addLayer(L.geoJSON(outline).bindPopup(popup, {maxWidth : 560}));
      }
*/
      // add to appropriate type/use layer
      if (!markerData.type) {
        markerData.type = "unknown";
      }
      else {
        markerData.type = markerData.type.toLowerCase();
      };

      console.log("markerData type set: " + markerData.type);
      //console.log("ALLGROUPS");
      //console.log(allGroups);

      // trap if style is defined in sheet but not in style array
      if (typeof allGroups[markerData.type] === 'object') {

      var outlineLayer = L.geoJSON(outline,{style:allGroups[markerData.type].style}).bindPopup(popup, {maxWidth : "50%"});

      //auto pop-ups for mousing over footprint
      outlineLayer.on('mouseover', function (e) {
        this.openPopup();
      });
      outlineLayer.on('mouseout', function (e) {
        this.closePopup();
      });

      outlineLayer.on('click', function (e) {
        window.open("essays/"+markerData.slug);
      });


      allGroups[markerData.type].group.addLayer(outlineLayer);

      dfd.resolve();
    }
    else {
      console.log("allGroups does not have an entry for this marker type");
      dfd.resolve();
    }


    }, // end success function
    error: function(xhr, status, error){
        var errorMessage = xhr.status + ': ' + xhr.statusText;
        console.log("KML file not found");
        dfd.resolve();
    }

  }); //end ajax
//return dfd.promise();
} //end loadMarker
