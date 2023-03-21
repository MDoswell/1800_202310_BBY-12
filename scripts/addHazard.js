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
            var hazardLocation = form.elements["location"].value;

            console.log("ran add hazard");

            hazardRef.add({
                name: hazardName,
                type: hazardType,
                description: hazardDesc,
                // location: new firebase.firestore.GeoPoint(x[0], x[1]),
                location: hazardLocation,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()  //current system time
            }).then(doc => {
                console.log("Post document added!");
                console.log(doc.id);
                //saveNewPostID(user.uid, doc.id);
                if (imagefile) {
                    uploadPic(doc.id);
                }
            })
        }

        // Get the form element
        const form = document.getElementById("addHazardForm");

        // Add 'submit' event handler
        form.addEventListener("submit", (event) => {
            event.preventDefault();

            addHazard();
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
        }
    });

}