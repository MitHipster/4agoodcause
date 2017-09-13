$(document).ready(function () {
  // Initialize side nav bar for mobile and set width
  $(".button-collapse").sideNav({
    menuWidth: 250,
    closeOnClick: true
  });
  // Initialize parallax effect
  $('.parallax').parallax();
  // Initialize select state dropdown
  $('select').material_select();
});
