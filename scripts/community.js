// move to add community page
function createCommuity() {
  window.location.href = "community-create.html";
}

//------------------------------------------------------------------------------
// Input parameter is a string representing the collection we are reading from
//------------------------------------------------------------------------------

// Invoke all Communities
function displayCardsDynamically(collection) {
  let cardTemplate = document.getElementById("communityCardTemplate");

  db.collection(collection)
    .get() //the collection called "communities"
    .then((allCommunities) => {
      allCommunities.forEach((doc) => {
        //iterate thru each doc
        var tag = doc.data().tag; // get value of the "tag" key
        var name = doc.data().name; // get value of the "name" key
        var location = doc.data().location; // get value of the "location" key
        var description = doc.data().description; // get value of the "description" key
        var member = doc.data().member; // get value of the "member" key

        var docID = doc.id;
        let newcard = cardTemplate.content.cloneNode(true);

        var badgeColor;
        switch (tag) {
          case "Dog walker":
            badgeColor = "bg-secondary";
            break;
          case "Stroller":
            badgeColor = "bg-primary";
            break;
          default:
            badgeColor = "bg-success";
        }
        //update title and text and image
        newcard.querySelector(".card-header").innerHTML =
          '<span class="badge rounded-pill ' +
          badgeColor +
          '">' +
          tag +
          "</span>";
        newcard.querySelector(".card-title").innerHTML = name;
        newcard.querySelector(".card-text-location").innerHTML = location;
        newcard.querySelector(".card-text").innerHTML = description;
        newcard.querySelector(".card-text-number").innerHTML =
          member + " Members";
        newcard.querySelector("a").href =
          "community-details.html?docID=" + docID;

        document.getElementById(collection + "-go-here").appendChild(newcard);
      });
    });
}

displayCardsDynamically("communities"); //input param is the name of the collection

// Community serach function
function search() {
  var searchInputVal = document
    .getElementById("search")
    .value.trim()
    .toLowerCase(); //trim and lowercase the search input value
  let cardTemplate = document.getElementById("communityCardTemplate");
  var communitiesGoHere = document.getElementById("communities-go-here");
  while (communitiesGoHere.firstChild) {
    communitiesGoHere.removeChild(communitiesGoHere.firstChild);
  }

  db.collection("communities")
    .get() //the collection called "communities"
    .then((allCommunities) => {
      allCommunities.forEach((doc) => {
        //iterate thru each doc

        var name = doc.data().name;
        if (name.trim().toLowerCase().includes(searchInputVal)) {
          var tag = doc.data().tag; // get value of the "tag" key
          var name = doc.data().name; // get value of the "name" key
          var location = doc.data().location; // get value of the "location" key
          var description = doc.data().description; // get value of the "description" key
          var member = doc.data().member; // get value of the "member" key

          var docID = doc.id;
          let newcard = cardTemplate.content.cloneNode(true);

          var badgeColor;
          switch (tag) {
            case "Dog walker":
              badgeColor = "bg-secondary";
              break;
            case "Stroller":
              badgeColor = "bg-primary";
              break;
            default:
              badgeColor = "bg-success";
          }
          //update title and text and image
          newcard.querySelector(".card-header").innerHTML =
            '<span class="badge rounded-pill ' +
            badgeColor +
            '">' +
            tag +
            "</span>";
          newcard.querySelector(".card-title").innerHTML = name;
          newcard.querySelector(".card-text-location").innerHTML = location;
          newcard.querySelector(".card-text").innerHTML = description;
          newcard.querySelector(".card-text-number").innerHTML =
            member + " Members";
          newcard.querySelector("a").href =
            "community-details.html?docID=" + docID;

          communitiesGoHere.appendChild(newcard);
        }
      });
    });
}
