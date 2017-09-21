/*jslint esversion: 6, browser: true*/
$(document).ready(function () {
  // Initialize side nav bar for mobile and set width
  $(".button-collapse").sideNav({
    menuWidth: 250,
    closeOnClick: true
  });
  // Initialize parallax effect
  $('.parallax').parallax();
  // Initialize table of contents structure
  $('.scrollspy').scrollSpy({
    scrollOffset: 64
  });
  $('.table-of-contents').pushpin({
      top: 124,
      offset: 64
    });
  // Initialize select state dropdown
  $('select').material_select();
  // for HTML5 "required" attribute
  $('select[required]').css({
    display: 'inline',
    position: 'absolute',
    float: 'left',
    padding: 0,
    margin: 0,
    border: '1px solid rgba(255,255,255,0)',
    height: 0,
    width: 0,
    top: '2em',
    left: '3em',
    opacity: 0
  });
});

const $categoryForm = $('#category-form');
const $charityForm = $('#charity-form');
const $categoryChecks = $('.category-checkbox');
const $charityChecks = $('.charity-checkbox');

// Return selected categories for charities search request
$categoryForm.submit( e => {
  e.preventDefault();
  ajaxRequest($categoryChecks, 'category', '/api/charities');
});

// Return selected charities to make a donation
$charityForm.submit( e => {
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
