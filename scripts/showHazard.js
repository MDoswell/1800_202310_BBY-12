// Global variable to hold the ID of the current hazard
var currentHazard;

/* Opens the hazard modal for the hazard of the given ID, and populates that
  modal with all of the hazard details. */
function showHazard(hazardID) {
  var hazard = db.collection("hazards").doc(hazardID);

  // Get the hazard by ID from the database
  hazard.get().then((hazardInfo) => {
    // convert timestamp to more readable format
    date = new Date(hazardInfo.data().timestamp.seconds * 1000);
    date = date.toDateString() + ", " + date.toLocaleTimeString();

    // get hazard coordinates
    let coords = { lat: hazardInfo.data().lat, lng: hazardInfo.data().lng };

    // Reverse geocode coordinates to get a human-readable address
    geocoder
      .geocode({ location: coords })
      .then((response) => {
        if (response.results[0]) {
          let address = response.results[0].formatted_address;
          document.getElementById("hazardLocation").innerHTML = address;
        } else {
          window.alert("No results found");
          document.getElementById("hazardLocation").innerHTML =
            "Address not found";
        }
      })
      .catch((e) => window.alert("Geocoder failed due to: " + e));

    // Fill elements of hazard modal with details from the database
    document.getElementById("hazardTitle").innerHTML = hazardInfo.data().name;
    document.getElementById("hazardType").innerHTML = hazardInfo.data().type;
    document.getElementById("hazardDescription").innerHTML =
      hazardInfo.data().description;
    document.getElementById("hazardLocation").innerHTML = "Loading address...";
    document.getElementById("hazardTimestamp").innerHTML = date;

    // Use a default hazard image, then replace with this hazard's image if one exists
    document.getElementById("hazardImage").src =
      "../images/pedestrian-logo.png";
    if (hazardInfo.data().image) {
      document.getElementById("hazardImage").src = hazardInfo.data().image;
    }
  });

  // Add "helpful" and "not helpful" buttons
  const button1 = document.getElementById("button1");
  button1.onclick = null;
  button1.onclick = () => {
    addHelpful(hazardID);
  };
  const button2 = document.getElementById("button2");
  button2.onclick = null;
  button2.onclick = () => {
    addNotHelpful(hazardID);
  };
  updateHelpfuls(hazardID);
  $("#hazardModal").modal("show");
}

/* Update the details about the number of users that found this hazard helpful
  on the hazard modal */
function updateHelpfuls(hazardID) {
  let hazard = db.collection("hazards").doc(hazardID);
  let total;
  let numHelpful;
  hazard.get().then((hazardInfo) => {
    total = hazardInfo.data().helpfuls + hazardInfo.data().nothelpfuls;
    numHelpful = hazardInfo.data().helpfuls;
    // percentage of users who rated "helpful" out of all users who rated
    let perc = Math.round((numHelpful / total) * 100);
    if (total == 0) {
      perc = 0;
    }
    document.getElementById("helpful-text").innerHTML =
      numHelpful + " / " + total + " users found this helpful (" + perc + "%)";
  });
}

/* Checks whether a user has already rated the hazard of the given ID, and if
  not, increases the number of "helpful" ratings on that hazard by 1 */
function addHelpful(hazardID) {
  let hazard = db.collection("hazards").doc(hazardID);
  let numHelpful;
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user.uid;
      console.log(currentUser);
      currentHazard = hazard.get().then((doc) => {
        let users = doc.data().users;
        if (users.includes(currentUser)) {
          // console.log("Rating button has already been pressed");
        } else {
          hazard.get().then((hazardInfo) => {
            numHelpful = hazardInfo.data().helpfuls;

            /* increment "helpful" ratings, and add user to the list of user who
              have rated this hazard */
            hazard.update({
              helpfuls: numHelpful + 1,
              users: firebase.firestore.FieldValue.arrayUnion(currentUser),
            });
            updateHelpfuls(hazardID);
          });

          // Give the user points for rating the hazard
          let userPoints = db.collection("users").doc(currentUser);
          userPoints.get().then((doc) => {
            let addPoints = doc.data().points;
            let addHelpful = doc.data().numHelpful;
            userPoints.update({
              points: addPoints + 2,
              numHelpful: addHelpful + 1,
            });
            levels();
          });
        }
      });
    }
  });
}

/* Checks whether a user has already rated the hazard of the given ID, and if
  not, increases the number of "not helpful" ratings on that hazard by 1 */
function addNotHelpful(hazardID) {
  let hazard = db.collection("hazards").doc(hazardID);
  let numNotHelpful;
  currentHazard = hazardID;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = user.uid;
      currentHazard = hazard.get().then((doc) => {
        let users = doc.data().users;
        if (users.includes(currentUser)) {
          // console.log("Rating button has already been pressed");
        } else {
          hazard.get().then((hazardInfo) => {
            numNotHelpful = hazardInfo.data().nothelpfuls;
            hazard.update({
              /* increment "not helpful" ratings, and add user to the list of user who
                have rated this hazard */
              nothelpfuls: numNotHelpful + 1,
              users: firebase.firestore.FieldValue.arrayUnion(currentUser),
            });
            updateHelpfuls(hazardID);
          });

          // Give the user points for rating the hazard
          let userPoints = db.collection("users").doc(currentUser);
          userPoints.get().then((doc) => {
            let addPoints = doc.data().points;
            userPoints.update({
              points: addPoints + 1,
            });
            levels();
          });
        }
      });
    }
  });
}

// Global variable to hold geocoder
var geocoder;

// Initialize Google geocoding API
function initializeGeocoder() {
  geocoder = new google.maps.Geocoder();
}
