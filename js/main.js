function fetchContact() {
  fetch("./json/lyngby.json")
    .then(res => res.json())
    .then(renderPlaces);
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
}

function yourFunction() {
  // do whatever you like here

  getLocation();

  setTimeout(yourFunction, 1000);
}

yourFunction();

// function staticLoadPlaces() {
//   return [
//     {
//       name: "marker1",
//       location: {
//         lat: 55.767564,
//         lng: 12.504835
//       }
//     },
//     {
//       name: "marker2",
//       location: {
//         lat: 55.767365,
//         lng: 12.505554
//       }
//     },
//     {
//       name: "marker3",
//       location: {
//         lat: 55.766846,
//         lng: 12.506949
//       }
//     },
//     {
//       name: "marker4",
//       location: {
//         lat: 55.766604,
//         lng: 12.503194
//       }
//     },
//     {
//       name: "marker5",
//       location: {
//         lat: 55.766181,
//         lng: 12.504524
//       }
//     },
//     {
//       name: "marker6",
//       location: {
//         lat: 55.765794,
//         lng: 12.506487
//       }
//     }
//   ];
// }

function renderPlaces(places) {
  let scene = document.querySelector("a-scene");

  console.log(places.features);

  window.onload = () => {
    places.features.forEach(place => {
      console.log("longtitude" + place.geometry.coordinates[0][0]);
      console.log(place.geometry.coordinates[0][1]);
      let latitude = place.geometry.coordinates[0][0];
      let longitude = place.geometry.coordinates[0][1];

      let model = document.createElement("a-image");
      let text = document.createElement("a-entity");
      let pinImage = document.createElement("a-image");

      model.setAttribute(
        "gps-entity-place",
        `latitude: ${longitude}; longitude: ${latitude};`
      );

      console.log(`latitude: ${longitude}; longitude: ${latitude};`);

      model.setAttribute("src", "./assets/marker.png");
      model.id = "pointer";
      model.setAttribute("scale", "2 2 2");

      text.setAttribute(
        "text",
        "value: " + place.properties.comment + "; align: center;  color: red;"
      );

      text.setAttribute("position", "0 0.8 0");

      model.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });

      // model.appendChild(text);
      // model.appendChild(pinImage);
      scene.appendChild(model);
    });
  };
}

fetchContact();
