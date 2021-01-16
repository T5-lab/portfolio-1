import React, {useState, useEffect} from 'react'
import axios from 'axios'
import Loading from './Loading'
import EachPost from './EachPost'
import {BACKENDURL, FRONTENDURL} from '../config'

function MyPosts({user}) {
  const [posts, setPosts] = useState(null)

  useEffect(() => {
    axios.get(`${BACKENDURL}/post/myposts/${user._id}`, {withCredentials: true})
      .then(res => {
        setPosts(res.data)
      })
      .catch(e => alert(e))
  }, [])

  if(posts) {
    return (
      <div className='myposts'>
        {posts.length ? (
          posts.map((post, i) => (
            <EachPost
            key={i}
            post={post}
            user={user}
            userId={user._id}
            />
          ))
        ) : (
          <div>u have no posts</div>
        )}
      </div>
    )
  }
  return <Loading/>
}

export default MyPosts
