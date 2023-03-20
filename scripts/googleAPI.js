//Run google map and navigating when enter the main page.
function initMap() {
  // Navigate current location
  id = window.navigator.geolocation.watchPosition(success, error, {
    enableHighAccuracy: true,
    maximumAge: 0,
  });

  // Stop navigating
  // window.navigator.geolocation.clearWatch(id);
}

//Success function
function success(position) {
  var center = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );

  // Initial location of a map
  map = new google.maps.Map($("#map").get(0), {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: 17,
    center: center,
  });

  $("#location").text(
    "current latitude = " +
      position.coords.latitude +
      " current longitude = " +
      position.coords.longitude
  );

  var marker = new google.maps.Marker({
    position: center, // location : ,
    title: "Current", // title : ,
    map: map, // map object :
  });

  marker.addListener("click", () => {
    //When click the marker, hazard shows.
    showHazard(hazard);
  });

  
}

//Fail function
function error(err) {
  alert("Navigate fail = " + err.code);
}

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(
//     browserHasGeolocation
//       ? "Error: The Geolocation service failed."
//       : "Error: Your browser doesn't support geolocation."
//   );
//   infoWindow.open(map);
// }

//  $(function() {

// 	var mapContainer = document.getElementById('map'), // 지도를 표시할 div
// 		mapOption = {
// 			center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
// 			level: 3 // 지도의 확대 레벨
// 		};

// 	// 지도를 표시할 div와  지도 옵션으로  지도를 생성합니다
// 	var map = new kakao.maps.Map(mapContainer, mapOption);

// 	function locationLoadSuccess(pos) {
// 		// 현재 위치 받아오기
// 		var currentPos = new kakao.maps.LatLng(pos.coords.latitude,  pos.coords.longitude);

// 		// 지도 이동(기존 위치와 가깝다면 부드럽게 이동)
// 		map.panTo(currentPos);

// 		// 마커 생성
//         var marker = new kakao.maps.Marker({
//             position: currentPos
//         });

//         // 기존에 마커가 있다면 제거
//         marker.setMap(null);
//         marker.setMap(map);
// 	};

// 	function locationLoadError(pos) {
// 		alert('위치 정보를 가져오는데 실패했습니다.');
// 	};

// 	$("#getMyPositionBtn").on("click", function() {
// 		navigator.geolocation.getCurrentPosition(locationLoadSuccess, locationLoadError);
// 		// 주소-좌표 변환 객체를 생성합니다
// 		var geocoder = new kakao.maps.services.Geocoder();

// 		// 중심 좌표나 확대 수준이 변경됐을 때 지도 중심 좌표에 대한 주소 정보를 표시하도록 이벤트를 등록합니다
// 		kakao.maps.event.addListener(map, 'idle', function() {

// 			// 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
// 			searchAddrFromCoords(map.getCenter(), displayCenterInfo);
// 		});

// 		function searchAddrFromCoords(coords, callback) {
// 			// 좌표로 행정동 주소 정보를 요청합니다
// 			geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
// 		}

// 		function searchDetailAddrFromCoords(coords, callback) {
// 			// 좌표로 법정동 상세 주소 정보를 요청합니다
// 			geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
// 		}

// 		//지도 중심좌표에 대한 주소정보를 표출하는 함수입니다
// 		function displayCenterInfo(result, status) {
// 			if (status === kakao.maps.services.Status.OK) {
// 				var login_address = document.getElementById("login_address");

// 				for (var i = 0; i < result.length; i++) {
// 					// 행정동의 region_type 값은 'H' 이므로
// 					if (result[i].region_type === 'H') {
// 						login_address.value = result[i].address_name;
// 						break;
// 					}
// 				}
// 			}
// 		}

// 		// 지도 이동을 막는 버튼
// 		$("#stopMovingBtn").on("click", function() {
// 			map.setDraggable(false);
// 		});
// 	});

// 	$("#getMyPositionBtn").trigger("click");
// 	$("#stopMovingBtn").trigger("click");
// })

// 현재 위치 없이 고정

//   var curLatLng = {
//     lat: 49.248499,
//     lng: -123.001375,
//   };

//   // Creates a map object.
//   var map = new google.maps.Map(document.getElementById("map"), {
//     center: curLatLng,
//     scrollwheel: false,
//     zoom: 15,
//   });

//   // Creates a marker on the map.
//   var marker = new google.maps.Marker({
//     position: curLatLng,
//     map: map,
//     title: "Hello World!",
//   });

//   infoWindow = new google.maps.InfoWindow();

//   const locationButton = document.createElement("button");

//   locationButton.textContent = "Pan to Current Location";
//   locationButton.classList.add("custom-map-control-button");
//   map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
//   locationButton.addEventListener("click", () => {
//     // Try HTML5 geolocation.
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           const pos = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };

//           infoWindow.setPosition(pos);
//           infoWindow.setContent("Current loacation");
//           infoWindow.open(map);
//           map.setCenter(pos);
//         },
//         () => {
//           handleLocationError(true, infoWindow, map.getCenter());
//         }
//       );
//     } else {
//       // Browser doesn't support Geolocation
//       handleLocationError(false, infoWindow, map.getCenter());
//     }
//   });
