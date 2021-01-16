const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post'
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    }]
}, {timestamps: true})

const Comment = mongoose.model('comment', CommentSchema)

module.exports = {Comment}