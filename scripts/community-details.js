function displayCommunityInfo() {
  let params = new URL(window.location.href); //get URL of search bar
  let ID = params.searchParams.get("docID"); //get value for key "id"
  let count = 0;

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //get the document for current user.
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then((userDoc) => {
        db.collection("communities")
          .doc(ID)
          .get()
          .then((doc) => {
            thisCommunity = doc.data();
            communityName = thisCommunity.name;
            document.getElementById("community-name").innerHTML = communityName;

            db.collection("community-member-list")
              .get()
              .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                  // Access each document within the "communities" collection here
                  var communityID = doc.data().community;
                  var memberID = doc.data().member;

                  if (communityID == ID && memberID == userID) {
                    count++;
                  }         
                });

                // Only appear when user didn't join.
                if (count == 0) {
                  let a = document.createElement("a");
                  a.className = "btn btn-primary";
                  a.setAttribute("onclick", "joinCommunity()");
                  let text = document.createTextNode("JOIN");
                  a.appendChild(text);
                  document.getElementById("joinButton").append(a);
                }
              })
              .catch((error) => {
                console.error("Error getting documents: ", error);
              });
          });
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "community.html";
    }
  });
}
displayCommunityInfo();

function joinCommunity() {
  console.log("inside community detail join function");
  let params = new URL(window.location.href); //get URL of search bar
  let communityID = params.searchParams.get("docID"); //get value for key "id"

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      //get the document for current user.
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then((userDoc) => {
        db.collection("community-member-list")
          .add({
            community: communityID,
            member: userID,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            window.location.href = "community-details.html?docID=" + communityID; 
          });
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "community.html";
    }
  });
}
