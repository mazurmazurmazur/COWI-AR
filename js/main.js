window.onload = () => {
  let places = staticLoadPlaces();
  renderPlaces(places);
};

var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
    console.log("NIEXXX " + x);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
    console.log("lol " + x);
  }
}

function showPosition(position) {
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
}

function yourFunction() {
  // do whatever you like here

  getLocation();

  setTimeout(yourFunction, 1000);
}

yourFunction();

function staticLoadPlaces() {
  return [
    {
      name: "Magnemite",
      location: {
        lat: 55.766616,
        lng: 12.504592
      }
    }
  ];
}

function renderPlaces(places) {
  let scene = document.querySelector("a-scene");

  places.forEach(place => {
    let latitude = place.location.lat;
    let longitude = place.location.lng;

    let model = document.createElement("a-entity");
    model.setAttribute(
      "gps-entity-place",
      `latitude: ${latitude}; longitude: ${longitude};`
    );
    model.setAttribute("gltf-model", "./assets/magnemite/scene.gltf");
    model.setAttribute("rotation", "0 180 0");
    model.setAttribute("animation-mixer", "");
    model.setAttribute("scale", "2.5 2.5 2.5");

    model.addEventListener("loaded", () => {
      window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    });

    scene.appendChild(model);
  });
}
