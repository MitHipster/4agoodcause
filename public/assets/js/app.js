/*jslint esversion: 6, browser: true*/
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

const $categoryForm = $('#category-form');
const $categoryChecks = $('.category-checkbox');
// Return selected categories for charities search request
$('#category-form').submit( e => {
  e.preventDefault();
  let data = {
    ids: []
  };
  $categoryChecks.each( (i, input) => {
    if (input.checked) {
      data.ids.push(parseInt($(input).data('category')));
    }
  });
  $.ajax({
    url: '/api/charities',
    type: 'POST',
    data: data,
    dataType: 'json'
  }).done( result => {
    if (typeof result.redirect == 'string') {
      window.location = result.redirect;
    }
  });
});
