const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:3000/api/auth/google/callback',
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const roleFromState = req.query.state;
    let user = await User.findByEmail(profile.emails[0].value);
    if (!user) {
      user = await User.create({
        email: profile.emails[0].value,
        name: profile.displayName,
        password: Math.random().toString(36).slice(-8), // random password
        role: roleFromState || 'learner',
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : undefined,
        googleId: profile.id
      });
    }
    // Issue JWT
    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    user.token = token;
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
}); 