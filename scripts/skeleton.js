//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------

function loadSkeleton() {
  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in.
      // Load the appropriate html files
      $("#navbarPlaceholder").load("./text/nav.html");
      $("#footerPlaceholder").load("./text/footer.html");
      $("#modalPlaceholder").load("./text/hazard.html");
    } else {
      // No user is signed in.
      $("#loginNavbarPlaceholder").load("./text/loginNav.html");
      $("#loginFooterPlaceholder").load("./text/loginFooter.html");
    }
  });
}
loadSkeleton(); // Invoke the function

// Invoke the username on the hamburger menu
function insertName() {
  firebase.auth().onAuthStateChanged((user) => {
    // => call back function
    // Check if a user is signed in:
    if (user) {
      // Do something for the currently logged-in user here:
      //console.log(user.uid); //print the uid in the browser console
      //console.log(user.displayName);  //print the user name in the browser console
      user_Name = user.displayName;

      // Method #1:  insert with html only
      //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
      // Method #2:  insert using jquery
      $("#name-goes-here").text(user_Name); //using jquery
    } else {
      // No user is signed in.
    }
  });
}
// insertName(); //run the function
