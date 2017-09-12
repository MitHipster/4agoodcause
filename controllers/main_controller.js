/*jslint esversion: 6, browser: true*/
const express = require('express');
// Import database model
const db = require('../models');

// Create the `router` for the app and export the `router` at the end of your file.
const router = express.Router();
// Use request method to get API data to pipe to response
const request = require('request');

// Route to get all 4-star causes for donor to choose from.
router.get('/', (req, res, next) => {

});

// Export routes for server.js to use.
module.exports = router;
