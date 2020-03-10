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


let dist = {
  x: 55.767062,
  y: 12.504497
}
let currentArr = [];
let currentString;
const calcDist = (x, y, plusLat, plusLong) => {
  let t = [
    x + plusLat,
    y + plusLong,
    x - plusLat,
    y - plusLong,]


  currentArr.push(
    [t[3], t[0]],
    [t[1], t[0]],
    [t[1], t[2]],
    [t[3], t[2]],
    [t[3], t[0]]);


  currentArr.forEach(a => {
    currentString ?
      currentString = currentString + a + " " :
      currentString = a.toString() + " ";
  })
  return currentString;
}

let XmlContent = `<wfs:GetFeature service="WFS" version="1.1.0" 
outputFormat="json" xmlns:gpms="https://cmv.cowi.com/geoserver/gpms" 
xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" 
xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xsi:schemaLocation="http://www.opengis.net/wfs 
http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
<wfs:Query  srsName="http://www.opengis.net/gml/srs/epsg.xml#4326" typeName="ar_test:lyngby_ar_test">
<Filter><Intersects><PropertyName>the_geom
</PropertyName><gml:MultiPolygon 
srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
<gml:polygonMember><gml:Polygon><gml:exterior><gml:LinearRing>
<gml:coordinates decimal="." cs="," ts=" ">
${calcDist(dist.x, dist.y, 0.0005, 0.001)}
</gml:coordinates></gml:LinearRing></gml:exterior></gml:Polygon>
</gml:polygonMember></gml:MultiPolygon></Intersects>
</Filter>
</wfs:Query></wfs:GetFeature>`

function sendReq() {


  var xhr = new XMLHttpRequest();
  xhr.open("POST", "https://cmv.cowi.com/geoserver/wfs/");

  var xmlDoc2;


  xhr.onreadystatechange = () => {
    if (xhr.readyState == 4 && xhr.status == 200) {
      xmlDoc2 = xhr.response;
      return xmlDoc2;
    }
  };

  xhr.setRequestHeader("Content-Type", "application/xml");
  xhr.send(XmlContent);
}





function fetchContact() {
  fetch("https://cmv.cowi.com/geoserver/wfs/", {
    method: 'post',
    body: XmlContent
  })
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
  console.log(places);
  let scene = document.querySelector("a-scene");
  places.features.forEach((place, placeIndex) => {
    // if (place.geometry.type != "Point" &&
    //   place.geometry.type != "lineString" &&
    //   place.geometry.type != "MultiPolygon" && 
    //   place.geometry.type != "MultiLineString" &&
    //   place.geometry.type != "Polygon") {
    //   console.log(place.geometry.type);
    // }
    place.geometry.coordinates.forEach(coordinatesWrapper => {

      coordinatesWrapper.forEach(coordinate => {
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
        model.classList.add("geoPoint", "geo" + placeIndex);

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
        scene.appendChild(model);

      })





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
  geoPoints.forEach(point => {
    let currentPosition = point.getAttribute("position");
    if (previousPoint && previousPoint.classList[1] == point.classList[1]) {
      point.setAttribute(
        "line",
        `start: 
        ${previousPoint.getAttribute("position").x} 
        ${previousPoint.getAttribute("position").y} 
        ${previousPoint.getAttribute("position").z}; 
        end: 
        ${currentPosition.x} 
        ${currentPosition.y} 
        ${currentPosition.z};
        color: red`
      );
    }
    previousPoint = point;
  });

  Array.from(geoPoints)
    .slice()
    .reverse()
    .forEach(point => {
      let currentPosition = point.getAttribute("position");
      if (previousPoint && previousPoint.classList[1] == point.classList[1]) {
        point.setAttribute(
          "line__2",
          `start: 
          ${previousPoint.getAttribute("position").x
          } ${previousPoint.getAttribute("position").y
          } ${previousPoint.getAttribute("position").z
          }; 
          end: 
          ${currentPosition.x} 
          ${currentPosition.y} 
          ${currentPosition.z
          };  color: red`
        );
      }
      previousPoint = point;
    });
}
