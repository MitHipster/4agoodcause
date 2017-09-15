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
let charityIds = [];

// Route to get all 4-star causes for donor to choose from
router.get('/', (req, res) => {
  res.render('index');
});

// Route to signup a new donor
router.get('/signup', (req, res) => {
  res.render('signup', {message: req.flash('err')});
});

// Route to post new donor information
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/categories',
    failureRedirect: '/signup_err'
  }
));

router.get('/signup_err', (req, res) => {
  req.flash('err', 'An account already exists with this email address. Please sign in or try a different email address.');
  res.redirect('/signup');
});

// Route to signin an existing donor
router.get('/signin', (req, res) => {
  res.render('signin', {message: req.flash('err')});
});

// Route to redirect existing signed in donor
router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/account',
    failureRedirect: '/signin_err'
  }
));

router.get('/signin_err', (req, res) => {
  req.flash('err', 'Invalid username or password. Please try again.');
  res.redirect('/signin');
});

// Function to check if a donor is logged in
let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/signin');
};

// Route to redirect donor to select categories after signing up
router.get('/categories', isLoggedIn, (req, res) => {
// router.get('/categories', (req, res) => {
  db.Category.findAll({
    order: [
      [ 'categoryName', 'ASC' ]
    ]
  }).then (results => {
    res.render('categories', {categories: results});
  });
});

// Route to display a filtered charities list based on selected categories
router.get('/charities', isLoggedIn, (req, res) => {
// router.get('/charities', (req, res) => {
  db.Category.findAll({
    include: [
    { model: db.Charity, include: [db.Cause] }
  ],
    where: { id: categoryIds },
    order: [
      [ 'categoryName', 'ASC' ],
      [ {model: db.Charity}, 'charityName', 'ASC' ]
    ]
  }).then (results => {
    res.render('charities', {charities: results});
    categoryIds = [];
  });
});

// Route to display selected charities and payment form
router.get('/donations', isLoggedIn, (req, res) => {
// router.get('/donations', (req, res) => {
  db.Charity.findAll({
    where: { id: charityIds },
    order: [
      [ 'charityName', 'ASC' ]
    ]
  }).then (results => {
    res.render('donations', {donations: results});
    charityIds = [];
  });
});

// Route to display user profile information
router.get('/account', isLoggedIn, (req, res) => {
// router.get('/dashboard', (req, res) => {
  // db.Donor.findOne({
  //   where: { id: 1 }
  // }).then( results => {
  //   console.log(results);
  //   res.end();
  // });
  // console.log(req.user);
  res.render('account', {account: req.user});
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

// ********* STORE IDS IN TEMPORARY TABLE INSTEAD OF GLOBAL VARIABLES *********

router.post('/api/charities', (req, res) => {
  categoryIds = req.body.ids.map(Number);
  res.send({redirect: '/charities'});
});

router.post('/api/donations', (req, res) => {
  charityIds = req.body.ids.map(Number);
  res.send({redirect: '/donations'});
});

router.post('/api/payments', (req, res) => {
  // Create array to store donations to be inserted into Donations and Transactions tables
  let donations = [];
  // Create payment record in Payments table
  db.Payment.create({
    cardName: req.body.cardName,
    cardNumber: req.body.cardNumber,
    cardToken: 'tok_test',
    expireMth: req.body.expireMth,
    expireYr: req.body.expireYr,
    cvc: req.body.cvc,
    DonorId: req.user.id
  }).then( (results) => {
    // Build donations array from post data
    req.body.amount.forEach( (amt, i) => {
      donations.push({
        amount: amt,
        CharityId: req.body.CharityId[i],
        DonorId: req.user.id,
        PaymentId: results.id
      });
    });
    // Bulk insert donations into Donations table
    db.Donation.bulkCreate(donations).then( () => {
      db.Transaction.bulkCreate(donations).then ( () => {
        res.send({redirect: '/account'});
      });
    });
  });
});

// Export routes for server.js to use
module.exports = router;
