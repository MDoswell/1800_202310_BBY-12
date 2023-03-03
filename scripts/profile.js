function loadSkeleton(){
    console.log($('#navbarPlaceholder').load('./text/nav.html'));
    console.log($('#footerPlaceholder').load('./text/footer.html'));
    console.log($('#modalPlaceholder').load('./text/hazard.html'));    
}
loadSkeleton();  //invoke the function