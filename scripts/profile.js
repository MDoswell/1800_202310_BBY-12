var currentUser;
var imagefile;

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      // Go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      // Get the document for current user.
      currentUser.get().then((userDoc) => {
        // Get the data fields of the user
        var userName = userDoc.data().name;
        var userCity = userDoc.data().city;
        var userPicture = userDoc.data().image;
        var userPoints = userDoc.data().points;
        var userLevel = userDoc.data().level;
        console.log(userPicture);

                    // If the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    if (userPoints != null) {
                        document.getElementById("points-go-here").innerHTML = "Points: " + userPoints;
                    }
                    if (userLevel != null) {
                        document.getElementById("level-goes-here").innerHTML = "Level: " + userLevel;
                    }
                    document.getElementById("pfpPreview").src = userPicture;
                });
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function editUserInfo() {
  // Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('nameInput').value; // Get the value of the field with id="nameInput"
    userCity = document.getElementById('cityInput').value; // Get the value of the field with id="cityInput"

    currentUser.update({ // Updates the name and city values in Firestore
        name: userName,
        city: userCity
    })
    .then(() => {
        console.log(currentUser); // If there has been a file uploaded, then it will be saved to Firestore
        if (imagefile) {
            uploadPic(currentUser.id);
        }
    })

    document.getElementById('personalInfoFields').disabled = true; // Resets the input fields to be unchangeable
}

function addFileChooserListener() {
    const fileInput = document.getElementById("pfpInput"); // Pointer to the file upload field

    console.log(fileInput.value);
    // Attach listener to input file
    // When this file changes, send it to Firestore
    fileInput.addEventListener('change', function (e) {
        imagefile = fileInput.value;
        const image = document.getElementById("pfpPreview"); // Pointer to the preview of the profile image
        image.src = imagefile;

        // The change event returns a file "e.target.files[0]"
        imagefile = e.target.files[0];
        var blob = URL.createObjectURL(e.target.files[0]);

    // Change the DOM img element source to point to this file
    image.src = blob; // Assign the "src" property of the "img" tag
  });
}
addFileChooserListener();

function uploadPic(postDocID) {
    var storageRef = storage.ref("images/" + postDocID + ".jpg"); // Reference to the image in Firestore storage

    storageRef.put(imagefile)   // Global variable ImageFile gets uploaded to the cloud storage

        // AFTER .put() is done
        .then(function () {
            storageRef.getDownloadURL()

                // AFTER .getDownloadURL is done
                .then(function (url) { // Get URL of the uploaded file
                    db.collection("users").doc(postDocID).update({
                        image: url // Save the URL into users collection
                    })

                        // AFTER .update is done
                        .then(function () { // Updates the image so that it remains accurate
                            populateUserInfo();
                        });
                });
        })
        .catch((error) => {
            console.log("error uploading to cloud storage: " + error);
        });
}

//call the function to run it
populateUserInfo();
