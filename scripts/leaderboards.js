var leaderLimit = 10;
var test = false;

function displayLeaderboard(collection) {
    let cardTemplate = document.getElementById("leaderboardCardTemplate"); // Card template for the leaderboard spots

    db.collection(collection).orderBy("points", "desc").limit(leaderLimit).get()   // Gets the collection "users", sorted by
    // the number of points they have, starting at the highest down to the lowest, and limited to the first 10
        .then(allUsers => {
            for(var i = leaderLimit - 10; i < leaderLimit; i++) { //iterate thru each doc
                var doc = allUsers.docs[i];
                console.log("i"+i);
                var title = doc.data().name;
                
                console.log("title" + title);
                var level = doc.data().level;  // Get value of the "level" key
                var pfp = doc.data().image;    // Get unique ID to each user to be used for fetching the right image
                var userPoints = doc.data().points; // Gets the points field
                var numHazards = doc.data().numHazards; // Gets the number of hazards this user has added
                var numHelpful = doc.data().numHelpful; // Gets the number of helpful ratings this user has given
                let newcard = cardTemplate.content.cloneNode(true); // Creates a new Leaderboard card with the user's data values

                //update title and text and image
                newcard.querySelector('.title').innerHTML = title;
                newcard.querySelector('.points').innerHTML = userPoints + " points";
                newcard.querySelector('.level').innerHTML = "Level " + level;
                newcard.querySelector('.numHazards').innerHTML = "Number of Hazards reported: " + numHazards;
                newcard.querySelector('.numHelpful').innerHTML = "Number of Helpful reviews given: " + numHelpful;
                if (pfp != "") {
                    newcard.querySelector('.pfp').src = pfp; // The images are given a random ID so it would be a src to (ImageID).jpg
                    // an example of an image ID would be something like a45ZBgsa47tgR741WSvh46xc1er
                } else {
                    newcard.querySelector('.pfp').src = "./images/profile.jpg"; // If there is no picture associated with this user,
                    // they are given the default profile image
                }

                //attach to gallery, Example: "title-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);
            };
        })
}

function addButtonListeners() { // Adds listeners to the "refresh" and "load more" buttons
    document.getElementById("load-more-button").onclick = loadMore;
    document.getElementById("refresh-button").onclick = refresh;
    test = true;
}

function loadMore() { // Loads the next 10 users in the leaderboard
    if (test) {
        leaderLimit = leaderLimit + 10;
        populateLeaderboard();
        displayLeaderboard("users");
    }
}

function refresh() { // Refreshes the leaderboard, however in doing so it resets to the first 10 users
    if (test) {
        var limit = leaderLimit;
        leaderLimit = 10;
        deleteOldStuff();
        populateLeaderboard();
        displayLeaderboard("users");
    }
}

function deleteOldStuff() { // Deletes the old cards so that they can be replaced with new ones
    var leaderboardCards = document.getElementsByClassName('delete-me');
    while (leaderboardCards[0]) {
        leaderboardCards[0].parentNode.removeChild(leaderboardCards[0]);
    }
}

function populateLeaderboard() { // Gets all of the needed information for displaying the leaderboard
    let leaderboardCardTemplate = document.getElementById("leaderboardCardTemplate");
    let leaderboardCardGroup = document.getElementById("leaderboardCardGroup");

    var leaderID = localStorage.getItem("leaderDocID");

    db.collection("users").where("leaderDocID", "==", leaderID).get()
        .then(allLeaders => {
            leaderboards = allLeaders.docs;
            console.log(leaderboards);
            leaderboards.forEach(doc => {
                var title = doc.data().title; //gets the name field
                var level = doc.data().level; //gets the unique ID field
                var points = doc.data().points;
                var numHazards = doc.data().numHazards;
                var numHelpful = doc.data().numHelpful;
                var time = doc.data().timestamp.toDate();
                console.log(time)

                let leaderCard = leaderboardCardTemplate.content.cloneNode(true);
                leaderCard.querySelector('.title').innerHTML = title;
                leaderCard.querySelector('.level').innerHTML = `level: ${level}`;
                leaderCard.querySelector('.points').innerHTML = `points: ${points}`;
                leaderCard.querySelector('.numHazards').innerHTML = `hazards: ${numHazards}`;
                leaderCard.querySelector('.numHelpful').innerHTML = `helpful: ${numHelpful}`;
                leaderboardCardGroup.appendChild(leaderCard);
            })
        })
}

populateLeaderboard();
displayLeaderboard("users");
addButtonListeners();