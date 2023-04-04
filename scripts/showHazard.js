// var testHazard = "XcmmScDg5GyYKry0bx55";

// console.log(testHazard);

// var currentUser = "rNj7ShOtWkfnOLDcLrZJD4Fscpn1";
var currentHazard;

function showHazard(hazardID) {
    console.log(db.collection("hazards").get())

    var hazard = db.collection("hazards").doc(hazardID);

    console.log(hazard);

    hazard.get().then(hazardInfo => {
        date = new Date(hazardInfo.data().timestamp.seconds * 1000);
        date = date.toDateString() + ", " + date.toLocaleTimeString();

        // let hazardLocation = hazardInfo.data().lat + ", " + hazardInfo.data().lng;

        let coords = { lat: hazardInfo.data().lat, lng: hazardInfo.data().lng };
        console.log(coords);

        geocoder
            .geocode({ location: coords })
            .then((response) => {
                if (response.results[0]) {
                    console.log(response.results[0]);
                    let address = response.results[0].formatted_address;

                    document.getElementById("hazardLocation").innerHTML = address;
                    // let addressString = address + " (" + coords.lat + coords.lng + ")";

                    // textbox.value = addressString;

                } else {
                    window.alert("No results found");
                    document.getElementById("hazardLocation").innerHTML = "Address not found";
                }


            })
            .catch((e) => window.alert("Geocoder failed due to: " + e));


        document.getElementById("hazardTitle").innerHTML = hazardInfo.data().name;
        document.getElementById("hazardType").innerHTML = hazardInfo.data().type;
        document.getElementById("hazardDescription").innerHTML = hazardInfo.data().description;
        document.getElementById("hazardLocation").innerHTML = "Loading address...";
        document.getElementById("hazardTimestamp").innerHTML = date;
        document.getElementById("hazardImage").src = "../images/pedestrian-logo.png";
        if (hazardInfo.data().image) {
            document.getElementById("hazardImage").src = hazardInfo.data().image;    
        }
        // document.getElementById("hazardImage").src = hazardInfo.data().image;
    })

    const button1 = document.getElementById("button1");
    button1.onclick = null;
    button1.onclick = () => { addHelpful(hazardID) };
    // button1.addEventListener("click", () => {addHelpful(hazardID)});
    console.log(button1.addEventListener);
    const button2 = document.getElementById("button2");
    button2.onclick = null;
    button2.onclick = () => { addNotHelpful(hazardID) };
    // button2.addEventListener("click", () => {addNotHelpful(hazardID)});
    updateHelpfuls(hazardID);
    $("#hazardModal").modal("show");
}

function updateHelpfuls(hazardID) {
    console.log(hazardID);
    let hazard = db.collection("hazards").doc(hazardID);
    let total;
    let numHelpful;
    hazard.get().then(hazardInfo => {
        total = hazardInfo.data().helpfuls + hazardInfo.data().nothelpfuls;
        numHelpful = hazardInfo.data().helpfuls;
        let perc = Math.round((numHelpful / total) * 100);
        if (total == 0) {
            perc = 0;
        }
        document.getElementById("helpful-text").innerHTML = numHelpful + " / " + total + " users found this helpful (" + perc
            + "%)";
        console.log("Updated helpful count");
    })
}

function addHelpful(hazardID) {
    console.log(hazardID);
    console.log("Entered addHelpful function");
    let hazard = db.collection("hazards").doc(hazardID);
    let numHelpful;
    console.log(currentUser);
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user.uid;
            console.log(currentUser);
            currentHazard = hazard.get().then(doc => {
                console.log(doc);
                let users = doc.data().users;
                console.log(currentHazard);
                if (users.includes(currentUser)) {
                    console.log("You've already pressed the button!!!1!!11!!111!");
                } else {
                    hazard.get().then(hazardInfo => {
                        numHelpful = hazardInfo.data().helpfuls;
                        hazard.update({
                            helpfuls: numHelpful + 1,
                            users: firebase.firestore.FieldValue.arrayUnion(currentUser)
                        })
                        updateHelpfuls(hazardID);
                        console.log("Successfully incremented numHelpful");
                    });
                    let userPoints = db.collection("users").doc(currentUser);
                    userPoints.get().then(doc => {
                        let addPoints = doc.data().points;
                        let addHelpful = doc.data().numHelpful;
                        userPoints.update({
                            points: addPoints + 2,
                            numHelpful: addHelpful + 1
                        });
                        levels();
                    });
                };
                console.log("Added helpful");
            });
        }
    });
}


function addNotHelpful(hazardID) {
    console.log(hazardID);
    console.log("Entered addNotHelpful function");
    let hazard = db.collection("hazards").doc(hazardID);
    let numNotHelpful;
    currentHazard = hazardID;
    console.log(currentHazard);
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            currentUser = user.uid;
            console.log(currentUser);
            currentHazard = hazard.get().then(doc => {
                let users = doc.data().users;
                console.log(currentHazard);
                if (users.includes(currentUser)) {
                    console.log("You've already pressed the button!!!1!!11!!111!");
                } else {
                    hazard.get().then(hazardInfo => {
                        numNotHelpful = hazardInfo.data().nothelpfuls;
                        hazard.update({
                            nothelpfuls: numNotHelpful + 1,
                            users: firebase.firestore.FieldValue.arrayUnion(currentUser)
                        });
                        updateHelpfuls(hazardID);
                        console.log("Successfully incremented numHelpful");
                    });
                    let userPoints = db.collection("users").doc(currentUser);
                    userPoints.get().then(doc => {
                        let addPoints = doc.data().points;
                        userPoints.update({
                            points: addPoints + 1
                        });
                        levels();
                    });
                };
                console.log("Added helpful");
            });
        }
    });
}

var geocoder;

function initializeGeocoder() {
    geocoder = new google.maps.Geocoder();
}