window.onload = () => {
  let places = staticLoadPlaces();
  renderPlaces(places);
};

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

function staticLoadPlaces() {
  return [
    {
      name: "marker1",
      location: {
        lat: 55.767564,
        lng: 12.504835
      }
    },
    {
      name: "marker2",
      location: {
        lat: 55.767365,
        lng: 12.505554
      }
    },
    {
      name: "marker3",
      location: {
        lat: 55.766846,
        lng: 12.506949
      }
    },
    {
      name: "marker4",
      location: {
        lat: 55.766604,
        lng: 12.503194
      }
    },
    {
      name: "marker5",
      location: {
        lat: 55.766181,
        lng: 12.504524
      }
    },
    {
      name: "marker6",
      location: {
        lat: 55.765794,
        lng: 12.506487
      }
    }
  ];
}

function renderPlaces(places) {
  let scene = document.querySelector("a-scene");

  let i = 0;
  places.forEach(place => {
    i++;
    let latitude = place.location.lat;
    let longitude = place.location.lng;

    let model = document.createElement("a-image");
    model.setAttribute(
      "gps-entity-place",
      `latitude: ${latitude}; longitude: ${longitude};`
    );
    model.setAttribute("src", "./assets/marker.png");
    model.setAttribute("scale", "20 20 20");
    model.setAttribute("title", "attribute" + i);

    model.addEventListener("loaded", () => {
      window.dispatchEvent(new CustomEvent("gps-entity-place-loaded"));
    });

    scene.appendChild(model);
  });
}
