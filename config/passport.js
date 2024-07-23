const passport = require('passport');
const { credentials } = require('../constants');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
    new GoogleStrategy({
        clientID: credentials.web.client_id,
        clientSecret: credentials.web.client_secret,
        callbackURL: '/auth/google/callback',
        scope: ['profile', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
        // Handle the user profile and authentication logic here
        return done(null, profile);
    })
);

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});
    