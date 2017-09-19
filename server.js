/*jslint esversion: 6, browser: true*/
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const routes = require('./controllers/main.js');
const moment = require('moment');

// Set port environment variable port if deployed or 3000 if local
const port = process.env.PORT || 3000;

// Require model for syncing
const db = require('./models');

// Create an instance of the express app
const app = express();

// Serve static content for the app from the 'public' directory
app.use(express.static('public'));

// Parse application/x-www-form-urlencoded and returned objects as JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup express to use passport
app.use(session({ secret: 'rhino cupcake',resave: true, saveUninitialized:true})); // session secret
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

// Override AJAX POST method if '?_method=' is used in action attribute
app.use(methodOverride('_method'));

// Define and register handlebar helper functions
let hbs = exphbs.create({
  helpers: {
    dateFormat: value => {
      return moment(value).format('MMMM Do, YYYY');
    },
    currencyFormat: value => {
      console.log(value);
      return value.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
    }
  },
  defaultLayout: 'main'
});

// Add handlebars engine to express middleware
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Open site at root
app.use('/', routes);

// Load passport strategies
require('./controllers/passport.js')(passport, db.Donor);

// Sync sequelize model and start express app on specified port
db.sequelize.sync().then( () => {
  app.listen(port, () => {
    console.log('App listening on port ' + port);
  });
}).catch( err => {
  console.log(err);
});
