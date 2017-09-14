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
const $charityForm = $('#charity-form');
const $categoryChecks = $('.category-checkbox');
const $charityChecks = $('.charity-checkbox');

// Return selected categories for charities search request
$('#category-form').submit( e => {
  e.preventDefault();
  ajaxRequest($categoryChecks, 'category', '/api/charities');
});

$('#charity-form').submit( e => {
  e.preventDefault();
  ajaxRequest($charityChecks, 'charity', '/api/donations');
});

let ajaxRequest = (checkboxes, attr, url) => {
  let data = {
    ids: []
  };
  checkboxes.each( (i, input) => {
    if (input.checked) {
      data.ids.push(parseInt($(input).data(attr)));
    }
  });
  $.ajax({
    url: url,
    type: 'POST',
    data: data,
    dataType: 'json'
  }).done( result => {
    if (typeof result.redirect == 'string') {
      window.location = result.redirect;
    }
  });
};
