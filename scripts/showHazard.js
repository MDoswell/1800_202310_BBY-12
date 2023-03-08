var hazard = "sample1";

console.log(hazard);

function showHazard(hazardID) {
    console.log(db.collection("hazards").get())

    var hazard = db.collection("hazards").doc(hazardID);

    hazard.get().then(hazardInfo => {
        console.log(hazardInfo.data().name);
    })
    // db.collection("hazards").doc(hazardID).get()   //the collection called "hazards"
        // .then(thisHazard => {
            // console.log(thisHazard.name);
    //         var title = doc.data().name;       // get value of the "name" key
    //             var details = doc.data().details;  // get value of the "details" key
	// 							var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
    //             var hikeLength = doc.data().length; //gets the length field
    //             let newcard = cardTemplate.content.cloneNode(true);

    // newcard.querySelector('.card-title').innerHTML = title;
    //             newcard.querySelector('.card-length').innerHTML = hikeLength +"km";
    //             newcard.querySelector('.card-text').innerHTML = details;
    //             newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg

        // })
    }

//                 db.collection("quotes").doc(day)                                                      //name of the collection and documents should matach excatly with what you have in Firestore
//                 .onSnapshot(tuesdayDoc => {                                                               //arrow notation
//                      console.log("current document data: " + tuesdayDoc.data());                          //.data() returns data object
//                      document.getElementById("quote-goes-here").innerHTML = tuesdayDoc.data().quote; 

//     let cardTemplate = document.getElementById("hikeCardTemplate");

//     db.collection(collection).get()   //the collection called "hikes"
//         .then(allHikes=> {
//             //var i = 1;  //Optional: if you want to have a unique ID for each hike
//             allHikes.forEach(doc => { //iterate thru each doc
//                 var title = doc.data().name;       // get value of the "name" key
//                 var details = doc.data().details;  // get value of the "details" key
// 								var hikeCode = doc.data().code;    //get unique ID to each hike to be used for fetching right image
//                 var hikeLength = doc.data().length; //gets the length field
//                 let newcard = cardTemplate.content.cloneNode(true);

//                 //update title and text and image
//                 newcard.querySelector('.card-title').innerHTML = title;
//                 newcard.querySelector('.card-length').innerHTML = hikeLength +"km";
//                 newcard.querySelector('.card-text').innerHTML = details;
//                 newcard.querySelector('.card-image').src = `./images/${hikeCode}.jpg`; //Example: NV01.jpg

//                 //Optional: give unique ids to all elements for future use
//                 // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
//                 // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
//                 // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

//                 //attach to gallery, Example: "hikes-go-here"
//                 document.getElementById(collection + "-go-here").appendChild(newcard);

//                 //i++;   //Optional: iterate variable to serve as unique ID
//             })
//         })
// }
