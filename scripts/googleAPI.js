window.initMap = function () {
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 49.248499, lng: -123.001375 },
        zoom: 15,
    });
};
