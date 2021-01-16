import React, {useState, useEffect} from "react";
import axios from 'axios'
import Loading from "./Loading";
import {useParams} from 'react-router-dom'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import CommentIcon from '@material-ui/icons/Comment'
import Comment from "./Comment";
import CommentPopup from "./CommentPopup";
import {BACKENDURL, FRONTENDURL} from '../config'

function PostWithDetails({USER}) {
    const {postId} = useParams()
    const [post, setPost] = useState(null)
    const [likesCounter, setLikesCounter] = useState(null)
    const [liked, setLiked] = useState(null)
    const [comments, setComments] = useState(null)
    const [isComment, setIsComment] = useState(false)
    const [pageCounter, setPageCounter] = useState(2)

    useEffect(() => {
        axios.get(`${BACKENDURL}/post/${postId}`, {withCredentials: true})
            .then(res => {
                setPost(res.data)
            })
            .catch(e => alert(e))
    }, [])

    useEffect(() => {
        getComments()
    }, [])

    const getComments = () => {
        setPageCounter(2)
        axios.get(`${BACKENDURL}/comment/${postId}`, {withCredentials: true})
            .then(res => {
                setComments(res.data)
            })
            .catch(e => alert(e))
    }

    const showMore = () => {
        setPageCounter(pageCounter+1)
        axios.get(`${BACKENDURL}/comment/${postId}?page=${pageCounter}`).then(res => {
            setComments(comments.concat(res.data))
        })
            .catch(e => alert(e))
    }

    useEffect(() => {
        getComments()
    }, [isComment])

    useEffect(() => {
        if(post) {
            setLikesCounter(post.likes.length)
            setLiked(post.likes.includes(USER._id))
        }
    }, [post])

    const handleLike = () => {
        axios.post(`${BACKENDURL}/post/like`, {postId: post._id}, {withCredentials: true})
        if(liked) {
            setLiked(false)
            setLikesCounter(likesCounter-1)
        } else {
            setLiked(true)
            setLikesCounter(likesCounter+1)
        }
    }

    const commentHandle = () => {
        setIsComment(!isComment)
    }

    if(post) {
        return (
            <div className='post-with-details-container'>
                <div className='post-with-details'>
                    <div className='user-information'>
                        <img alt={`${post.from.name}\'s avatar`} src={`${BACKENDURL}/avatars/${post.from.avatar}`} className='profile-pic-2'/>
                        <a href={`${FRONTENDURL}/user/${post.from._id}`}><p>{post.from.name}</p></a>
                        <div className='btns'>
                            {liked ? <FavoriteIcon color='secondary' onClick={handleLike}/> : <FavoriteBorderIcon onClick={handleLike}/>}
                            <CommentIcon onClick={commentHandle}/>
                        </div>
                    </div>
                    <img className='post-with-details-image' src={`${BACKENDURL}/post/image/${post.image}`} alt={`${post.description}\'s image`}/>
                    <p>{likesCounter} Likes</p>
                    <p>{post.from.name} >>> {post.description}</p>
                </div>
                <div className='comments-container'>
                    {comments ? comments.length ? (
                        comments.map((comment, i) => (
                            <Comment
                            key={i}
                            USER={USER}
                            comment={comment}
                            />
                        ))
                    ) : (
                        <h2>no comments</h2>
                    ) : (
                        <Loading/>
                    )}
                </div>
                <p onClick={showMore} className='show-more'>show more...</p>
                {isComment && <CommentPopup COMMENT={{isComment, setIsComment}} postId={postId} userId={USER._id}/>}
            </div>
        )
    }
    return <Loading/>
}

export default PostWithDetails;