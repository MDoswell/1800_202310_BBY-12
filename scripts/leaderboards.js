var leaderLimit = 10;
var test = false;

function displayLeaderboard(collection) {
    let cardTemplate = document.getElementById("leaderboardCardTemplate");

    db.collection(collection).orderBy("points", "desc").limit(leaderLimit).get()   //the collection called "users"
        .then(allUsers => {
            //var i = 1;  //Optional: if you want to have a unique ID for each user
            for(var i = leaderLimit - 10; i < leaderLimit; i++) { //iterate thru each doc
                var doc = allUsers.docs[i];
                console.log("i"+i);
                var title = doc.data().name;
                
                console.log("title" + title);
                var level = doc.data().level;  // get value of the "details" key
                var pfp = doc.data().image;    //get unique ID to each hike to be used for fetching right image
                var userPoints = doc.data().points; //gets the length field
                var numHazards = doc.data().numHazards;
                var numHelpful = doc.data().numHelpful;
                let newcard = cardTemplate.content.cloneNode(true);

                //update title and text and image
                newcard.querySelector('.title').innerHTML = title;
                newcard.querySelector('.points').innerHTML = userPoints + " points";
                newcard.querySelector('.level').innerHTML = "Level " + level;
                newcard.querySelector('.numHazards').innerHTML = "Number of Hazards reported: " + numHazards; //Example: NV01.jpg
                newcard.querySelector('.numHelpful').innerHTML = "Number of Helpful reviews given: " + numHelpful;
                if (pfp != "") {
                    newcard.querySelector('.pfp').src = pfp;
                } else {
                    newcard.querySelector('.pfp').src = "./images/profile.jpg";
                }

                //Optional: give unique ids to all elements for future use
                // newcard.querySelector('.card-title').setAttribute("id", "ctitle" + i);
                // newcard.querySelector('.card-text').setAttribute("id", "ctext" + i);
                // newcard.querySelector('.card-image').setAttribute("id", "cimage" + i);

                //attach to gallery, Example: "hikes-go-here"
                document.getElementById(collection + "-go-here").appendChild(newcard);

                //i++;   //Optional: iterate variable to serve as unique ID
            };
        })
}

function addButtonListeners() {
    document.getElementById("load-more-button").onclick = loadMore;
    document.getElementById("refresh-button").onclick = refresh;
    test = true;
}

function loadMore() {
    if (test) {
        leaderLimit = leaderLimit + 10;
        populateLeaderboard();
        displayLeaderboard("users");
    }
}

function refresh() {
    if (test) {
        var limit = leaderLimit;
        leaderLimit = 10;
        deleteOldStuff();
        populateLeaderboard();
        displayLeaderboard("users");
    }
}

function deleteOldStuff() {
    var leaderboardCards = document.getElementsByClassName('delete-me');
    while (leaderboardCards[0]) {
        leaderboardCards[0].parentNode.removeChild(leaderboardCards[0]);
    }
}

function saveLeaderDocumentIDAndRedirect() {
    let params = new URL(window.location.href) //get the url from the search bar
    let ID = params.searchParams.get("docID");
    localStorage.setItem('leaderDocID', ID);
    window.location.href = 'leader_board.html';
}

function populateLeaderboard() {
    let leaderboardCardTemplate = document.getElementById("leaderboardCardTemplate");
    let leaderboardCardGroup = document.getElementById("leaderboardCardGroup");

    //let params = new URL(window.location.href) //get the url from the searbar
    //let hikeID = params.searchParams.get("docID");
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