/*jslint esversion: 6, browser: true*/
const bCrypt = require('bcrypt-nodejs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = (passport, donor) => {
  // Initialize the passport-local strategy and the donor model, which will be passed as arguments
  let Donor = donor;
  console.log(Donor);

  // Used to serialize the user
  passport.serializeUser( (donor, done) => {
    done(null, donor.id);
  });

  // Used to deserialize the user
  passport.deserializeUser( (id, done) => {
    Donor.findById(id).then( donor => {
      if (donor) {
        done(null, donor.get());
      } else {
        done(donor.errors, null);
      }
    });
  });

  // Defines custom strategy with instance of the LocalStrategy
  passport.use('local-signup', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    }, (req, email, password, done) => {
      // Add hashed password generating function inside callback function.
      let generateHash = password => {
        return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };
      // Check to see if donor already exists, if not add as new donor
      Donor.findOne({
        where: {
          email: email
        }
      }).then( donor => {
        if (donor) {
          return done(null, false, {
            message: 'This email address is already taken'
          });
        } else {
          let hashPassword = generateHash(password);
          let data = {
            nameFirst: req.body.nameFirst,
            nameLast: req.body.nameLast,
            gender: req.body.gender,
            locationStreet: req.body.locationStreet,
            locationCity: req.body.locationCity,
            StateAbbrev: req.body.StateAbbrev,
            locationZip: req.body.locationZip,
            phone: req.body.phone,
            profileImg: req.body.profileImg,
            email: email,
            password: hashPassword
          };
          console.log(data);

          Donor.create(data).then( (newDonor, created) => {
            if (!newDonor) {
              return done(null, false);
            }
            if (newDonor) {
              return done(null, newDonor);
            }
          });
        }
      });
    }
  ));

  // Local strategy for signin
  passport.use('local-signin', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true // allows us to pass back the entire request to the callback
    }, (req, email, password, done) => {
      let Donor = donor;
      let isValidPassword = (userpass, password) => {
        return bCrypt.compareSync(password, userpass);
      };

      Donor.findOne({
        where: {
          email: email
        }
      }).then( donor => {
        if (!donor) {
          return done(null, false, {
            message: 'Email address does not exist'
          });
        }
        if (!isValidPassword(donor.password, password)) {
          return done(null, false, {
            message: 'Incorrect password.'
          });
        }
        let donorInfo = donor.get();
        return done(null, donorInfo);
      }).catch(err => {
        console.log("Error:", err);

        return done(null, false, {
          message: 'Something went wrong with the login. Please try again.'
        });
      });
    }
  ));
};
