"use strict";

window.addEventListener("load", function() {
  getLocation();
});

let x = document.getElementById("demo");
let geoPoints;

const calcDist = (x, y, plusLat, plusLong) => {
  ///function getting current coordinates, creating a rectangle around us in which the lines are rendered
  let currentArr = [];
  let currentString;
  let t = [
    (x + plusLat).toFixed(10), //precision up to ten numbers after coma
    (y + plusLong).toFixed(10),
    (x - plusLat).toFixed(10),
    (y - plusLong).toFixed(10)
  ];

  currentArr.push(
    [t[3], t[0]],
    [t[1], t[0]],
    [t[1], t[2]],
    [t[3], t[2]],
    [t[3], t[0]]
  );

  currentArr.forEach(a => {
    ///translating an array into a string and formatting for XML <gml:coordinates> tag
    currentString
      ? (currentString = currentString + a + " ")
      : (currentString = a.toString() + " ");
  });
  return currentString;
};

let XmlContent = (xCoord, yCoord) =>
  `<wfs:GetFeature service="WFS" version="1.1.0" outputFormat="json" xmlns:gpms="https://cmv.cowi.com/geoserver/gpms" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.1.0/wfs.xsd">
<wfs:Query srsName="http://www.opengis.net/gml/srs/epsg.xml#4326" typeName="ar_test:copenhagen_nv_ar_test">
    <Filter>
        <Intersects>
            <PropertyName>the_geom</PropertyName>
            <gml:MultiPolygon srsName="http://www.opengis.net/gml/srs/epsg.xml#4326">
                <gml:polygonMember>
                    <gml:Polygon>
                        <gml:exterior>
                            <gml:LinearRing>
                                <gml:coordinates decimal="." cs="," ts=" ">
                                ${calcDist(xCoord, yCoord, 0.0005, 0.001)}
                                </gml:coordinates>
                            </gml:LinearRing>
                        </gml:exterior>
                    </gml:Polygon>
                </gml:polygonMember>
            </gml:MultiPolygon>
        </Intersects>
    </Filter>
</wfs:Query>
</wfs:GetFeature>`;

function fetchContact(xCoor, yCoor) {
  //fetching data from geoserver
  fetch(
    "https://cors-anywhere.herokuapp.com/https://cmv.cowi.com/geoserver/wfs/",
    {
      method: "post",
      body: XmlContent(xCoor, yCoor)
    }
  )
    .then(res => res.json())
    .then(renderPlaces)
    .then(connectPointsHandler);
}

function getLocation() {
  return navigator.geolocation.getCurrentPosition(showPosition);
}

function showPosition(position) {
  x.innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;

  fetchContact(position.coords.latitude, position.coords.longitude);
}

const removeElements = elms => elms.forEach(el => el.remove()); //function for removing all elements with particular e.g. class

function renderPlaces(places) {
  console.log(places);
  let scene = document.querySelector("a-scene");
  places.features.forEach((place, placeIndex) => {
    place.geometry.coordinates.forEach(coordinatesWrapper => {
      coordinatesWrapper.forEach(coordinate => {
        let latitude = coordinate[0];
        let longitude = coordinate[1];
        // let altitude = coordinate[2] ? coordinate[2] : -2; //if altitude set, use it, otherwise set it to -2
        let model = document.createElement("a-entity");
        let pinImage = document.createElement("a-image");
        model.setAttribute(
          "gps-entity-place",
          `latitude: ${longitude}; longitude: ${latitude};`
        );
        // model.setAttribute("position", `0 ${altitude} 0`);
        model.classList.add("geoPoint", "geo" + placeIndex);
        pinImage.setAttribute("src", "./assets/marker.png");
        pinImage.setAttribute("look-at", "#camra");
        model.appendChild(pinImage);
        scene.appendChild(model);
      });
    });
  });
  geoPoints ? removeElements(geoPoints) : null;
}

let connectPoints = (geoPointsParameter, line_id) => {
  let previousPoint;
  geoPointsParameter.forEach(point => {
    let currentPosition = point.getAttribute("position");
    if (previousPoint && previousPoint.classList[1] == point.classList[1]) {
      point.setAttribute(
        line_id,
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
};

function connectPointsHandler() {
  geoPoints = document.querySelectorAll(".geoPoint");
  let geoPointsReversed = Array.from(geoPoints)
    .slice()
    .reverse();
  connectPoints(geoPoints, "line");
  connectPoints(geoPointsReversed, "line_2");
}

setInterval(getLocation(), 10000);
