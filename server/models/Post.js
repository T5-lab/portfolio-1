const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }]
}, {timestamps: true})

const Post = mongoose.model('post', PostSchema)

module.exports = {Post}
