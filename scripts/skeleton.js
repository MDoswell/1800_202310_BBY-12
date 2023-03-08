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
