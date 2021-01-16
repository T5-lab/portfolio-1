import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {BACKENDURL, FRONTENDURL} from '../config'

function CommentPopup({COMMENT, postId, userId}) {
    const {isComment, setIsComment} = COMMENT
    const [comment, setComment] = useState('')

    const postComment = () => {
        axios.post(`${BACKENDURL}/comment`, {comment, postId, userId}, {withCredentials: true})
            .then(res => {
                setIsComment(false)
            })
            .catch(e => alert(e))
    }

    useEffect(() => {
        document.querySelector('.comment-popup').addEventListener('click', e => {
            if(e.target.className === 'comment-popup') {
                setIsComment(false)
            }
        })
    }, [])

    return (
        <div className='comment-popup'>
            <div className='comment-box'>
                <h2 className='login__lable'>Comment</h2>
                <input onChange={e => setComment(e.target.value)} className='login__input' value={comment}/>
                <button onClick={postComment} className='google-btn'>Post</button>
            </div>
        </div>
    )
}

export default CommentPopup;