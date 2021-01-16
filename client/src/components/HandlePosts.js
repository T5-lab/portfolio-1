import React, {useState, useEffect} from 'react'
import axios from 'axios'
import EachPost from "./EachPost";
import {BACKENDURL, FRONTENDURL} from '../config'

function HandlePosts({user, USERID, showPost}) {
    const [posts, setPosts] = useState(null)

    useEffect(() => {
        setPosts(null)
        if(showPost) {
            axios.get(`${BACKENDURL}/user/post-info/${user._id}`)
                .then(res => {
                    setPosts(res.data)
                })
                .catch(e => alert(e))
        } else {
            axios.get(`${BACKENDURL}/user/liked-post-info/${user._id}`)
                .then(res => {
                    setPosts(res.data)
                })
                .catch(e => alert(e))
        }
    }, [showPost])

    if(posts) {
        return (
            <div>
                {posts.length && (
                    posts.map((post, i) => (
                        <EachPost
                            key={i}
                            post={post}
                            user={showPost ? user : post.from}
                            userId={USERID}
                        />
                    ))
                )}
            </div>
        )
    }
    return <h1>{showPost ? 'no posts' : 'no liked posts'}</h1>
}

export default HandlePosts;