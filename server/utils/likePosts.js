module.exports = likedPosts => {
    let LIKEDPOSTS = []
    return new Promise((resolve, reject) => {
        likedPosts.forEach(post => {
            post.populate('from').execPopulate().then(post => {
                LIKEDPOSTS.push(post)
                if(LIKEDPOSTS.length === likedPosts.length) resolve(LIKEDPOSTS)
            }).catch(e => reject(e))
        })
    })
}