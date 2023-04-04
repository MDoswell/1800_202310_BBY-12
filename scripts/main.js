function addHazard() {
    let addHazard = document.getElementById("addHazard");
    location.href = '../addHazard.html';
    console.log(addHazard);
}

var filterList = [];
var markers = [];

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
                var communities = doc.data().communities;
                let showMarker = true;

                // if (!testThis) {
                //     showMarker = false;
                // }

                //console.log(type);

                //console.log(filterList);
                for (let i = 0; i < filterList.length; i++) {
                    //console.log(FileList[i]);
                    if (filterList[i].type == "hazardType") {
                        if (type != filterList[i].id) {
                            //console.log("Does not fit filter");
                            showMarker = false;
                        }
                    } else if (filterList[i].type == "community") {
                        showMarker = false;
                        for (let j = 0; j < communities.length; j++) {
                            if (filterList[i].id == communities[j]) {
                                showMarker = true;
                            }
                        }
                    } else {
                        //console.log("Unknown filter type");
                    }
                }

                if (showMarker || filterList == []) {
                    //console.log("creating marker");
                    //console.log(title);
                    // console.log(details);
                    // console.log(docID);
                    // console.log(lat);
                    // console.log(lng);
                    // console.log(type);

                    var myIcon;
                    if (type == "Other") {
                        myIcon = new google.maps.MarkerImage("/images/feature_warning.svg", null, null, null, new google.maps.Size(50, 50));
                    } else if (type == "Obstruction") {
                        myIcon = new google.maps.MarkerImage("/images/feature_tree_branch.svg", null, null, null, new google.maps.Size(50, 50));
                    } else if (type == "Heated") {
                        myIcon = new google.maps.MarkerImage("/images/feature_heated.svg", null, null, null, new google.maps.Size(50, 50));
                    } else if (type == "Puddle") {
                        myIcon = new google.maps.MarkerImage("/images/feature_puddle.svg", null, null, null, new google.maps.Size(50, 50));
                    } else if (type == "Ice") {
                        myIcon = new google.maps.MarkerImage("/images/feature-ice.svg", null, null, null, new google.maps.Size(50, 50));
                    }

                    marker = new google.maps.Marker({
                        position: { lat, lng }, // location : ,
                        title: title, // title : ,
                        icon: myIcon,
                        map: null, // map object :
                        hazardId: docID
                    });

                    marker.addListener("click", () => {
                        //When click the marker, hazard shows.
                        //console.log(docID);
                        showHazard(docID);
                    });

                    markers.push(marker);
                }
            })
            //console.log("adding markers to map");
            for (let i = 0; i < markers.length; i++) {
                markers[i].setMap(map);
            }
            showParamHazard();
        })
}

function showParamHazard() {
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");

    //console.log(ID);

    if (ID) {
        //console.log("showing param hazard");

        showHazard(ID);
    }
}


function removeMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    markers = [];
}

displayHazardMarkers("hazards");

function addHazardTypeFilters() {
    let hazardTypes = ["Ice", "Obstruction", "Other"];

    for (let i = 0; i < hazardTypes.length; i++) {
        let newFilterButton = document.createElement("BUTTON");
        newFilterButton.innerHTML = hazardTypes[i];
        newFilterButton.classList.add("dropdown-item");
        newFilterButton.id = "filter-button-" + hazardTypes[i];
        newFilterButton.filterType = "hazardType";
        newFilterButton.filterLabel = hazardTypes[i];
        newFilterButton.filterID = hazardTypes[i];
        newFilterButton.onclick = addMapFilter;

        //console.log(newFilterButton);

        let newFilter = document.createElement("li");
        newFilter.appendChild(newFilterButton);
        //console.log(newFilter);

        $("#filter-list").append(newFilter);
    }

    document.getElementById("filter-list").insertAdjacentHTML('beforeend', "<li><hr class=\"dropdown-divider\"></li>");
    document.getElementById("filter-list").insertAdjacentHTML('beforeend', "<li><h6 class=\"dropdown-header\">Community</h6></li>");
}

addHazardTypeFilters();

function addCommunityFilters() {
    firebase.auth().onAuthStateChanged(user => {
        // Check if user is signed in:
        if (user) {
            //go to the correct user document by referencing to the user uid
            currentUser = db.collection("users").doc(user.uid);
            //console.log(user.uid);

            let communityList = [];

            db.collection("community-member-list").get()
                .then(memberships => {
                    memberships.forEach(doc => {
                        // console.log(doc.data().member);
                        if (doc.data().member == user.uid) {
                            //console.log(doc.data().community)
                            communityList.push(doc.data().community)
                        }
                    })

                    //console.log(communityList);
                    for (var i = 0; i < communityList.length; i++) {
                        let communityID = communityList[i];
                        //console.log(communityID);
                        db.collection("communities").doc(communityID).get()
                            .then(doc => {
                                // <li><button class="dropdown-item" type="button">Action</button></li>
                                let communityName = doc.data().name;

                                //console.log(doc.data().name)
                                let newFilterButton = document.createElement("BUTTON");
                                newFilterButton.innerHTML = communityName;
                                newFilterButton.classList.add("dropdown-item");
                                newFilterButton.id = "filter-button-" + communityID;
                                newFilterButton.filterType = "community";
                                newFilterButton.filterLabel = communityName;
                                newFilterButton.filterID = communityID;
                                newFilterButton.onclick = addMapFilter;

                                //console.log(newFilterButton);

                                let newFilter = document.createElement("li");
                                newFilter.appendChild(newFilterButton);
                                //console.log(newFilter);

                                $("#filter-list").append(newFilter);

                                // document.getElementById("filter-button-" + communityID).onclick = addMapFilter("community", communityName, communityID);
                            })
                    }
                })
        } else {
            // No user is signed in.
            //console.log("No user is signed in");
        }
    });
}

addCommunityFilters();

function addMapFilter(evt) {
    //console.log("adding filter...");
    let type = evt.currentTarget.filterType;
    let label = evt.currentTarget.filterLabel;
    let id = evt.currentTarget.filterID;

    //console.log(id);

    if (filterList.find(filter => filter.id == id)) {
        console.log("filter in list");
    } else {
        filterList.push({ "id": id, "type": type });
        let newFilterBadge = document.createElement("span");
        newFilterBadge.innerHTML = label;
        newFilterBadge.id = "filter-badge-" + id;
        newFilterBadge.classList.add("badge");
        // newFilterBadge.classList.add("text-bg-primary");
        newFilterBadge.classList.add("filter-badge");

        // var closeButton = "<div id=\"close-tag\"><img id=\"close-tag-img\" src=\"images/cross.svg\"></div>";
        let closeButton = document.createElement("div");
        closeButton.id = "close-" + id;
        closeButton.targetFilter = id;
        closeButton.addEventListener("click", removeFilter);

        let closeButtonImg = document.createElement("img");
        closeButtonImg.src = "images/cross.svg";

        closeButton.appendChild(closeButtonImg);
        newFilterBadge.appendChild(closeButton);

        $("#filter-tag-container").append(newFilterBadge);

        // console.log(filterList);

        window.history.replaceState({}, document.title, "/" + "main.html");
        removeMarkers();
        displayHazardMarkers("hazards");
    }
}

function removeFilter(evt) {
    // console.log(filterList);
    let filter = evt.currentTarget.targetFilter;

    filterList.splice(filterList.findIndex(element => element.id == filter), 1);
    document.getElementById("filter-badge-" + filter).remove();
    // console.log(filterList);

    removeMarkers();
    displayHazardMarkers("hazards");
}