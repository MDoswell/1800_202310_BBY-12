//------------------------------------------------
// Call this function when the "logout" button is clicked
//-------------------------------------------------
function logout() {
  firebase.auth().signOut().then(() => {
      // Sign-out successful.
      console.log("logging out user");
    }).catch((error) => {
      // An error happened.
    });
}

function sayHello() {
    
}
//sayHello();



function loginPage(){
    window.location.href = 'login.html';
}

$(document).ready(function () {

    $('.first-button').on('click', function () {
      $('.animated-icon1').toggleClass('open');
    });
  });