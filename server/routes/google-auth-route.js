const express = require('express')
const passport = require('passport')

const router = express.Router()

module.exports = ({BACKENDURL, FRONTENDURL}) => {
  // BACKENDURL/auth/google

  router.get('/',
    passport.authenticate('google', { scope: ['profile', 'email'] }));

  router.get('/callback',
    passport.authenticate('google', { failureRedirect: `${FRONTENDURL}/login` }),
    function(req, res) {
      // Successful authentication, redirect home.
      res.redirect(`${FRONTENDURL}`);
    });

  return router
}
