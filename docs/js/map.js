"use strict";

/* ==============================
 * Google Sheets interface
 * ==============================
 */

function getMarkers(callback) {
  console.log($('#sheetrock').html());
  console.log("starting getMarkers");
    // The spreadsheet must be either "visible to anyone with the link", or "public on the web".

    //var sheetURL = "https://docs.google.com/spreadsheets/d/1tpcVOeTci6Bc4cXYN-ytnImn6MzILDPH4W6fMfEPvkg/edit?usp=sharing#gid=0";

    // spring 2019 sheet
    // var sheetURL = "https://docs.google.com/spreadsheets/d/1AE1X-dDphqyYjVlUj1w0xvWivnu0e7EtyxzuGNjbock/edit#gid=0";

    // limited test version
    var sheetURL = "https://docs.google.com/spreadsheets/d/1-HDDwiVMH7thJ8A4hX4kz_RKTGh6Zx6C3aZz7CntBaI/edit?usp=sharing#gid=0";

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
            //m.kmlFile = m[4]; // now using essay-slug to encourage consistency
            m.imageFile = m[5];
            m.contentPages = m[3].split(",");
            console.log(m.contentPages);
            markers.push(m);
            console.log("Row " + row.num + " is OK.");
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

function createPopupRows(pages) {

  //loop through supplied slugs to retrieve page title and subtitle
  console.log("about to begin page loop.");

  $.each(pages, function(i,val) {
    var filename = 'essays/' + val + '.html';
    console.log("processing " + filename);

    var $div = $('<div>');
    var temp = i;

    // format for spreadsheet (and lesson on separators)
    // title;blurb;link|title;blurb;link|etc

    $div.load(filename + '', function($row){
      console.log("finished loading page content.");
      console.log("index at callback" + temp);
      var title = $(this).find("h1:first").text();
      // try to get from jumbotron; if blank use h2
      var subtitle = $(this).find("#page-subtitle").text();
      if (!subtitle) subtitle = $(this).find("h2:first").text();
      var image = $(this).find("img:first").attr('src');
      console.log(image);
      image = image.replace("images/", "essays/images/"); //  use thumbs path instead
      var rowString = '<a href='+filename+'><div class="popup-row">';
      rowString += '<img src="' + image + '">';
      rowString += '<h4>' + title + '</h4>';
      rowString += '<p>' + subtitle + '</p>';
      rowString += '<div style="clear:both"></div></div></a>';
      console.log("just made row: " + rowString);
      console.log($('.map-popup').html());
      $('.map-popup').append(rowString);
    });
  }); // end each
}

function loadMarker(i, markerData) {
  console.log("now in loadMarker...");
  var kmlFile = "kml/" + markerData.slug + ".kml";
  var imageFile = "essays/images/" + markerData.imageFile;
  var geojsonFeature = {};

  console.log("about to get KML file: " + kmlFile);

  $.ajax({
    url: kmlFile,
    success: function(xml) {
      console.log("KML file retrieved successfully");
      geojsonFeature = toGeoJSON.kml(xml);

      var popupHTML = '<a href="essays/'+markerData.slug+'">';
      popupHTML += '<div class="map-popup">';
      popupHTML += '<img src="' + imageFile + '">';
      popupHTML += "<h4>" + markerData.name + "</h4>";
      popupHTML += '<p>' + markerData.teaser + '</p>';
      popupHTML += '</div></a>';

      var popup = L.responsivePopup().setContent(popupHTML);

      featureGroup.addLayer(L.geoJSON(geojsonFeature).bindPopup(popup, {maxWidth : 560}).on('click', function(e) {
        console.log("click detected");
        /*
        $.when( createPopupRows(markerData.contentPages) ).then(function( ) {
          console.log("createPopupRows is done."); // Alerts 200
        });

        createPopupRows(markerData.contentPages, rowString);
        console.log("moved past createPopupRows call.");
        */
      }));
    },
    error: function(xhr, status, error){
        var errorMessage = xhr.status + ': ' + xhr.statusText
        console.log("KML file not found");
    }
  }); //end ajax
} //end loadMarker
