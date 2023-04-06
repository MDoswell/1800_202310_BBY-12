// Create community
function createCommunity() {
  // console.log("inside create community")
  let Tag = document.getElementById("tag").value;
  let Location = document.getElementById("location").value;
  let Name = document.getElementById("name").value;
  let Description = document.getElementById("description").value;
  // console.log(Tag, Location, Name, Description);

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid; //check the name of the creator
      //get the document for current user.
      currentUser.get().then((userDoc) => {
        db.collection("communities")
          .add({
            creater: userID,
            tag: Tag,
            location: Location,
            name: Name,
            description: Description,
            member: "0", //initialize the number of the member
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            window.location.href = "community.html"; //new line added
          });
      });
    } else {
      // console.log("No user is signed in");
      window.location.href = "community.html";
    }
  });
}
