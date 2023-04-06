var currentUser;
var imagefile;

function populateUserInfo() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      //go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        //get the data fields of the user
        var userName = userDoc.data().name;
        var userCity = userDoc.data().city;
        var userPicture = userDoc.data().image;
        var userPoints = userDoc.data().points;
        var userLevel = userDoc.data().level;
        console.log(userPicture);

        //if the data fields are not empty, then write them in to the form.
        if (userName != null) {
          document.getElementById("nameInput").value = userName;
          // document.getElementById("profile-goes-here").innerHTML = userName + "'s Profile";
        }
        if (userCity != null) {
          document.getElementById("cityInput").value = userCity;
        }
        // if (userPicture != "") {
        //     console.log("image: " + userDoc.data().image);
        //     document.getElementById("pfpPreview").src = userPicture;
        //     console.log("source of image: " + document.getElementById("pfpPreview").src);
        // } else {
        //     console.log("Default Image");
        //     document.getElementById("pfpPreview").src = "./images/profile.jpg";
        // }
        if (userPoints != null) {
          document.getElementById("points-go-here").innerHTML =
            "Points: " + userPoints;
        }
        if (userLevel != null) {
          document.getElementById("level-goes-here").innerHTML =
            "Level: " + userLevel;
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
  //Enable the form fields
  document.getElementById("personalInfoFields").disabled = false;
}

function saveUserInfo() {
  userName = document.getElementById("nameInput").value; //get the value of the field with id="nameInput"
  userCity = document.getElementById("cityInput").value; //get the value of the field with id="cityInput"

  currentUser
    .update({
      name: userName,
      city: userCity,
    })
    .then(() => {
      console.log(currentUser);
      if (imagefile) {
        uploadPic(currentUser.id);
      }
    });

  document.getElementById("personalInfoFields").disabled = true;
}

function addFileChooserListener() {
  console.log("inside add File chooser listener");
  const fileInput = document.getElementById("pfpInput"); // pointer #1

  console.log(fileInput.value);
  //attach listener to input file
  //when this file changes, do something
  fileInput.addEventListener("change", function (e) {
    imagefile = fileInput.value;
    const image = document.getElementById("pfpPreview"); // pointer #2
    image.src = imagefile;

    console.log("inside file chooser event handler!");
    //the change event returns a file "e.target.files[0]"
    imagefile = e.target.files[0];
    var blob = URL.createObjectURL(e.target.files[0]);

    //change the DOM img element source to point to this file
    image.src = blob; //assign the "src" property of the "img" tag
  });
}
addFileChooserListener();

function uploadPic(postDocID) {
  console.log("inside uploadPic " + postDocID);
  var storageRef = storage.ref("images/" + postDocID + ".jpg");

  storageRef
    .put(imagefile) //global variable ImageFile

    // AFTER .put() is done
    .then(function () {
      console.log("Uploaded to Cloud Storage.");
      storageRef
        .getDownloadURL()

        // AFTER .getDownloadURL is done
        .then(function (url) {
          // Get URL of the uploaded file
          console.log("Got the download URL: " + url);
          db.collection("users")
            .doc(postDocID)
            .update({
              image: url, // Save the URL into users collection
            })

            // AFTER .update is done
            .then(function () {
              console.log("Added pic URL to Firestore.");
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
