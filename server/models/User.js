const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    minlength: 8
  },
  signedUpWith: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: 'default.png'
  },
  posts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  likedPosts: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post'
  }],
  followings: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user'
  }],
  commentsCreated: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'comment'
  }]
}, {timestamps: true})

UserSchema.pre('save', function(next) {
  if(this.password) {
    if(this.isModified('password')) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(this.password, salt);
      this.password = hash
      next()
    }
    next()
  }
  next()
})

UserSchema.methods.toJSON = function () {
  const {name, email, avatar, posts, likedPosts, followings, followers, commentsCreated, _id} = this
  return {name, email, avatar, posts, likedPosts, followings, followers, commentsCreated, _id}
}

UserSchema.statics.comparePassword = function (email, password) {
  return this.findOne({email}).then(user => {
    if(!user) return Promise.reject('user not found')
    const res = bcrypt.compareSync(password, user.password)
    if(res) return Promise.resolve(user)
    return Promise.reject('password is incorrect')
  })
}

UserSchema.statics.findUser = function (name) {
  return this.find({name}).then(users => {
    if(!users) return Promise.reject('user not found')
    return Promise.resolve(users)
  }).catch(err => Promise.reject(err))
}

const User = mongoose.model('user', UserSchema)

module.exports = {User}
