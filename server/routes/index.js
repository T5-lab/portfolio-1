const express = require('express')
const EProutes = require('./email-and-password-route')
const GAroutes = require('./google-auth-route')
const userRoutes = require('./user-route')
const avatarRoutes = require('./avatar-route')
const postRoutes = require('./post-route')
const commentRoutes = require('./comment-routes')
const {BACKENDURL, FRONTENDURL} = require('../config')

const router = express.Router()

module.exports = () => {

  router.get('/', (req, res, next) => {
    res.send('first page')
  })

  router.use('/email-and-password', EProutes({BACKENDURL, FRONTENDURL}))

  router.use('/auth/google', GAroutes({BACKENDURL, FRONTENDURL}))

  router.use('/user', userRoutes({BACKENDURL, FRONTENDURL}))

  router.use('/avatars', avatarRoutes({BACKENDURL, FRONTENDURL}))

  router.use('/post', postRoutes({BACKENDURL, FRONTENDURL}))

  router.use('/comment', commentRoutes({BACKENDURL, FRONTENDURL}))

  return router
}
