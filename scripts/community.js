// move to add community page
function createCommuity(){
    window.location.href='community-create.html';
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------
function displayCardsDynamically(collection) {
    let cardTemplate = document.getElementById("communityCardTemplate");

    db.collection(collection).get()   //the collection called "hikes"
        .then(allCommunities=> {
            //var i = 1;  //Optional: if you want to have a unique ID for each hike
            allCommunities.forEach(doc => { //iterate thru each doc
                var tag = doc.data().tag;       // get value of the "tag" key
                var name = doc.data().name;       // get value of the "name" key
                var location = doc.data().location;       // get value of the "location" key
                var description = doc.data().description;  // get value of the "description" key
                var member = doc.data().member;  // get value of the "details" key

                // Attach a listener to the database reference
                // databaseRef.on('value', function(snapshot) {
                // // Get the number of children in the snapshot
                // var numChildren = snapshot.numChildren();
                // console.log('Number of data:', numChildren);
                // });

                // db.collection("community-member-list").get().then(querySnapshot => {
                //     const members = querySnapshot.doc().member;
                //     console.log("22" + members);
                // }).catch(error => {
                //     console.error("Error getting collection size:", error);
                // });
 
                var docID = doc.id;
                console.log(docID);
                let newcard = cardTemplate.content.cloneNode(true);

                var badgeColor;
                switch(tag) {
                    case "Dog walker":
                        badgeColor = "bg-secondary";
                        break;
                    case  "Stroller":
                        badgeColor = "bg-primary";
                        break;
                    default:
                        badgeColor = "bg-success";
                }
                //update title and text and image
                newcard.querySelector('.card-header').innerHTML = '<span class="badge rounded-pill ' + badgeColor + '">'+ tag + '</span>';
                newcard.querySelector('.card-title').innerHTML = name;
                newcard.querySelector('.card-text-location').innerHTML = location;
                newcard.querySelector('.card-text').innerHTML = description;
                newcard.querySelector('.card-text-number').innerHTML = member +" Members";
                newcard.querySelector('a').href = "community-details.html?docID="+docID;

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            })
        })
}
displayCardsDynamically("communities");  //input param is the name of the collection

// function search(){
//     var serachInputVal = document.getElementById("search").value;
//     console.log(serachInputVal);


//     db.collection("communities")
//     .where("name", ">=", serachInputVal)
//     .where("name", "<=", serachInputVal + "\uf8ff")
//     .get()
//     .then(querySnapshot => {
//       // Loop through the documents in the query results
//       querySnapshot.forEach(doc => {
//         console.log("Ssdad");
//           console.log(doc.id);
//         // Do something with the document data, e.g. display it in the console
//         console.log(doc.id, " => ", doc.data());
//       });
//     })
//     .catch(error => {
//       console.error("Error getting communities:", error);
//     });
// }