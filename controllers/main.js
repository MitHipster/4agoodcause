/*jslint esversion: 6, browser: true*/
const express = require('express');
const passport = require('passport');
// Import database model
const db = require('../models');

// Create the `router` for the app and export the `router` at the end of your file.
const router = express.Router();
// Use request method to get API data to pipe to response
const request = require('request');
let categoryIds = [];

// Route to get all 4-star causes for donor to choose from
router.get('/', (req, res) => {
  res.render('index');
});

// Route to signup a new donor
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Route to post new donor information
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/categories',
    failureRedirect: '/signup'
  }
));

// Route to signin an existing donor
router.get('/signin', (req, res) => {
  res.render('signin');
});

// Route to redirect existing signed in donor
router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/dashboard',
    failureRedirect: '/signin'
  }
));

// Function to check if a donor is logged in
let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/signin');
};

// Route to redirect donor to select categories after signing up
router.get('/categories', isLoggedIn, (req, res) => {
  db.Category.findAll({
    order: [
      [ 'categoryName', 'ASC' ]
    ]
  }).then (results => {
    console.log(results);
    res.render('categories', {categories: results});
  });
});

// Route to display a filtered charities list based on selected categories
router.get('/charities', isLoggedIn, (req, res) => {
  db.Category.findAll({
    order: [
      [ 'categoryName', 'ASC' ]
    ]
  }).then (results => {
    res.render('categories', {categories: results});
  });
});

router.get('/charitiestest', (req, res) => {
  db.Category.findAll({
    include: [
    {
      model: db.Charity,
      include: [
        db.Cause
      ]
    }
  ],
    where: {
      id: categoryIds
    },
    order: [
      [ 'categoryName', 'ASC' ],
      [ {model: db.Charity}, 'charityName', 'ASC' ]
    ]
  }).then (results => {
    res.render('charities', {charities: results});
    categoryIds = [];
  });
});

// Route to logout the donor
router.get('/logout', (req, res) => {
  req.session.destroy( err => {
    res.redirect('/');
  });
});

//*************************************************
// API Routes
//*************************************************

router.post('/api/charities', (req, res) => {
  categoryIds = req.body.ids.map(Number);
  res.send({redirect: '/charitiestest'});
});

//*************************************************
// Test Routes
//*************************************************

router.get('/categoriestest', (req, res) => {
  db.Category.findAll({
    order: [
      [ 'categoryName', 'ASC' ]
    ]
  }).then (results => {
    res.render('categories', {categories: results});
  });
});

router.get('/charitiestest', (req, res) => {
  db.Category.findAll({
    include: [
    {
      model: db.Charity,
      include: [
        db.Cause
      ]
    }
  ],
    where: {
      id: categoryIds
    },
    order: [
      [ 'categoryName', 'ASC' ],
      [ {model: db.Charity}, 'charityName', 'ASC' ]
    ]
  }).then (results => {
    res.render('charities', {charities: results});
    categoryIds = [];
  });
});

// Export routes for server.js to use
module.exports = router;
