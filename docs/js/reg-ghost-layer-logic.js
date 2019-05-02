/* tabling filter by current/past buildings
    currentGroup.on('add', function(event) {
          //console.log(event);
         if(event.layer == allGroups["offices"].group || event.layer == allGroups["admin"].group || event.layer == allGroups["dorm"].group ) {
             console.log("use group added");
             // check if filtering necessary
             if (map.hasLayer(currentGroup)) {
                event.layer.eachLayer(function (layer) {
                  layer.eachLayer(function (layer) {
                    console.log(layer.feature.properties.name + " is extant?" + layer.feature.properties.extant);
                    if (!layer.feature.properties.extant) {
                      layer.setStyle({fillOpacity : 0, stroke:false});
                    }
                    else {
                      layer.setStyle({fillOpacity : .6, stroke:true});
                    }
                  });
                });
             }
             if (map.hasLayer(ghostGroup)) {
                event.layer.eachLayer(function (layer) {
                  layer.eachLayer(function (layer) {
                    console.log(layer.feature.properties.name + " is extant?" + layer.feature.properties.extant);
                    if (layer.feature.properties.extant) {
                      layer.setStyle({fillOpacity : 0, stroke:false});
                    }
                    else {
                      layer.setStyle({fillOpacity : .6, stroke:true});
                    }
                  });
                });
             }
             else { //don't display anything
               map.removeLayer(event.layer);
             }
         }

        else { // current or ghost group added
          console.log("non/extant group added");

          // find groups currently selected
          // loop through known list and run hasLayer to make list of selected groups
          var checkedGroups = [];

          for (var i = 0; i < groupNames.length; i++) {
            console.log("checking groupNames");
            if (map.hasLayer(allGroups[groupNames[i]].group)) {
              console.log("found checked: " + groupNames[i]);
              checkedGroups.push(allGroups[groupNames[i]].group);
            }
          }

          // loop through selected list and set opacity to one
          for (var i = 0; i < checkedGroups.length; i++) {
            console.log("about to add " + checkedGroups[i]);
            map.addLayer(checkedGroups[i]);
          }

        } // end current or ghost clicked

    });
    */
