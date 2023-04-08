var leaderLimit = 10;
var test = false;

/* Loads all of the information collected by populateLeaderboard() and sorts each card by the user's points, then displays
the list of them in descending order.*/
function displayLeaderboard(collection) {
    let cardTemplate = document.getElementById("leaderboardCardTemplate"); // Card template for the leaderboard spots

  db.collection(collection)
    .orderBy("points", "desc")
    .limit(leaderLimit)
    .get() // The collection called "users"
    .then((allUsers) => {
      for (var i = leaderLimit - 10; i < leaderLimit; i++) {
        // Iterate thru each doc
        var doc = allUsers.docs[i];
        var title = doc.data().name;

        // console.log("title" + title);
        var level = doc.data().level; //  Get value of the "details" key
        var pfp = doc.data().image; // Get unique ID to each hike to be used for fetching right image
        var userPoints = doc.data().points; // Gets the length field
        var numHazards = doc.data().numHazards;
        var numHelpful = doc.data().numHelpful;
        let newcard = cardTemplate.content.cloneNode(true);

                // Update title and text and image
                newcard.querySelector('.title').innerHTML = title;
                newcard.querySelector('.points').innerHTML = userPoints + " points";
                newcard.querySelector('.level').innerHTML = "Level " + level;
                newcard.querySelector('.numHazards').innerHTML = "Number of Hazards reported: " + numHazards;
                newcard.querySelector('.numHelpful').innerHTML = "Number of Helpful ratings given: " + numHelpful;
                if (pfp != "") {
                    newcard.querySelector('.pfp').src = pfp; // The images are given a random ID so it would be a src to (ImageID).jpg
                    // An example of an image ID would be something like a45ZBgsa47tgR741WSvh46xc1er
                } else {
                    newcard.querySelector('.pfp').src = "./images/profile.jpg"; /* If there is no picture associated with this user,
                    they are given the default profile image*/
                }

                // Attach to gallery, Example: "title-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);
            };
        })
}

// Adds listeners to the "refresh" and "load more" buttons
function addButtonListeners() {
    document.getElementById("load-more-button").onclick = loadMore;
    document.getElementById("refresh-button").onclick = refresh;
    test = true;
}

// Loads the next 10 users in the leaderboard
function loadMore() {
    if (test) {
        leaderLimit = leaderLimit + 10;
        populateLeaderboard();
        displayLeaderboard("users");
    }
}

// Refreshes the leaderboard, however in doing so it resets to the first 10 users
function refresh() {
    if (test) {
        leaderLimit = 10;
        deleteOldStuff();
        populateLeaderboard();
        displayLeaderboard("users");
    }
}

// Deletes the old cards so that they can be replaced with new ones
function deleteOldStuff() {
    var leaderboardCards = document.getElementsByClassName('delete-me');
    while (leaderboardCards[0]) {
        leaderboardCards[0].parentNode.removeChild(leaderboardCards[0]);
    }
}

// Gets all of the updated information from the database for displaying the leaderboard
function populateLeaderboard() {
    let leaderboardCardTemplate = document.getElementById("leaderboardCardTemplate");
    let leaderboardCardGroup = document.getElementById("leaderboardCardGroup");

    var leaderID = localStorage.getItem("leaderDocID");

  db.collection("users")
    .where("leaderDocID", "==", leaderID)
    .get()
    .then((allLeaders) => {
      leaderboards = allLeaders.docs;
      // console.log(leaderboards);
      leaderboards.forEach((doc) => {
        var title = doc.data().title; // Gets the name field
        var level = doc.data().level; // Gets the user's level field
        var points = doc.data().points; // Gets the user's points field
        var numHazards = doc.data().numHazards; // Gets the number of hazards reported by this user
        var numHelpful = doc.data().numHelpful; // Gets the number of helpful ratings given by this user

        let leaderCard = leaderboardCardTemplate.content.cloneNode(true);
        leaderCard.querySelector(".title").innerHTML = title;
        leaderCard.querySelector(".level").innerHTML = `level: ${level}`;
        leaderCard.querySelector(".points").innerHTML = `points: ${points}`;
        leaderCard.querySelector(
          ".numHazards"
        ).innerHTML = `hazards: ${numHazards}`;
        leaderCard.querySelector(
          ".numHelpful"
        ).innerHTML = `helpful: ${numHelpful}`;
        leaderboardCardGroup.appendChild(leaderCard);
      });
    });
}

// When leader_board.html loads this script it automatically loads the first 10 users
populateLeaderboard();
displayLeaderboard("users");
addButtonListeners();
