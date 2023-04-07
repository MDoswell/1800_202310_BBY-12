//---------------------------------------------------
// This function loads the parts of your skeleton
// (navbar, footer, and other things) into html doc.
//---------------------------------------------------
function loadSkeleton() {
  $("#loginNavbarPlaceholder").load("./text/loginNav.html");
  $("#modalPlaceholder").load("./text/hazard.html");
}
loadSkeleton(); //invoke the function
