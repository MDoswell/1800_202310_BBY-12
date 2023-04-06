let currentFloor = 100;
let formula = 1.595257;
let targetLevel = 6;
function levels() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((doc) => {
        let userPoints = doc.data().points;
        let userLevel = doc.data().level;
        if (userPoints < 5) {
          currentUser.update({
            level: 1,
          });
        } else if (userPoints >= 5 && userPoints < 15) {
          currentUser.update({
            level: 2,
          });
        } else if (userPoints >= 15 && userPoints < 25) {
          currentUser.update({
            level: 3,
          });
        } else if (userPoints >= 25 && userPoints < 50) {
          currentUser.update({
            level: 4,
          });
        } else if (userPoints >= 50 && userPoints < 100) {
          currentUser.update({
            level: 5,
          });
        } else if (
          userPoints >= currentFloor &&
          userPoints < Math.round(currentFloor * formula) &&
          userLevel < targetLevel
        ) {
          currentUser.update({
            level: userLevel + 1,
          });
        } else if (userPoints > currentFloor * formula) {
          currentFloor = currentFloor * formula;
          targetLevel = targetLevel + 1;
        } else {
          console.log("Somehow you broke the levelling system...");
          alert("You somehow broke the levelling system...");
        }
      });
    }
  });
}
