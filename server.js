/*jslint esversion: 6, browser: true*/
const express = require('express');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const routes = require('./controllers/main_controller.js');

// Set port environment variable port if deployed or 3000 if local
const port = process.env.PORT || 3000;

// Require model for syncing
const db = require('./models');

// Create an instance of the express app
const app = express();

// Serve static content for the app from the 'public' directory
app.use(express.static('public'));

// Parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Override AJAX POST method if '?_method=' is used in action attribute
app.use(methodOverride('_method'));

// Add handlebars engine to express middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Open site at root
app.use('/', routes);

// Sync sequelize model and start express app on specified port
db.sequelize.sync({force: true}).then( () => {
  app.listen(port, () => {
    console.log('App listening on port ' + port);
  });
}).catch( err => {
  console.log(err);
});
