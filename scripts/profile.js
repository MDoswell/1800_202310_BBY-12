var currentUser;

function populateUserInfo() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {

            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid)
            //get the document for current user.
            currentUser.get()
                .then(userDoc => {
                    //get the data fields of the user
                    var userName = userDoc.data().name;
                    var userCity = userDoc.data().city;
                    // var userPicture = userDoc.data().pfp;
                    var userPoints = userDoc.data().points;
                    var userLevel = userDoc.data().level;

                    //if the data fields are not empty, then write them in to the form.
                    if (userName != null) {
                        document.getElementById("nameInput").value = userName;
                        document.getElementById("profile-goes-here").innerHTML = userName + "'s Profile";
                    }
                    if (userCity != null) {
                        document.getElementById("cityInput").value = userCity;
                    }
                    // if (userPicture != null) {
                    //     document.getElementById("pfpInput").value = userPicture;
                    // }
                    if (userPoints != null) {
                        document.getElementById("points-go-here").innerHTML = "Points: " + userPoints;
                    }
                    if (userLevel != null) {
                        document.getElementById("level-goes-here").innerHTML = "Level: " + userLevel;
                    }
                })
        } else {
            // No user is signed in.
            console.log("No user is signed in");
        }
    });
}

function editUserInfo() {
    //Enable the form fields
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo() {
    userName = document.getElementById('nameInput').value;       //get the value of the field with id="nameInput"
    userCity = document.getElementById('cityInput').value;     //get the value of the field with id="cityInput"
    // userpfp = document.getElementById('pfpInput').value;       //get the value of the field with id="pfpInput"

    currentUser.update({
        name: userName,
        city: userCity,
        // pfp: userpfp
    })
    .then(() => {
        console.log("Document successfully updated!");
    })

    document.getElementById('personalInfoFields').disabled = true;
    populateUserInfo();
}

//call the function to run it 
populateUserInfo();