// Used to load the user's profile picture in places like the leaderboards and the hamburger menu
function loadPFP() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((userDoc) => {
        if (userDoc.data().image !== "") {
          document.getElementById("pfpPreview").src = userDoc.data().image;
        } else {
          document.getElementById("pfpPreview").src = "../images/profile.jpg";
        }
      });
    }
  });
}
loadPFP();
