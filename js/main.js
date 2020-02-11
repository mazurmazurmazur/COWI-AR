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

  // x.appendChild(newTextNode);
}

function yourFunction() {
  // do whatever you like here

  // let newTextNode = `
  //  ${document.getElementById("distanceTest").getAttribute("distanceMsg")}`;

  // let distTest = document.getElementById("distTestText");
  // distTest.setAttribute(
  //   "text",
  //   "value: " + newTextNode.textContent + " MTRS; color: orange; align: center;"
  // );

  getLocation();
  console.log("something");

  setTimeout(yourFunction, 1000);
}

function renderPlaces(places) {
  console.log("sthng2");
  let scene = document.querySelector("a-scene");

  window.onload = () => {
    places.features.forEach(place => {
      let latitude = place.geometry.coordinates[0][0];
      let longitude = place.geometry.coordinates[0][1];
      console.log(`latitude: ${place.geometry.coordinates[0][0]}`);

      let model = document.createElement("a-entity");
      let text = document.createElement("a-entity");
      let pinImage = document.createElement("a-image");
      // let dist = document.createElement("a-entity");

      model.setAttribute(
        "gps-entity-place",
        `latitude: ${longitude}; longitude: ${latitude};`
      );
      // model.setAttribute("distanceMsg", "");
      model.setAttribute("scale", "4 4 4");
      model.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });

      // dist.setAttribute(
      //   "text",
      //   "value: I11 miterS; align: center; color: green;"
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

fetchContact();
