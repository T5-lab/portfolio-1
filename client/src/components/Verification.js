import React, {useState, useEffect} from 'react'
import {BACKENDURL, FRONTENDURL} from '../config'

function Verification() {
  const [token, setToken] = useState(null)

  useEffect(() => {
    let z = window.location.search.substring(1).split('')
    let e = z.findIndex(i => {return i==='='})
    z.join('')
    let q = []
    for(let i = e+1; i < z.length; i++) {
      q.push(z[i])
    }
    q = q.join("")
    setToken(q)
  }, [])

  useEffect(() => {
    document.querySelector('.token').style.display = 'none';
  })

  return (
    <div className='verification'>
      <form className='login' method='POST' action={`${BACKENDURL}/email-and-password/email-verified`}>
        <input className='token' value={token} name='token'/>
        <button className='verify-btn'>Verify</button>
      </form>
    </div>
  )
}

export default Verification
