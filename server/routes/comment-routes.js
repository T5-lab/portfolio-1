const express = require('express')
const {Post} = require('../models/Post')
const {Comment} = require('../models/Comment')
const {User} = require('../models/User')

const router = express.Router()

module.exports = ({BACKENDURL, FRONTENDURL}) => {
    // BACKENDURL/comment

    router.get('/a', (req, res, next) => Comment.find().then(c => res.send(c)))

    router.post('/', (req, res, next) => {
        const {comment, postId, userId} = req.body;
        const newComment = new Comment({comment, post: postId, from: userId})
        newComment.save().then(comment => {
            Post.findById(postId).then(post => {
                post.comments.push(comment._id)
                post.save()
            })
            User.findById(userId).then(user => {
                user.commentsCreated.push(comment._id)
                user.save()
            })
            return res.send(comment)
        })
    })

    router.post('/like', (req, res, next) => {
        const {commentId, userId} = req.body;
        Comment.findById(commentId).then(comment => {
            if(!comment) return res.send('comment not found')
            if(!comment.likes.includes(userId)) {
                comment.likes.push(userId)
                comment.save().then(comment => res.send('comment liked'))
            } else {
                comment.likes.pull(userId)
                comment.save().then(comment => res.send('comment unliked'))
            }
        })
    })

    router.get('/:postId', async (req, res, next) => {
        const {postId} = req.params;
        const page = req.query.page ? parseInt(req.query.page) : 1;
        const comments = await Comment.find({post: postId}).skip((page - 1) * 5).limit(5).populate('from', ['avatar', 'name']).exec();
        res.send(comments)
    })

    return router
}