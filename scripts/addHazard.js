var imagefile;

function addFileChooserListener() {
    console.log("inside add File chooser listener");
    const fileInput = document.getElementById("hazardPhotoSelect"); // pointer #1

    console.log(fileInput.value);
    //attach listener to input file
    //when this file changes, do something
    fileInput.addEventListener('change', function (e) {
        imagefile = fileInput.value;
        const image = document.getElementById("hazardPicPreview"); // pointer #2
        image.src = imagefile;

        console.log("inside file chooser event handler!")
        //the change event returns a file "e.target.files[0]"
        imagefile = e.target.files[0];
        var blob = URL.createObjectURL(e.target.files[0]);

        //change the DOM img element source to point to this file
        image.src = blob; //assign the "src" property of the "img" tag
    })
}
addFileChooserListener();

function addSubmitButtonListener() {
    window.addEventListener("load", () => {
        function addHazard() {
            //define a variable for the collection in Firestore
            var hazardRef = db.collection("hazards");

            console.log(document.getElementById("hazardPhotoSelect").value);
            console.log(new firebase.firestore.GeoPoint(1, 2));

            var hazardName = form.elements["title"].value;
            var hazardType = form.elements["type"].value;
            var hazardDesc = form.elements["description"].value;
            // var hazardLocation = form.elements["location"].value;
            var hazardLat = coords.lat;
            var hazardLng = coords.lng;

            console.log("ran add hazard");

            hazardRef.add({
                name: hazardName,
                type: hazardType,
                description: hazardDesc,
                // location: new firebase.firestore.GeoPoint(x[0], x[1]),
                lat: hazardLat,
                lng: hazardLng,
                users: [],
                timestamp: firebase.firestore.FieldValue.serverTimestamp()  //current system time
            }).then(doc => {
                console.log("Post document added!");
                console.log(doc.id);
                //saveNewPostID(user.uid, doc.id);
                if (imagefile) {
                    uploadPic(doc.id);
                }
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                    let currentUser = db.collection("users").doc(user.uid);
                    currentUser.get().then(doc => {
                        let userPoints = doc.data().points;
                        currentUser.update({
                            points: userPoints + 3
                        });
                        levels();
                    });
                    }
                });
            })
        }

        // Get the form element
        const form = document.getElementById("addHazardForm");

        // Add 'submit' event handler
        form.addEventListener("submit", (event) => {
            if (coords) {
                event.preventDefault();

                addHazard();
            } else {
                event.preventDefault();
                alert("Location is not valid");
                // $("#hazardLocationField").popover({title: "Invalid location", placement: "left"});
                // console.log($("#hazardLocationField"))
            }

        });
    });
}
addSubmitButtonListener()



function uploadPic(postDocID) {
    console.log("inside uploadPic " + postDocID);
    var storageRef = storage.ref("images/" + postDocID + ".jpg");

    storageRef.put(imagefile)   //global variable ImageFile

        // AFTER .put() is done
        .then(function () {
            console.log('Uploaded to Cloud Storage.');
            storageRef.getDownloadURL()

                // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    console.log("Got the download URL.");
                    db.collection("hazards").doc(postDocID).update({
                        "image": url // Save the URL into users collection
                    })

                        // AFTER .update is done
                        .then(function () {
                            console.log('Added pic URL to Firestore.');
                        })
                })
        })
        .catch((error) => {
            console.log("error uploading to cloud storage");
        })
}

var coords;

function initAutoComplete() {
    const input = document.getElementById("hazardLocationField");

    const autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.addListener("place_changed", () => {
        //infowindow.close();
        //marker.setVisible(false);

        const place = autocomplete.getPlace();
        console.log(place);

        if (!place.geometry || !place.geometry.location) {
            // User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
        } else {
            // const x = place.geometry.location;
            console.log(place.geometry.location.lat());
            coords = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() };
            console.log(coords);
        }
    });

}

function getCurrentLocation() {
    console.log(navigator.geolocation);
    // Navigate current location
    window.navigator.geolocation.getCurrentPosition(success, error, {
        enableHighAccuracy: true,
        maximumAge: 0,
    });
}

//getCurrentLocation success function
function success(position) {
    let textbox = document.getElementById("hazardLocationField");
    coords = { lat: position.coords.latitude, lng: position.coords.longitude };
    console.log(coords);

    geocoder
        .geocode({ location: coords })
        .then((response) => {
            if (response.results[0]) {
                console.log(response.results[0]);
                let address = response.results[0].formatted_address;

                let addressString = address + " (" + coords.lat + coords.lng + ")";

                textbox.value = addressString;

            } else {
                window.alert("No results found");
            }
        })
        .catch((e) => window.alert("Geocoder failed due to: " + e));
}

//getCurrentLocation fail function
function error(err) {
    alert("Navigate fail = " + err.code);
}

var geocoder;

function initializeGeocoder() {
    geocoder = new google.maps.Geocoder();
}