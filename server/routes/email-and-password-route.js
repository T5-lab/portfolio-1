const express = require('express')
const prepareEmail = require('../utils/prepareEmail')
const {User} = require('../models/User')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const passport = require('passport')

const router = express.Router()

module.exports = ({BACKENDURL, FRONTENDURL}) => {
  // BACKENDURL/email-and-password
  router.post('/sign-up', (req, res, next) => {
    const data = {
      name: req.body.name,
      email: prepareEmail(req.body.email),
      password: req.body.password,
      signedUpWith: 'email-password'
    }
    if(!data.password || !data.email || !data.name) return res.redirect(`${FRONTENDURL}/sign-up?err=check your credentials`)

    User.findOne({email: data.email}).then(user => {
      if(user) {
        if(user.signedUpWith !== 'email-password') {
          return res.redirect(`${FRONTENDURL}/sign-up?err=Email Already In Use!! Please Login With ${user.signedUpWith}`)
        }
        return res.redirect(`${FRONTENDURL}/sign-up?err=Email Already In Use!!`)
      } else {
        const token = jwt.sign({name: data.name, email: data.email, password: data.password}, 'choqoki ke secret datad', {expiresIn: '20m'})

        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 't5.development4ever@gmail.com',
            pass: 'WHATisSOfunny'
          }
        });

        const mailOptions = {
          from: 't5.development4ever@gmail.com',
          to: data.email,
          subject: 'Email verification',
          html: `
            <h2>click on link below to proceed</h2>
            <p>${FRONTENDURL}/email-verification?token=${token}</p>
          `
        };

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
            res.redirect(`${FRONTENDURL}/sign-up?err=Something Went Wrong`)
          } else {
            res.redirect(`${FRONTENDURL}/sign-up?success=true`)
          }
        });
      }
    }).catch(e => res.redirect(`${FRONTENDURL}/sign-up?err=Something Went Wrong`))
  })

  router.post('/email-verified', (req, res, next) => {
    const {token} = req.body
    jwt.verify(token, 'choqoki ke secret datad', (err, decodedToken) => {
      if(err) {
        console.log(err);
        return res.redirect(`${FRONTENDURL}/email-verification?err=Link is expired or invalid`)
      }
      const {name, email, password} = decodedToken
      User.findOne({email}).then(user => {
        if(user) {
          if(user.signedUpWith !== 'email-password') {
            return res.redirect(`${FRONTENDURL}/email-verification?err=Email Already In Use!! Please Login With ${user.signedUpWith}`)
          }
          return res.send(`${FRONTENDURL}/email-verification?err=Email Already In Use!!`)
        }
        const newUser = new User({name, email, password, signedUpWith: 'email-password'})

        newUser.save().then(user => {
          res.redirect(`${FRONTENDURL}/login?info=account created`)
        }).catch(e => res.redirect(`${FRONTENDURL}/email-verification?err=Something went wrong`))
      }).catch(e => res.redirect(`${FRONTENDURL}/email-verification?err=Something went wrong`))
    })
  })

  router.post('/reset-password', (req, res, next) => {
    const data = {email: prepareEmail(req.body.email)}
    User.findOne({email: data.email}).then(user => {
      if(!user) return res.redirect(`${FRONTENDURL}/reset-password?err=user not found`)
      if(user.signedUpWith !== 'email-password') {
        return res.redirect(`${FRONTENDURL}/reset-password?err=You Should Login With Google`)
      }
      const token = jwt.sign({email: data.email}, 'this is my secret', {expiresIn: '20m'})

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 't5.development4ever@gmail.com',
          pass: 'WHATisSOfunny'
        }
      });

      const mailOptions = {
        from: 't5.development4ever@gmail.com',
        to: data.email,
        subject: 'Reset Password',
        html: `
          <h2>click on link below to proceed</h2>
          <a href='${FRONTENDURL}/reset-password/with-token?token=${token}'>Reset</a>
        `
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return res.redirect(`${FRONTENDURL}/reset-password?err=Something Went Wrong`)
        } else {
          return res.redirect(`${FRONTENDURL}/reset-password?success=true`)
        }
      });

    })
  })

  router.post('/reset-password-token', (req, res, next) => {
    const {token, password} = req.body
    jwt.verify(token, 'this is my secret', (err, decodedToken) => {
      if(err) {
        console.log(err);
        return res.redirect(`${FRONTENDURL}/reset-password/with-token?err=invalid token`)
      }
      const {email} = decodedToken
      User.findOne({email}).then(user => {
        user.password = password
        user.save().then(user => {
          return res.redirect(`${FRONTENDURL}/reset-password/with-token?success=password successfully reseted`)
        }).catch(e => res.redirect(`${FRONTENDURL}/reset-password/with-token?err=true`))
      }).catch(e => res.redirect(`${FRONTENDURL}/reset-password/with-token?err=true`))
    })
  })

  router.post('/login',
  passport.authenticate('local', {failureRedirect: `${FRONTENDURL}/login?err=true`}),
  function(req, res, next) {
    res.redirect(`${FRONTENDURL}?wb=true`)
  });

  return router
}
