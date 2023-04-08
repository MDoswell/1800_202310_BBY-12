// Global variable to hold the filters selected by the user
var filterList = [];

// Global variable to hold the hazard markers displayed on the map
var markers = [];

/*  */
function displayHazardMarkers(collection) {
  db.collection(collection)
    .get() // The collection called "hazards"
    .then((allHazards) => {
      // Iterate thru each doc
      allHazards.forEach((doc) => {
        // Get details about the hazards for filtering
        var title = doc.data().name;
        var docID = doc.id;
        var type = doc.data().type;
        var lat = parseFloat(doc.data().lat);
        var lng = parseFloat(doc.data().lng);
        var communities = doc.data().communities;
        // Flag indicating whether to create and display marker for this hazard
        let showMarker = true;

        /* Iterate through filters, and set showMarker to false if hazard does
          not fit a given filter */
        for (let i = 0; i < filterList.length; i++) {
          if (filterList[i].type == "hazardType") {
            if (type != filterList[i].id) {
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
            // console.log("Unknown filter type");
          }
        }

        /* For hazards where showMarker is true (or all hazards if no filters are
          active), set appropriate marker icon, and create marker */
        if (showMarker || filterList == []) {
          var myIcon;
          if (type == "Other") {
            myIcon = new google.maps.MarkerImage(
              "/images/feature_warning.svg",
              null,
              null,
              null,
              new google.maps.Size(50, 50)
            );
          } else if (type == "Obstruction") {
            myIcon = new google.maps.MarkerImage(
              "/images/feature_tree_branch.svg",
              null,
              null,
              null,
              new google.maps.Size(50, 50)
            );
          } else if (type == "Heat") {
            myIcon = new google.maps.MarkerImage(
              "/images/feature_heat.svg",
              null,
              null,
              null,
              new google.maps.Size(50, 50)
            );
          } else if (type == "Puddle") {
            myIcon = new google.maps.MarkerImage(
              "/images/feature_puddle.svg",
              null,
              null,
              null,
              new google.maps.Size(50, 50)
            );
          } else if (type == "Ice") {
            myIcon = new google.maps.MarkerImage(
              "/images/feature-ice.svg",
              null,
              null,
              null,
              new google.maps.Size(50, 50)
            );
          }

          marker = new google.maps.Marker({
            position: { lat, lng }, // Location : ,
            title: title, // Title : ,
            icon: myIcon,
            map: null, // Map object :
            hazardId: docID,
          });

          // Add listener so that when marker is clicked, hazard modal appears.
          marker.addListener("click", () => {
            showHazard(docID);
          });

          markers.push(marker);
        }
      });
      // Add each marker to the map
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
      showParamHazard();
    });
}

/* Get params from URL, and if one exists for docID, display the hazard
  with that ID (param is set after add a hazard). */
function showParamHazard() {
  let params = new URL(window.location.href); //get the url from the search bar
  let ID = params.searchParams.get("docID");

  if (ID) {
    showHazard(ID);
  }

  /* Clear params from url so that calling reloading page or calling
    displayHazardMarkers() does not open a hazard modal */
  window.history.replaceState({}, document.title, "/" + "main.html");
}

/* Remove all hazard markers from the map */
function removeMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }

  markers = [];
}

displayHazardMarkers("hazards");

/* Populate the hazard type filter section of the dropdown menu in the
  filter menu */
function addHazardTypeFilters() {
  let hazardTypes = ["Ice", "Obstruction", "Other", "Heat", "Puddle"];

  // For each hazard type, create a button that adds a filter for that hazard type
  for (let i = 0; i < hazardTypes.length; i++) {
    let newFilterButton = document.createElement("BUTTON");
    newFilterButton.innerHTML = hazardTypes[i];
    newFilterButton.classList.add("dropdown-item");
    newFilterButton.id = "filter-button-" + hazardTypes[i];
    newFilterButton.filterType = "hazardType";
    newFilterButton.filterLabel = hazardTypes[i];
    newFilterButton.filterID = hazardTypes[i];
    newFilterButton.onclick = addMapFilter;

    // Put the button in a list item and add to dropdown
    let newFilter = document.createElement("li");
    newFilter.appendChild(newFilterButton);
    $("#filter-list").append(newFilter);
  }

  // After all type filters have been added, create section for community filters
  document
    .getElementById("filter-list")
    .insertAdjacentHTML("beforeend", '<li><hr class="dropdown-divider"></li>');
  document
    .getElementById("filter-list")
    .insertAdjacentHTML(
      "beforeend",
      '<li><h6 class="dropdown-header">Community</h6></li>'
    );
}
// Call this function immediately
addHazardTypeFilters();

/* Populate the community filter section of the dropdown menu in the
  filter menu */
function addCommunityFilters() {
  firebase.auth().onAuthStateChanged((user) => {
    // Check if user is signed in:
    if (user) {
      // Go to the correct user document by referencing to the user uid
      currentUser = db.collection("users").doc(user.uid);
      // Array to hold the communities the user belongs to
      let communityList = [];

      db.collection("community-member-list")
        .get()
        .then((memberships) => {
          memberships.forEach((doc) => {
            // Add each community the user is in to communityList
            if (doc.data().member == user.uid) {
              communityList.push(doc.data().community);
            }
          });

          // For each community user is in, add a button to the filter menu dropdown
          for (var i = 0; i < communityList.length; i++) {
            let communityID = communityList[i];
            db.collection("communities")
              .doc(communityID)
              .get()
              .then((doc) => {
                // Create button that adds filter for this community
                let communityName = doc.data().name;
                let newFilterButton = document.createElement("BUTTON");
                newFilterButton.innerHTML = communityName;
                newFilterButton.classList.add("dropdown-item");
                newFilterButton.id = "filter-button-" + communityID;
                newFilterButton.filterType = "community";
                newFilterButton.filterLabel = communityName;
                newFilterButton.filterID = communityID;
                newFilterButton.onclick = addMapFilter;

                // Add that button to the filter menu dropdown
                let newFilter = document.createElement("li");
                newFilter.appendChild(newFilterButton);

                $("#filter-list").append(newFilter);
              });
          }
        });
    } else {
      // No user is signed in.
      // console.log("No user is signed in");
    }
  });
}
// Call this function immediately
addCommunityFilters();

/* Adds a filter to the map. Details about filter type come from data stored in
  the button which called this function. */
function addMapFilter(evt) {
  // Get details about filter from button that called this function
  let type = evt.currentTarget.filterType;
  let label = evt.currentTarget.filterLabel;
  let id = evt.currentTarget.filterID;

  /* If this filter has not yet been added, add it to filterList array and 
    create filter tag badge on filter menu */
  if (filterList.find((filter) => filter.id == id)) {
    // console.log("filter in list");
  } else {
    // Add filter to filterList and create filter badge
    filterList.push({ id: id, type: type });
    let newFilterBadge = document.createElement("span");
    newFilterBadge.innerHTML = label;
    newFilterBadge.id = "filter-badge-" + id;
    newFilterBadge.classList.add("badge");
    newFilterBadge.classList.add("filter-badge");

    // Create close button on badge
    let closeButton = document.createElement("div");
    closeButton.id = "close-" + id;
    closeButton.targetFilter = id;
    closeButton.addEventListener("click", removeFilter);

    let closeButtonImg = document.createElement("img");
    closeButtonImg.src = "images/cross.png";

    // Add badge to filter menu
    closeButton.appendChild(closeButtonImg);
    newFilterBadge.appendChild(closeButton);

    $("#filter-tag-container").append(newFilterBadge);

    // Remove current markers and reload markers to fit filter
    removeMarkers();
    displayHazardMarkers("hazards");
  }
}

/* Removes a filter. Filter to remove specified by data in button that called this function */
function removeFilter(evt) {
  let filter = evt.currentTarget.targetFilter;

  filterList.splice(
    filterList.findIndex((element) => element.id == filter),
    1
  );
  document.getElementById("filter-badge-" + filter).remove();

  removeMarkers();
  displayHazardMarkers("hazards");
}
