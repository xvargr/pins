mapboxgl.accessToken = mapboxToken;
// TODO: dynamically pin and center to current lib
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/dark-v10", // style URL
  center: geometry.coordinates, // starting position [lng, lat]
  zoom: 5, // starting zoom
});

const marker = new mapboxgl.Marker({ color: "darkGreen" })
  .setLngLat(geometry.coordinates)
  // .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML("<h3>Hello</h3>"))
  .addTo(map);

// const popup = new mapboxgl.Popup({ offset: 35, closeOnClick: false })
//   .setLngLat(geometry.coordinates)
//   .setHTML("<h3>Hello World!</h3>")
//   .addTo(map);

map.on("style.load", () => {
  map.setFog({}); // Set the default atmosphere style
});

window.onload = function () {
  // the map div is rendered hidden on load, so the canvas resets to 400x300
  // this forces the map to resize to the size of the div by quickly un-hiding and
  // resizing the div before hiding it again on page load
  const mapDiv = document.querySelector("#map");
  const carousel = document.querySelector(".carousel");

  mapDiv.classList.toggle("hidden");
  carousel.classList.toggle("hidden");
  map.resize();
  mapDiv.classList.toggle("hidden");
  carousel.classList.toggle("hidden");
};
