import React, {useEffect, useState} from "react";
import axios from 'axios'
import {Link} from 'react-router-dom'
import {BACKENDURL, FRONTENDURL} from '../config'

function EachPeople({user, USER}) {
    const [followed, setFollowed] = useState(false)
    const [followersCounter, setFollowersCounter] = useState(null)

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

    return (
        <div className='_user'>
            <div className='user-info-info'>
                <img className='post-avatar' alt={`${user.name}\'s Avatar`} src={`${BACKENDURL}/avatars/${user.avatar}`}/>
                <Link to={`/user/${user._id}`}><p>{user.name}</p></Link>
            </div>
            <div className='user-info-btns'>
                <div onClick={handleFollow} className='follow-btn'>{followed ? 'Unfollow' : 'Follow'}</div>
            </div>
            <div className='user-info-right-info'>
                <div><span>{followersCounter}</span><br/><span>Followers</span></div>
                <div><span>{user.followings.length}</span><br/><span>Followings</span></div>
                <div><span>{user.posts.length}</span><br/><span>Posts</span></div>
            </div>
        </div>
    )
}

export default EachPeople;