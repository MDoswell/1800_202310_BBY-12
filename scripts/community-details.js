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
                }else{
                  let a = document.createElement("a");
                  a.className = "btn btn-primary";
                  a.setAttribute("onclick", "leaveCommunity()");
                  let text = document.createTextNode("LEAVE");
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
            db.collection("communities").doc(communityID).update({
              member: firebase.firestore.FieldValue.increment(1)
            });
            window.location.href = "community-details.html?docID=" + communityID; 
          });
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "community.html";
    }
  });
}

function leaveCommunity() {
  let params = new URL(window.location.href);
  let communityID = params.searchParams.get("docID");

  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      var currentUser = db.collection("users").doc(user.uid);
      var userID = user.uid;
      currentUser.get().then((userDoc) => {
        db.collection("community-member-list")
          .where("community", "==", communityID)
          .where("member", "==", userID)
          .get()
          .then((querySnapshot) => {    
            querySnapshot.forEach((doc) => {
              doc.ref.delete().then(() => {
                // Update number of members in community document
                db.collection("communities").doc(communityID).update({
                  member: firebase.firestore.FieldValue.increment(-1)
                });
                window.location.href = "community.html"; 
              }).catch((error) => {
                console.error("Error removing document: ", error);
              });
            });
          })
          .catch((error) => {
            console.error("Error getting documents: ", error);
          });
      });
    } else {
      console.log("No user is signed in");
      window.location.href = "community.html";
    }
  });
}