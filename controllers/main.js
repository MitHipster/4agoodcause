/*jslint esversion: 6, browser: true*/
const express = require('express');
const sequelize = require('sequelize');
const passport = require('passport');
const moment = require('moment');
// Import database model
const db = require('../models');

// Create the `router` for the app and export the `router` at the end of your file.
const router = express.Router();

// Store Ids from categories and charities api post routes
let arrayIds = [];

// Function to check if a donor is logged in
let isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.redirect('/signin');
};

// Route to home page
router.get('/', (req, res) => {
  res.render('index', { content: {user: req.user} });
});

// Route to signup a new donor
router.get('/signup', (req, res) => {
  res.render('signup', { content: {message: req.flash('error')} });
});

// Route to post new donor information
router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/categories',
    failureRedirect: '/signup_error'
  }
));

// Route to create flash error message
router.get('/signup_error', (req, res) => {
  req.flash('error', 'An account already exists with this email address. Please sign in or try a different email address.');
  res.redirect('/signup');
});

// Route to create flash signup message
router.get('/signup_success', (req, res) => {
  req.flash('success', "Donation complete! Thank you for your contribution. This is your personal home page.");
  res.redirect('/account');
});

// Route to signin an existing donor
router.get('/signin', (req, res) => {
  res.render('signin', { content: { message: req.flash('error')} });
});

// Route to redirect existing signed in donor
router.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/account',
    failureRedirect: '/signin_error'
  }
));

// Route to create flash error message
router.get('/signin_error', (req, res) => {
  req.flash('error', 'Invalid username or password. Please try again.');
  res.redirect('/signin');
});

// Route to redirect donor to select categories after signing up
router.get('/categories', isLoggedIn, (req, res) => {
  db.Category.findAll({
    order: [
      [ 'categoryName', 'ASC' ]
    ]
  }).then(results => {
    res.render('categories', {
      content: {
        categories: results,
        user: req.user
      }
    });
  });
});

// Route to display a filtered charities list based on selected categories
router.get('/charities', isLoggedIn, (req, res) => {
  db.Category.findAll({
    include: [
    { model: db.Charity, include: [db.Cause] }
  ],
    where: { id: arrayIds },
    order: [
      [ 'categoryName', 'ASC' ],
      [ {model: db.Charity}, 'charityName', 'ASC' ]
    ]
  }).then(results => {
    res.render('charities', {
      content: {
        charities: results,
        user: req.user
      }
    });
    arrayIds = [];
  });
});

// Route to display selected charities and payment form
router.get('/donations', isLoggedIn, (req, res) => {
  db.Charity.findAll({
    where: { id: arrayIds },
    order: [
      [ 'charityName', 'ASC' ]
    ]
  }).then(results => {
    res.render('donations', {
      content: {
        donations: results,
        user: req.user
      }
    });
    arrayIds = [];
  });
});

// Route to display user profile information
router.get('/account', isLoggedIn, (req, res) => {
  let content = {};
  // Assign flash message
  content.message = req.flash('success');
  // Retrieve donor information
  db.Donor.findOne({
    include: [{
      model: db.State
    }, {
      model: db.Donation,
      include: [{
        model: db.Charity,
        include: [{
          model: db.Category
        }, {
          model: db.Cause
        }]
      }]
    }],
    where: { id: req.user.id }
  }).then(results => {
    content.account = results;
    // Retrieve donor transactions
    db.Payment.findAll({
      attributes: [
        [ sequelize.col('Transactions.createdAt'), 'createdAt' ], 'cardName', [ sequelize.fn('SUM', sequelize.col('Transactions.amount')), 'amount' ]
      ],
      include: [{
        // Empty attributes array used to exclude transaction fields (i.e. only fields specified above are included)
        model: db.Transaction, attributes: []
      }],
      group: [
        [{ model: db.Transaction }, 'createdAt' ]
      ],
      order: [
        [{ model: db.Transaction }, 'createdAt' , 'DESC' ]
      ],
      where: { id: req.user.id },
      // Raw statement is needed to return all records instead of just first instance
      raw: true
    }).then(results => {
      content.transactions = results;
      // Sum total donations
      let donated = 0;
      content.transactions.forEach( transaction => {
        donated += parseFloat(transaction.amount);
      });
      content.donated = donated;
      res.render('account', content);
    });
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
  arrayIds = req.body.ids.map(Number);
  res.send({redirect: '/charities'});
});

router.post('/api/donations', (req, res) => {
  arrayIds = req.body.ids.map(Number);
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
      db.Transaction.bulkCreate(donations).then( () => {
        res.redirect('/signup_success');
      });
    });
  });
});

// Export routes for server.js to use
module.exports = router;
