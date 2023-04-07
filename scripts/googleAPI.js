var map;
var locationMarker;

//Run google map and navigating when enter the main page.
function initMap() {
  // Temporary start position of map
  var center = new google.maps.LatLng(49.25, -123);

  // Initial location of a map
  map = new google.maps.Map($("#map").get(0), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 16,
    center: center,
    // Remove Google default marker
    styles: [
      {
        featureType: "poi",
        elementType: "labels",
        stylers: [{ visibility: "off" }],
      },
    ],
  });

  locationMarker = new google.maps.Marker({
    position: center, // location : ,
    title: "Current Location", // title : ,
    map: map, // map object :
    hazardId: "Current Location",
  });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Navigate current location
        id = window.navigator.geolocation.watchPosition(success, error, {
          enableHighAccuracy: true,
          maximumAge: 0,
        });
      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
  // Navigate current location
  id = window.navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 0,
  });

  // Stop navigating
  // window.navigator.geolocation.clearWatch(id);
}

function success(position) {
  var center = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );

  // Initial location of a map
  map.setCenter(center);

  $("#location").text(
    "current latitude = " +
      position.coords.latitude +
      " current longitude = " +
      position.coords.longitude
  );

  locationMarker.setPosition(center);

  // console.log(locationMarker.hazardId);
}

//Fail function
function error(err) {
  let popup = document.getElementById("error_window");
  popup.innerHTML = "Navigate fail = " + err;
  popup.style.display = "block";
  // alert("Navigate fail = ");
}
