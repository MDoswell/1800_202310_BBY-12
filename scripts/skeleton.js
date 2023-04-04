//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------

function loadSkeleton() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // Do something for the user here.
            console.log($('#navbarPlaceholder').load('./text/nav.html'));
            console.log($('#footerPlaceholder').load('./text/footer.html'));
            console.log($('#modalPlaceholder').load('./text/hazard.html'));
        } else {
            // No user is signed in.
            console.log($('#loginNavbarPlaceholder').load('./text/loginNav.html'));
            console.log($('#loginFooterPlaceholder').load('./text/loginFooter.html'));
        }
    });
}
loadSkeleton(); //invoke the function

function insertName() {
    firebase.auth().onAuthStateChanged(user => {
        // => call back function 
        // Check if a user is signed in:
        if (user) {
            // Do something for the currently logged-in user here: 
            //console.log(user.uid); //print the uid in the browser console
            //console.log(user.displayName);  //print the user name in the browser console
            user_Name = user.displayName;

            //method #1:  insert with html only
            //document.getElementById("name-goes-here").innerText = user_Name;    //using javascript
            //method #2:  insert using jquery
            $("#name-goes-here").text(user_Name); //using jquery

        } else {
            // No user is signed in.
        }
    });
}
// insertName(); //run the function
