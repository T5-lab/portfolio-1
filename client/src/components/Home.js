import React, {useEffect, useState} from 'react'
import axios from 'axios'
import {BACKENDURL, FRONTENDURL} from '../config'
import {Link} from 'react-router-dom'

function Home({user}) {
  const [term, setTerm] = useState('')
  const [result, setResult] = useState(null)

  const search = () => {
    axios.get(`${BACKENDURL}/user/search-user/${term}`, {withCredentials: true})
        .then(res => {
          setResult(res.data)
        })
        .catch(e => alert(e))
  }

  return (
    <div className='home'>
      <Link to={'/profile'}><div className='google-btn'>Profile</div></Link>
        <Link to={'/myposts'}><div className='google-btn'>My Posts</div></Link>
        <Link to={'/post'}><div className='google-btn'>New Post</div></Link>
        <a href={`${BACKENDURL}/user/logout`}><div className='google-btn'>Logout</div></a>
      <input value={term} onChange={e => setTerm(e.target.value)}/>
      <button onClick={search}>Search</button>
      {result && (
          result.map((e, i) => (
            <Link to={`/user/${e._id}`}>{e.name}</Link>
          ))
      )}
    </div>
  )
}

export default Home
