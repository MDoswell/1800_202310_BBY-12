window.initMap = function () {
    const test = { lat: 49.247914, lng: -123.004901 };
    const map = new google.maps.Map(document.getElementById("map"), {
        //center: { lat: 49.248499, lng: -123.001375 },
        center: test,
        zoom: 15,
    });

    // The marker, positioned at Uluru
    const marker = new google.maps.Marker({
        position: test,
        map: map,
    });

    marker.addListener("click", () => {
        showHazard(testHazard);
    });

};