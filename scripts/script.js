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