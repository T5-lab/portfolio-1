const express = require('express')
const {Post} = require('../models/Post')
const {User} = require('../models/User')
const upload = require('../utils/upload')
const fs = require('fs')
const path = require('path')
const generateName = require('../utils/generateName')
const getExtension = require('../utils/getExtension')
const HandleComments = require('../utils/likePosts')

const router = express.Router()

module.exports = ({BACKENDURL, FRONTENDURL}) => {
  // BACKENDURL/post

  router.get('/', (req, res, next) => Post.find().then(posts => res.send(posts)))

  router.get('/image/:name', (req, res, next) => {
    res.sendFile(path.resolve(__dirname, '../', 'Posts', req.params.name))
  })

  router.post('/', upload.single('image'), (req, res, next) => {
    if(req.file.mimetype === 'image/png' || req.file.mimetype === 'image/jpeg' || req.file.mimetype === 'image/jpg') {
      return next()
    }
    return res.redirect(`${FRONTENDURL}/post?err=Type Error`)
  }, (req, res, next) => {
    const {description, userId} = req.body
    let imageName = generateName()
    imageName = `${imageName}${getExtension(req.file.originalname)}`
    fs.writeFileSync(path.resolve(__dirname, '../', 'Posts', imageName), req.file.buffer)
    const post = new Post({description, from: userId, image: imageName})
    post.save().then(post => {
      User.findById(userId).then(user => {
        user.posts.push(post._id)
        user.save().then(user => {
          return res.redirect(`${FRONTENDURL}/post?status=successfully posted`)
        }).catch(e => res.redirect(`${FRONTENDURL}/post?status=err`))
      }).catch(e => res.redirect(`${FRONTENDURL}/post?status=err`))
    }).catch(e => res.redirect(`${FRONTENDURL}/post?status=err`))
  })

  router.post('/del', (req, res, next) => {
    const {postId} = req.body;
    Post.findOneAndDelete({_id: postId}).then(post => {
      User.findById(post.from).then(user => {
        user.posts.pull(postId)
        user.save().then(user => res.redirect(`${FRONTENDURL}?postSuccessfullyDeleted=true`))
      })
    }).catch(e => res.redirect(`${FRONTENDURL}?postSuccessfullyDeleted=false`))
  })

  router.get('/myposts/:id', (req, res, next) => {
    const {id} = req.params
    User.findById(id).then(user => {
      user.populate('posts').execPopulate().then(user => {
        res.send(user.posts)
      }).catch(e => res.send(e))
    }).catch(e => res.send(e))
  })

  router.post('/like', (req, res, next) => {
    const {postId} = req.body
    Post.findById(postId).then(post => {
      if(!post) return res.send('post not found')
      if(!post.likes.includes(req.user._id)) {
        post.likes.push(req.user._id)
        post.save().then(post => {
          User.findById(req.user._id).then(user => {
            user.likedPosts.push(post._id)
            user.save().then(user => {
              return res.send('liked')
            }).catch(e => res.send(e))
          }).catch(e => res.send(e))
        }).catch(e => res.send(e))
      } else {
        post.likes.pull(req.user._id)
        post.save().then(post => {
          User.findById(req.user._id).then(user => {
            user.likedPosts.pull(post._id)
            user.save().then(user => {
              return res.send('unliked')
            }).catch(e => res.send(e))
          }).catch(e => res.send(e))
        }).catch(e => res.send(e))
      }
    }).catch(e => res.send(e))
  })

  router.get('/:postId', (req, res, next) => {
    Post.findById(req.params.postId).then(post => {
      if(!post) return res.redirect(`${FRONTENDURL}/post-details?err=post-not-found`)
      post.populate('from', ['name', 'avatar']).execPopulate().then(post => {
        res.send(post)
      })
    })
  })

  return router
}
