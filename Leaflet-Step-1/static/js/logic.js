var earthquake_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

var myMap = L.map("mapid", {
    center: [34.0754, -84.2941],
    zoom: 2
});

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

function getColor(mag) {
    var circleColor = "green";
    if (mag > 90) {
        circleColor = "red";
    }
    else if (mag > 70) {
        circleColor = "orange";
    }
    else if (mag > 50) {
        circleColor = "#light orange";
    }
    else if (mag > 30) {
        circleColor = "#yellow";
    }   
    else if (mag > 10) {
        circleColor = "#bright yellow";
    }
    return circleColor;
}
d3.json(earthquake_url).then(data => {
    console.log(data);
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: feature.properties.mag*2,
                fillColor: getColor(feature.geometry.coordinates[2]),
                color: "gray",
                weight: 1
            });
        },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`${feature.properties.place}<br>Magnitude: ${feature.properties.mag}<br>${new Date(feature.properties.time)}`);
            }
        }).addTo(myMap)

        var legend = L.control({ position: "bottomright" });
            legend.onAdd = function() {
            var div = L.DomUtil.create("div", "info legend");
            var limits = ["-10-10", "10-30", "30-50", "50-70", "70-90", ">90"];
            var colors = ["green", "bright yellow", "yellow", "light orange", "orange", "red"];
            var labels = [];

            limits.forEach(function(limit, index) {
                labels.push("<i style=\"background-color: " + colors[index] + "\"></i>" + limit+ "<br>");
              });
          
              div.innerHTML += labels.join("");
              return div;
            };

          // Adding legend to the map
             legend.addTo(myMap);
        }).catch(function(error) {
    console.log(error);
        });