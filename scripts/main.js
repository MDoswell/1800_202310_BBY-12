function addHazard() {
    let addHazard = document.getElementById("addHazard");
    location.href = '../addHazard.html';
    console.log(addHazard);
}

function displayHazardMarkers(collection) {
    db.collection(collection).get()   //the collection called "hazards"
        .then(allHazards => {
            allHazards.forEach(doc => { //iterate thru each doc
                var testThis = doc.data().testThis;
                var title = doc.data().name;
                var details = doc.data().description;
                var docID = doc.id;
                var type = doc.data().type;
                var lat = parseFloat(doc.data().lat);
                var lng = parseFloat(doc.data().lng);

                if (testThis) {
                    console.log(title);
                    console.log(details);
                    console.log(docID);
                    console.log(lat);
                    console.log(lng);
                    console.log(type);

                    var myIcon;
                    if(type == "Obstruction"){
                        myIcon = new google.maps.MarkerImage("/images/feature_heated.svg", null, null, null, new google.maps.Size(50,50));
                    }else if(type == "Warning"){
                        myIcon = new google.maps.MarkerImage("/images/feature_warning.svg", null, null, null, new google.maps.Size(50,50));
                    }else if(type == "Branch"){
                        myIcon = new google.maps.MarkerImage("/images/feature_tree_branch.svg", null, null, null, new google.maps.Size(50,50));
                    }else if(type == "Heated"){
                        myIcon = new google.maps.MarkerImage("/images/feature_heated.svg", null, null, null, new google.maps.Size(50,50));
                    }else if(type == "Puddle"){
                        myIcon = new google.maps.MarkerImage("/images/feature_puddle.svg", null, null, null, new google.maps.Size(50,50));
                    }else if(type == "Ice"){
                        myIcon = new google.maps.MarkerImage("/images/feature_warning.svg", null, null, null, new google.maps.Size(50,50));
                    }

                    marker = new google.maps.Marker({
                        position: { lat, lng }, // location : ,
                        title: title, // title : ,
                        icon: myIcon,
                        map: map, // map object :
                        hazardId: docID
                    });

                    marker.addListener("click", () => {
                        //When click the marker, hazard shows.
                        console.log(docID);
                        showHazard(docID);
                    });
                }
            })
        })
}

displayHazardMarkers("hazards");