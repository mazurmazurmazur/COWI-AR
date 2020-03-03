"use strict";

// navigator.geolocation.getCurrentPosition = fn => {
//   setTimeout(() => {
//     fn({
//       coords: {
//         accuracy: 40,
//         altitude: null,
//         altitudeAccuracy: null,
//         heading: null,
//         latitude: 49.80411975,
//         longitude: 19.04426897,
//         speed: null
//       },
//       timestamp: Date.now()
//     });
//   }, 2912);
// };

function fetchContact() {
  fetch("./json/lyngbyCropped.json")
    .then(res => res.json())
    .then(renderPlaces);
  // .then(yourFunction);
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
  //inserting coordinates into right corner div display
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
}

// function yourFunction() {
//   ////refreshing distance above geopoints
//   [...document.querySelectorAll(".geoPoint")].forEach(point => {
//     if (point.getAttribute("distance") < 700) {
//       //refreshing only up to 700m from the camera
//       point
//         .querySelector(".distDisplay")
//         .setAttribute(
//           "text",
//           `value: ${point.getAttribute("distanceMsg")}; color: green;`
//         );
//     }
//   });

//   //getting current location
//   getLocation();

//   setTimeout(yourFunction, 2000); ///recurrent function, looping for ever
// }

function renderPlaces(places) {
  let scene = document.querySelector("a-scene");
  places.features.forEach(place => {
    // if (place.geometry.type != "Point" &&
    //   place.geometry.type != "lineString" &&
    //   place.geometry.type != "MultiPolygon" && 
    //   place.geometry.type != "MultiLineString" &&
    //   place.geometry.type != "Polygon") {
    //   console.log(place.geometry.type);
    // }
    place.geometry.coordinates.forEach(coordinate => {


      let latitude = coordinate[0];
      let longitude = coordinate[1];
      // let altitude =
      //   coordinate[2] ?
      //     coordinate[2] :
      //     0;

      let model = document.createElement("a-entity");
      // let text = document.createElement("a-entity");
      let pinImage = document.createElement("a-image");
      // let dist = document.createElement("a-entity");

      model.setAttribute(
        "gps-entity-place",
        `latitude: ${longitude}; longitude: ${latitude};`
      );
      // model.setAttribute("distanceMsg", "");
      // model.setAttribute("distance", 0);
      // model.setAttribute("scale", "4 4 4");
      // model.setAttribute("position", `0 ${altitude} 0`);
      model.addEventListener("loaded", () => {
        window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
      });
      model.classList.add("geoPoint");

      // dist.setAttribute("text", "value: Distance Loading...; align: center; ");
      // dist.setAttribute("look-at", "#camra");
      // dist.setAttribute("scale", "8 8 8");
      // dist.setAttribute("position", "0 1.1 0");
      // dist.classList.add("distDisplay");

      // text.setAttribute(
      //   "text",
      //   "value: " + place.properties.comment + "; align: center;  color: red;"
      // );
      // text.setAttribute("look-at", "#camra");
      // text.setAttribute("scale", "8 8 8");
      // text.setAttribute("position", "0 0.8 0");

      pinImage.setAttribute("src", "./assets/marker.png");

      // model.appendChild(dist);
      // model.appendChild(text);
      model.appendChild(pinImage);
      scene.prepend(model);
    })


  });
}
///

window.onload = () => {
  ///when aframe and three are loaded, we start populating the geopoints
  fetchContact();
};

function connectPoints() {
  let previousPoint;
  let geoPoints = document.querySelectorAll(".geoPoint");
  console.log(geoPoints);
  geoPoints.forEach(function (point, i, array) {
    let currentPosition = point.getAttribute("position");
    if (previousPoint) {
      console.log(`previous point:`);
      console.log(previousPoint.getAttribute("position"));

      point.setAttribute(
        "line",
        `start: ${previousPoint.getAttribute("position").x +
        0.00001} ${previousPoint.getAttribute("position").y +
        0.00001} ${previousPoint.getAttribute("position").z +
        0.00001}; end: ${currentPosition.x} ${currentPosition.y} ${
        currentPosition.z
        };  color: red`
      );
    }

    console.log(`current point: `);
    console.log(point.getAttribute("position"));
    previousPoint = point;
  });

  Array.from(geoPoints)
    .slice()
    .reverse()
    .forEach(function (point, i, array) {
      let currentPosition = point.getAttribute("position");
      if (previousPoint) {
        console.log(`previous point:`);
        console.log(previousPoint.getAttribute("position"));

        point.setAttribute(
          "line__2",
          `start: ${previousPoint.getAttribute("position").x +
          0.00001} ${previousPoint.getAttribute("position").y +
          0.00001} ${previousPoint.getAttribute("position").z +
          0.00001}; end: ${currentPosition.x} ${currentPosition.y} ${
          currentPosition.z
          };  color: red`
        );
      }

      console.log(`current point: `);
      console.log(point.getAttribute("position"));
      previousPoint = point;
    });
}
