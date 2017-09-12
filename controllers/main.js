/*jslint esversion: 6, browser: true*/
const express = require('express');
const passport = require('passport');
// Import database model
const db = require('../models');

// Create the `router` for the app and export the `router` at the end of your file.
const router = express.Router();
// Use request method to get API data to pipe to response
const request = require('request');

// Route to get all 4-star causes for donor to choose from
router.get('/', (req, res) => {
  res.end('Hello');
});

// Route to signup a new donor
router.get('/signup', (req, res) => {
  res.render('signup');
});

// Route to post new donor information
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  }
));

// Route to signin an existing donor
router.get('/signin', (req, res) => {
  res.render('signin');
});

// Function to check if a donor is logged in
let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next;
  res.redirect('/signin');
};

// Route to redirect donor after signing in
router.get('/dashboard', isLoggedIn, (req, res) => {
  res.render('dashboard');
});

// Route to logout the donor
router.get('/logout', (req, res) => {
  req.session.destroy( err => {
    res.redirect('/');
  });
});

// Export routes for server.js to use
module.exports = router;
