import React, {useEffect, useState} from "react";
import {useParams, Link} from 'react-router-dom'
import axios from 'axios'
import Loading from "./Loading";
import EachPeople from "./EachPeople";
import {BACKENDURL, FRONTENDURL} from '../config'

function Followers({USER}) {
    const {id} = useParams()
    const [user, setUser] = useState(null)
    const [followed, setFollowed] = useState(false)
    const [followersCounter, setFollowersCounter] = useState(null)
    const [followers, setFollowers] = useState(null)

    useEffect(() => {
        axios.get(`${BACKENDURL}/user/posts/${id}`, {withCredentials: true})
            .then(res => {
                setUser(res.data)
            })
            .catch(e => alert(e))
    }, [])

    useEffect(() => {
        if(user) {
            axios.get(`${BACKENDURL}/user/followers/${user._id}`, {withCredentials: true})
                .then(res => {
                    setFollowers(res.data)
                })
                .catch(e => alert(e))
        }
    }, [user])

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
                        <Link to={`/user/${user._id}`}><p>{user.name}</p></Link>
                    </div>
                    <div className='user-info-btns'>
                        <div onClick={handleFollow} className='follow-btn'>{followed ? 'Unfollow' : 'Follow'}</div>
                        <Link to={`/user/${id}/followings`}><div className='follow-btn'>Followings</div></Link>
                    </div>
                    <div className='user-info-right-info'>
                        <Link to={`/user/${user._id}/followers`}><div><span>{followersCounter}</span><br/><span>Followers</span></div></Link>
                        <Link to={`/user/${user._id}/followings`}><div><span>{user.followings.length}</span><br/><span>Followings</span></div></Link>
                        <div><span>{user.posts.length}</span><br/><span>Posts</span></div>
                    </div>
                </div>
                <div className='show-details-container'>
                    {followers ? (
                        followers.length ? (
                            followers.map((follower, i) => (
                                <EachPeople
                                USER={USER}
                                key={i}
                                user={follower}
                                />
                            ))
                        ) : (
                            <h1>this user has no followers</h1>
                        )
                    ) : <Loading/>}
                </div>
            </div>
        )
    }
    return <Loading/>
}

export default Followers;