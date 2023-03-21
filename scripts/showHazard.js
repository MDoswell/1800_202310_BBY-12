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

    $("#hazardModal").modal("show");
}