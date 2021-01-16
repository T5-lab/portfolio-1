import React, {useState, useEffect} from 'react'
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import axios from 'axios'
import {BACKENDURL, FRONTENDURL} from '../config'

function Comment({USER, comment}) {
    const [liked, setLiked] = useState(false)
    const [likesCounter, setLikesCounter] = useState(comment.likes.length)

    useEffect(() => {
        setLiked(comment.likes.includes(USER._id))
    }, [])

    const handleLike = () => {
        axios.post(`${BACKENDURL}/comment/like`, {commentId: comment._id, userId: USER._id}, {withCredentials: true})
        if(liked) {
            setLiked(!liked)
            setLikesCounter(likesCounter-1)
        } else {
            setLiked(!liked)
            setLikesCounter(likesCounter+1)
        }
    }

    return (
        <div className='comment'>
            <div className='user-info-info-2'>
                <img alt={`${comment.from.name}\'s avatar`} src={`${BACKENDURL}/avatars/${comment.from.avatar}`} className='comment-avatar'/>
                <p>{comment.from.name}</p>
            </div>
            <p>{comment.comment}</p>
            <div className='btns'>
                {liked ? <FavoriteIcon color='secondary' onClick={handleLike}/> : <FavoriteBorderIcon onClick={handleLike}/>}
                <p>{likesCounter}</p>
            </div>
        </div>
    )
}

export default Comment;