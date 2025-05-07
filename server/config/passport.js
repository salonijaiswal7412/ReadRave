const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/api/auth/google/callback",
},
    async (accessToke, refreshToken, profile, done) => {
        try {
            const email = profile.email[0].value;
            let user = await User.findOne({ email });

            if (!user) {
                user = await User.create({
                    name: profile.displayName,
                    email: email,
                    password: 'googleoauth',
                });
            }
            done(null, user);
        }
        catch (err) {
            done(err, null);
        }
    }));

