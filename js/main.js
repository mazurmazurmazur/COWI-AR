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
  let newTextNode = document.createTextNode(`
   ${document.getElementById("distanceTest").getAttribute("distanceMsg")}`);

  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;

  // x.appendChild(newTextNode);
}

function yourFunction() {
  // do whatever you like here

  let distTest = document.getElementById("distanceTest");
  distTest.setAttribute(
    "text",
    "value: changing text; color: pink; align: center;"
  );

  getLocation();

  setTimeout(yourFunction, 1000);
}

function renderPlaces(places) {
  let scene = document.querySelector("a-scene");

  window.onload = () => {
    places.features.forEach(place => {
      let latitude = place.geometry.coordinates[0][0];
      let longitude = place.geometry.coordinates[0][1];

      let model = document.createElement("a-entity");
      let text = document.createElement("a-entity");
      let pinImage = document.createElement("a-image");
      // let dist = document.createElement("a-entity");

      model.setAttribute(
        "gps-entity-place",
        `latitude: ${longitude}; longitude: ${latitude};`
      );
      model.setAttribute("distance");
      model.setAttribute("scale", "4 4 4");
      model.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });

      // dist.setAttribute(
      //   "text",
      //   `value: "I11 ${model.getAttribute(
      //     "distanceMsg"
      //   )} "; align: center; color: green;`
      // );
      // dist.setAttribute("look-at", "#camra");
      // dist.setAttribute("scale", "8 8 8");
      // dist.setAttribute("position", "0 1.1 0");

      text.setAttribute(
        "text",
        "value: " + place.properties.comment + "; align: center;  color: red;"
      );
      text.setAttribute("look-at", "#camra");
      text.setAttribute("scale", "8 8 8");
      text.setAttribute("position", "0 0.8 0");

      pinImage.setAttribute("src", "./assets/marker.png");

      // model.appendChild(dist);
      model.appendChild(text);
      model.appendChild(pinImage);
      scene.appendChild(model);
    });

    // let newTextNode = document.createTextNode(
    //   `dist: ${distTest.getAttribute("distanceMsg")}`
    // );
  };
}

function printDist() {
  console.log(distTest);
}

fetchContact();
