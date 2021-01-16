import React, {useState, useEffect} from 'react'
import {useParams, Link} from 'react-router-dom'
import Loading from './Loading'
import axios from 'axios'
import HandlePosts from "./HandlePosts";
import {BACKENDURL, FRONTENDURL} from '../config'

function UserInfo({USER}) {
  const {id} = useParams()
  const [user, setUser] = useState(null)
  const [followed, setFollowed] = useState(false)
  const [followersCounter, setFollowersCounter] = useState(null)
  const [showPosts, setShowPosts] = useState(true)

  useEffect(() => {
    axios.get(`${BACKENDURL}/user/posts/${id}`, {withCredentials: true})
      .then(res => {
        setUser(res.data)
      })
      .catch(e => alert(e))
  }, [])

  useEffect(() => {
    if(user) {
      setFollowed(user.followers.includes(USER._id))
      setFollowersCounter(user.followers.length)
    }
  }, [user])

  const handleFollow = () => {
    if(user._id === USER._id) return alert('u cant follow urself')
    axios.get(`${BACKENDURL}/user/follow/${user._id}`, {withCredentials: true})
    if(followed) {
      setFollowed(false)
      setFollowersCounter(followersCounter-1)
    } else {
      setFollowed(true)
      setFollowersCounter(followersCounter+1)
    }
  }

  if(user) {
    return (
      <div className='user-info-container'>
        <div className='user-info'>
          <div className='user-info-info'>
            <img src={`${BACKENDURL}/avatars/${user.avatar}`} className='profile-pic'/>
            <p>{user.name}</p>
          </div>
          <div className='user-info-btns'>
            <div onClick={handleFollow} className='follow-btn'>{followed ? 'Unfollow' : 'Follow'}</div>
            <div onClick={() => setShowPosts(!showPosts)} className='follow-btn'>{!showPosts ? 'Liked Posts' : 'Posts'}</div>
          </div>
          <div className='user-info-right-info'>
            <Link to={`/user/${user._id}/followers`}><div><span>{followersCounter}</span><br/><span>Followers</span></div></Link>
            <Link to={`/user/${user._id}/followings`}><div><span>{user.followings.length}</span><br/><span>Followings</span></div></Link>
            <div><span>{user.posts.length}</span><br/><span>Posts</span></div>
          </div>
        </div>
        <div className='user-info-posts'>
          <HandlePosts
          user={user}
          USERID={USER._id}
          showPost={showPosts}
          />
        </div>
      </div>
    )
  } return <Loading/>
}

export default UserInfo;
