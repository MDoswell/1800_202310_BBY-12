//---------------------------------------------------
// This function loads the parts of your skeleton 
// (navbar, footer, and other things) into html doc. 
//---------------------------------------------------
function loadSkeleton(){
    console.log($('#loginNavbarPlaceholder').load('./text/loginNav.html'));
    console.log($('#loginFooterPlaceholder').load('./text/loginFooter.html'));
}
loadSkeleton();  //invoke the function
