mapboxgl.accessToken = mapboxToken;
const map = new mapboxgl.Map({
  container: "homeMap",
  style: "mapbox://styles/mapbox/dark-v10",
  center: [-82.5917, 35.6699],
  zoom: 5,
});

map.on("load", () => {
  // Add a new source from our GeoJSON data and
  // set the 'cluster' option to true. GL-JS will
  // add the point_count property to your source data.
  map.addSource("libs", {
    type: "geojson",
    data: result,
    cluster: true,
    clusterMaxZoom: 14, // Max zoom to cluster points on
    clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "libs",
    filter: ["has", "point_count"],
    paint: {
      // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#007940",
        3,
        "#00C568",
        5,
        "#00FF86",
      ],
      "circle-radius": ["step", ["get", "point_count"], 20, 3, 30, 5, 40],
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "libs",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
      "text-size": 12,
    },
  });

  map.addLayer({
    id: "unclustered-point",
    type: "circle",
    source: "libs",
    filter: ["!", ["has", "point_count"]],
    paint: {
      "circle-color": "#007940",
      "circle-radius": 4,
      "circle-stroke-width": 1,
      "circle-stroke-color": "#fff",
    },
  });
});
