const express = require('express')
const {User} = require('../models/User')
const {Post} = require('../models/Post')
const upload = require('../utils/upload')
const fs = require('fs')
const path = require('path')
const getExtension = require('../utils/getExtension')
const generateName = require('../utils/generateName')
const HandleLikePosts = require('../utils/likePosts')

const router = express.Router()

module.exports = ({BACKENDURL, FRONTENDURL}) => {
  // BACKENDURL/user

  router.get('/a', (req, res, next) => {
    User.find().then(users => res.send(users))
  })

  router.get('/', (req, res, next) => {
    if(req.user) {
      res.send({
        ...req.user._doc,
        authenticated: true
      })
    } else {
      res.send({authenticated: false})
    }
  })

  router.get('/logout', (req, res, next) => {
    req.logout()
    res.redirect(`${FRONTENDURL}/login`)
  })

  router.post('/:id', upload.single('avatar'), async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if(!req.file) {
      req.BUFFER = null;
      req.EXTENSION = getExtension(user.avatar)
      req.LASTAVATARNAME = user.avatar
      return next()
    } else {
      req.BUFFER = req.file.buffer
      req.EXTENSION = getExtension(req.file.originalname)
    }
    if(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/jpg') {
      return next()
    }
    return res.redirect(`${FRONTENDURL}/profile?err=Type Error`)
  }, (req, res, next) => {
    const avatarName = req.BUFFER ? `${generateName()}${req.EXTENSION}` : req.LASTAVATARNAME
    if(req.BUFFER) {
      fs.writeFileSync(path.resolve(__dirname, '../', 'Avatars', avatarName), req.BUFFER)
    }
    User.findOneAndUpdate({_id: req.params.id}, {name: req.body.name, avatar: avatarName}, {useFindAndModify: false}).then(() => {
      return res.redirect(`${FRONTENDURL}?profile=updated`)
    }).catch(err => res.redirect(`${FRONTENDURL}?err=update error`))
  })

  router.get('/posts/:id', (req, res, next) => {
    User.findById(req.params.id).then(user => {
      if(!user) return res.send('user not found')
      res.send(user)
    })
  })

  router.get('/post-info/:id', (req, res, next) => {
    const {id} = req.params;
    User.findById(id).then(user => {
      if(!user) return res.send('user not found')
      user.populate('posts').execPopulate().then(user => {
        res.send(user.posts)
      }).catch(e => console.log(e))
    }).catch(e => console.log(e))
  })

  router.get('/liked-post-info/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
      const user = await User.findById(id).populate({path: 'likedPosts', populate: {path: 'from'}})
      res.send(user.likedPosts)
    } catch (e) {
      res.send(e);
    }
  })

  router.get('/follow/:userId', (req, res, next) => {
    User.findById(req.params.userId).then(user => {
      if(!user) return res.send('user not found')
      if(!user.followers.includes(req.user._id)) {
        user.followers.push(req.user._id)
        user.save().then(user => {
          User.findById(req.user._id).then(me => {
            me.followings.push(req.params.userId)
            me.save().then(() => {
              res.send('successfully followed')
            })
          })
        })
      } else {
        user.followers.pull(req.user._id)
        user.save().then(user => {
          User.findById(req.user._id).then(me => {
            me.followings.pull(req.params.userId)
            me.save().then(() => {
              res.send('successfully unfollowed')
            })
          })
        })
      }
    })
  })

  router.get('/followers/:id', (req, res, next) => {
    const {id} = req.params;
    User.findById(id).then(user => {
      if(!user) return res.send('user not found')
      user.populate('followers').execPopulate().then(user => {
        res.send(user.followers)
      }).catch(e => res.send(e))
    }).catch(e => res.send(e))
  })

  router.get('/followings/:id', (req, res, next) => {
    const {id} = req.params;
    User.findById(id).then(user => {
      if(!user) return res.send('user not found')
      user.populate('followings').execPopulate().then(user => {
        res.send(user.followings)
      }).catch(e => res.send(e))
    }).catch(e => res.send(e))
  })

  router.get('/search-user/:term', async (req, res, next) => {
    User.findUser(req.params.term).then(users => {
      res.send(users)
    }).catch(err => res.send(err))
  })

  return router
}
