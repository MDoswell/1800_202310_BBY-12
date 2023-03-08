function addHazard() {
    //define a variable for the collection you want to create in Firestore to populate data
    var hazardRef = db.collection("hazards");

    console.log("ran add hazard");

    hazardRef.add({
        name: "Sample Hazard",
        description: "Some info about this hazard",
        location: [49.2467097082573, -122.9187029619698],
        timestamp: firebase.firestore.FieldValue.serverTimestamp()  //current system time
    });
}