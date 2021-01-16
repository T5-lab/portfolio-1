import React, {useState, useEffect} from 'react'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import axios from 'axios'
import {Link} from 'react-router-dom'
import CommentPopup from "./CommentPopup";
import {BACKENDURL, FRONTENDURL} from '../config'

function EachPost({post, user, userId}) {
  const [liked, setLiked] = useState(false)
  const [likeCounter, setLikeCounter] = useState(post.likes.length)
  const [isComment, setIsComment] = useState(false)

  useEffect(() => {
    setLiked(post.likes.includes(userId))
  }, [])

  const handleLike = () => {
    axios.post(`${BACKENDURL}/post/like`, {postId: post._id}, {withCredentials: true})
    if(liked) {
      setLiked(false)
      setLikeCounter(likeCounter-1)
    } else {
      setLiked(true)
      setLikeCounter(likeCounter+1)
    }
  }

  return (
    <div className='post'>
      <Link to={`/post-details/${post._id}`}><div className='link-container'/></Link>
      {/*information of poster*/}
      <div className='poster_info'>
        <img className='post-avatar' alt={`${user.name}'s Avatar'`} src={`${BACKENDURL}/avatars/${user.avatar}`}/>
        <a href={`/user/${user._id}`}><p>{user.name}</p></a>
        <div className='btns'>
          {liked ? <FavoriteIcon color='secondary' onClick={handleLike}/> : <FavoriteBorderIcon onClick={handleLike}/>}
          <CommentIcon onClick={() => setIsComment(!isComment)}/>
        </div>
      </div>
      {/*information of post*/}
      <div className='post_info'>
        <div><img className='post_image' src={`${BACKENDURL}/post/image/${post.image}`}/></div>
        <div>{likeCounter} Likes</div>
        <div className='post_description'><p><span>{user.name}>>>  </span>{post.description}</p></div>
      </div>
      {/*comments*/}
      {isComment && <CommentPopup userId={userId} postId={post._id} COMMENT={{isComment, setIsComment}}/>}
    </div>
  )
}

export default EachPost
