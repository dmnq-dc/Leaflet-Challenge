//Set endpoint API GEOJSON
let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Create the map, 
let myMap = L.map("map", {
    center: [25.2744, 133.7751],
    zoom: 3
});

// Add a tile layer to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Retrieve and add the earthquake data to the map
d3.json(url).then(function (data) {
    
    //Create function for mapstyle
    function mapStyle(feature) {
        return {
            opacity: 0.75,
            fillOpacity: 0.75,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Create function for Marker colors according to depth
    function mapColor(depth) {
        switch (true) {
            case depth > 90:
                return "#4040a1";
            case depth > 70:
                return "#36486b";
            case depth > 50:
                return "#618685";
            case depth > 30:
                return "#800000";
            case depth > 10:
                return "#f18973";
            default:
                return "#008B8B";
        }
    }

    // Create function to determine magnitude size
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;}
        return mag * 3.5;
    }

    // Add earthquake data to the map with circlemarker for each coordinates
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,

        // Create the bind pop-up data when circles are clicked
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + "<br>Depth: " + feature.geometry.coordinates[2]);

        }
        //Add to current map
    }).addTo(myMap);


// Add the legend with colors to corrolate with depth
    let legend = L.control({position: "bottomleft"});

    legend.onAdd = function() {
        let div = L.DomUtil.create("div", "info legend")
        let depth = [-10, 10, 30, 50, 70, 90];
 
        for (var i = 0; i < depth.length; i++) {
            div.innerHTML +=
        '<i style="background:' + mapColor(depth[i] + 1) + '"></i> ' + depth[i] + (depth[i + 1] ? '&ndash;' + depth[i + 1] + '<br>' : '+');
    }
        return div;
        };
        legend.addTo(myMap)
        });
