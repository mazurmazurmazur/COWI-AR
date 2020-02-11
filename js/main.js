function fetchContact() {
  fetch("./json/poland.json")
    .then(res => res.json())
    .then(renderPlaces)
    .then(yourFunction);
}

var x = document.getElementById("demo");
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
  +"<br>" + document.getElementById("distanceTest").getAttribute("distanceMsg");
}

function yourFunction() {
  // do whatever you like here

  getLocation();

  setTimeout(yourFunction, 1000);
}

function renderPlaces(places) {
  let scene = document.querySelector("a-scene");

  console.log(places.features);
  let i = 0;
  window.onload = () => {
    places.features.forEach(place => {
      i++;
      console.log("longtitude" + place.geometry.coordinates[0][0]);
      console.log(place.geometry.coordinates[0][1]);
      let latitude = place.geometry.coordinates[0][0];
      let longitude = place.geometry.coordinates[0][1];

      let model = document.createElement("a-entity");
      let text = document.createElement("a-entity");
      let pinImage = document.createElement("a-image");

      model.setAttribute(
        "gps-entity-place",
        `latitude: ${longitude}; longitude: ${latitude};`
      );

      model.setAttribute("distance");

      console.log(`latitude: ${longitude}; longitude: ${latitude};`);

      pinImage.setAttribute("src", "./assets/marker.png");
      model.id = "pointer" + i;
      model.setAttribute("scale", "4 4 4");
      text.setAttribute(
        "text",
        "value: " + place.properties.comment + "; align: center;  color: red;"
      );
      text.setAttribute("look-at", "#camra");

      console.log("printing comment: " + place.properties.comment);
      text.setAttribute("scale", "8 8 8");

      text.setAttribute("position", "0 0.8 0");

      model.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });

      model.appendChild(text);
      model.appendChild(pinImage);
      scene.appendChild(model);
    });
  };
}

fetchContact();
