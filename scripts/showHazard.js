var testHazard = "XcmmScDg5GyYKry0bx55";

console.log(testHazard);

function showHazard(hazardID) {
    console.log(db.collection("hazards").get())

    var hazard = db.collection("hazards").doc(hazardID);

    console.log(hazard);

    hazard.get().then(hazardInfo => {
        console.log(hazardInfo);
        console.log(hazardInfo.data().name);
        console.log(hazardInfo.data().type);
        console.log(hazardInfo.data().description);
        console.log(hazardInfo.data().location);
        console.log(hazardInfo.data().timestamp);

        date = new Date(hazardInfo.data().timestamp.seconds * 1000);

        document.getElementById("hazardTitle").innerHTML = hazardInfo.data().name;
        document.getElementById("hazardType").innerHTML = hazardInfo.data().type;
        document.getElementById("hazardDescription").innerHTML = hazardInfo.data().description;
        document.getElementById("hazardLocation").innerHTML = hazardInfo.data().location;
        document.getElementById("hazardTimestamp").innerHTML = date;
        document.getElementById("hazardImage").src = hazardInfo.data().image;
    })

    const button1 = document.getElementById("button1");
    button1.addEventListener("click", () => {addHelpful(hazardID)});
    const button2 = document.getElementById("button2");
    button2.addEventListener("click", () => {addNotHelpful(hazardID)});
    updateHelpfuls(hazardID);

    $("#hazardModal").modal("show");
}

function updateHelpfuls(hazardID) {
    let hazard = db.collection("hazards").doc(hazardID);
    let total;
    let numHelpful;
    hazard.get().then(hazardInfo => {
        total = hazardInfo.data().helpfuls + hazardInfo.data().nothelpfuls;
        numHelpful = hazardInfo.data().helpfuls;
        let perc = Math.round((numHelpful / total) * 100);
        if (total == 0) {
            perc = 0;
        }
        document.getElementById("helpful-text").innerHTML = numHelpful + " / " + total + " users found this helpful (" + perc
            + "%)";
        console.log("Updated helpful count");
    })
}

function addHelpful(hazardID) {
    console.log("Entered addHelpful function");
    let hazard = db.collection("hazards").doc(hazardID);
    let numHelpful;
    hazard.get().then(hazardInfo => {
        numHelpful = hazardInfo.data().helpfuls;
        hazard.update({
            helpfuls: numHelpful + 1
        })
        updateHelpfuls(hazardID);
        console.log("Successfully incremented numHelpful");
    })
    
    console.log("Added helpful");
}


function addNotHelpful(hazardID) {
    console.log("Entered addNotHelpful function");
    let hazard = db.collection("hazards").doc(hazardID);
    let numNotHelpful;
    hazard.get().then(hazardInfo => {
        numNotHelpful = hazardInfo.data().nothelpfuls;
        hazard.update({
            nothelpfuls: numNotHelpful + 1
        })
        updateHelpfuls(hazardID);
        console.log("Successfully incremented numNotHelpful");
    })
    console.log("Added nothelpful");
}