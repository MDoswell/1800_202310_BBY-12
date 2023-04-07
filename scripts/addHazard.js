// Stores the path to an image uploaded by the user
var imagefile;

/* Adds a listener to the file input element of the hazard details form
  that updates the preview image when an image is uploaded. */
function addFileChooserListener() {
  const fileInput = document.getElementById("hazardPhotoSelect"); // pointer #1
  // Attach listener to input file
  // When this file changes, do something
  fileInput.addEventListener("change", function (e) {
    imagefile = fileInput.value;
    const image = document.getElementById("hazardPicPreview"); // pointer #2
    image.src = imagefile;

    // The change event returns a file "e.target.files[0]"
    imagefile = e.target.files[0];
    var blob = URL.createObjectURL(e.target.files[0]);

    // Change the DOM img element source to point to this file
    image.src = blob; //assign the "src" property of the "img" tag
  });
}
/* Call this function immediately */
addFileChooserListener();

/* Adds a listener to the submit button of the add hazard form that gets all
  information enetered into the form */
function addSubmitButtonListener() {
  window.addEventListener("load", () => {
    function addHazard() {
      //define a variable for the collection in Firestore
      var hazardRef = db.collection("hazards");
      // define variables for the inputs to the form fields
      var hazardName = form.elements["title"].value;
      var hazardType = form.elements["type"].value;
      var hazardDesc = form.elements["description"].value;
      var hazardLat = coords.lat;
      var hazardLng = coords.lng;
      var thisHazardCommunities = hazardCommunities;

      /* Add the form data to the firestore document + initialize fields
        users, helpfuls, and notHelpfuls */
      hazardRef
        .add({
          name: hazardName,
          type: hazardType,
          description: hazardDesc,
          lat: hazardLat,
          lng: hazardLng,
          users: [],
          communities: thisHazardCommunities,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(), // Current system time
          helpfuls: 0,
          nothelpfuls: 0,
        })
        .then((doc) => {
          // Increase the user's points for adding a hazard
          firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              let currentUser = db.collection("users").doc(user.uid);
              currentUser.get().then((doc) => {
                let userPoints = doc.data().points;
                currentUser.update({
                  points: userPoints + 3,
                  numHazards: doc.data().numHazards + 1,
                });
                levels();
              });
            }
          });
          // If image is uploaded, handle upload. Otherwise, return to the main page
          if (imagefile) {
            uploadPic(doc.id);
          } else {
            window.location.href = "main.html?docID=" + doc.id;
          }
        });
    }
    // Get the form element
    const form = document.getElementById("addHazardForm");
    // Add 'submit' event handler
    form.addEventListener("submit", (event) => {
      if (coords) {
        // Prevent form submission if required fields are not filled out
        event.preventDefault();
        addHazard();
      } else {
        event.preventDefault();
        alert("Location is not valid");
      }
    });
  });
}
/* Call this function immediately */
addSubmitButtonListener();

/* Adds the image uploaded to the add hazard page to the firebase storage,
  thens adds a url to it to the firestore document for the hazard being added. */
function uploadPic(postDocID) {
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef
    .put(imagefile) // Global variable ImageFile
    // AFTER .put() is done
    .then(function () {
      storageRef
        .getDownloadURL()
        // AFTER .getDownloadURL is done
        .then(function (url) {
          // Get URL of the uploaded file
          db.collection("hazards")
            .doc(postDocID)
            .update({
              image: url, // Save the URL into users collection
            })
            // AFTER .update is done
            .then(function () {
              window.location.href = "main.html?docID=" + postDocID;
            });
        });
    })
    .catch((error) => {
      // console.log("error uploading to cloud storage");
    });
}

// An array holding the community tags that the user is attaching to the hazard
var hazardCommunities = [];

/* Get the list of all communities that the user has joined, and for each of
  those communities, add a button to the communities field of the add hazard
  page. The button adds the community tage to this hazard */
function getUserCommunities() {
  firebase.auth().onAuthStateChanged((user) => {

    // Check if user is signed in:
    if (user) {

      // Go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      let communityList = [];
      db.collection("community-member-list")
        .get() // The collection called "community-member-list"
        .then((memberships) => {

          // Add the ID of each community joined to communityList
          memberships.forEach((doc) => {
            if (doc.data().member == user.uid) {
              communityList.push(doc.data().community);
            }
          });

          /* For each community in communityList, create a button with that
            that community's name, and attach it to the communities field
            on the add hazard page. */
          for (var i = 0; i < communityList.length; i++) {
            let communityID = communityList[i];
            db.collection("communities")
              .doc(communityID)
              .get()
              .then((doc) => {
                let newButton = document.createElement("button");
                newButton.type = "button";
                newButton.innerHTML = doc.data().name;
                newButton.id = "button-" + communityID;
                newButton.classList.add("btn");
                newButton.classList.add("btn-outline-primary");

                /* When button is clicked, toggle appearance and inclusion of
                  this community tag in firestore document */
                newButton.addEventListener("click", () => {
                  let thisButton = document.getElementById(newButton.id);
                  if (hazardCommunities.includes(communityID)) {
                    let index = hazardCommunities.indexOf(communityID);
                    hazardCommunities.splice(index, 1);
                    thisButton.classList.remove("btn-primary");
                    thisButton.classList.add("btn-outline-primary");
                  } else {
                    hazardCommunities.push(communityID);
                    thisButton.classList.remove("btn-outline-primary");
                    thisButton.classList.add("btn-primary");
                  }
                });
                $("#community-buttons").append(newButton);
              });
          }
        });
    } else {
      // No user is signed in.
      // console.log("No user is signed in");
    }
  });
}
// Call this function immediately
getUserCommunities();

// Store the coordinates the user attaches to the hazard
var coords;

/* Uses the Google Maps Autocomplete API to allow users to enter a hazard 
  in the location text input. That location is stored in coords*/
function initAutoComplete() {
  const input = document.getElementById("hazardLocationField");

  // Initialize Autocomplete API
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry || !place.geometry.location) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert("No details available for input: '" + place.name + "'");
      return;
    } else {
      // if successful, update coords
      coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };
    }
  });
}

/* Get the user's location automatically. If successful, location is stored in
  coords, then reverse geocoded so that the human-readable address appears
  in the location text input. If failed, alert user. */
function getCurrentLocation() {
  // Navigate current location
  window.navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 0,
  });
}

// GetCurrentLocation success function
function success(position) {
  let textbox = document.getElementById("hazardLocationField");

  // Update coords
  coords = { lat: position.coords.latitude, lng: position.coords.longitude };

  // Use reverse geocoding to display address
  geocoder
    .geocode({ location: coords })
    .then((response) => {
      if (response.results[0]) {
        let address = response.results[0].formatted_address;
        let addressString = address + " (" + coords.lat + coords.lng + ")";
        textbox.value = addressString;
      } else {
        window.alert("No results found");
      }
    })
    .catch((e) => window.alert("Geocoder failed due to: " + e));
}

// GetCurrentLocation fail function
function error(err) {
  alert("Navigate fail = " + err.code);
}

// Global variable to hold geocoder
var geocoder;

// Initialize Google geocoding API
function initializeGeocoder() {
  geocoder = new google.maps.Geocoder();
}
