/* Called whenever a user gains points, in order to check if they have enough to progress to the next level. Uses preset values
for the first 5 levels, then uses an exponential formula to increase the requirements past that.*/
function levels() {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      let currentUser = db.collection("users").doc(user.uid);
      currentUser.get().then((doc) => {
        let floor = doc.data().currentFloor;
        let formula = doc.data().levelUpFormula;
        let targetLevel = doc.data().nextLevel;
        let userPoints = doc.data().points;
        let userLevel = doc.data().level;
        if (userPoints < 5) {
          currentUser.update({
            level: 1
          });
        } else if (userPoints >= 5 && userPoints < 15) {
          currentUser.update({
            level: 2
          });
        } else if (userPoints >= 15 && userPoints < 25) {
          currentUser.update({
            level: 3
          });
        } else if (userPoints >= 25 && userPoints < 50) {
          currentUser.update({
            level: 4
          });
        } else if (userPoints >= 50 && userPoints < 100) {
          currentUser.update({
            level: 5
          });
        } else if (
          userPoints >= floor &&
          userPoints < Math.round(floor * formula) &&
          userLevel < targetLevel
        ) {
          currentUser.update({
            level: userLevel + 1,
            nextLevel: targetLevel + 1
          });
        } else if (userPoints > floor * formula) {
          currentUser.update({
            currentFloor: floor * formula,
            nextLevel: targetLevel + 1,
            level: userLevel + 1
          });
        } else {
          // console.log("No levelling up occurred");
        }
      });
    }
  });
}
