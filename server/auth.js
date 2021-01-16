const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const {User} = require('./models/User')
const prepareEmail = require('./utils/prepareEmail')
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {BACKENDURL, FRONTENDURL} = require('./config')

passport.use(new LocalStrategy({usernameField: 'email'},
  function(email, password, done) {
    email = prepareEmail(email)
    User.findOne({email}).then(user => {
      if(!user) {
        return done(null, false, {message: "invalid password or email"})
      }
      User.comparePassword(email, password).then(user => {
        return done(null, user)
      }).catch(e => {
        return done(null, false, {message: "invalid password or email"})
      })
    })
  }
));

passport.use(new GoogleStrategy({
    clientID: '114305151275-8fb7su0uertg1gjg6adkqdf2v17t2dpa.apps.googleusercontent.com',
    clientSecret: 'iIkBJsESfE8-1fCJmAVQY58q',
    callbackURL: `${BACKENDURL}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    const data = {
      name: profile.displayName,
      email: prepareEmail(profile.emails[0].value),
      signedUpWith: 'google'
    }
    User.findOne({email: data.email}).then(user => {
      if(user) {
        if(user.signedUpWith !== 'google') {
          return done(`Try to login with ${user.signedUpWith}`)
        }
        return done(false, user)
      }
      const newUser = new User(data)
      newUser.save().then(user => {
        return done(false, user)
      }).catch(e => done(e))
    }).catch(e => done(e))
  }
));

passport.serializeUser((user, done) => done(false, user._id))
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    return done(false, user)
  }).catch(e => done(e))
})

module.exports = {
  initialize: passport.initialize(),
  session: passport.session()
}
