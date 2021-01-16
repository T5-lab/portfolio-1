import React, {useState, useEffect} from 'react'
import {BACKENDURL, FRONTENDURL} from '../config'

function ResetPasswordWithToken() {
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
    <div className='reset-password-token'>
      <form className='login' method='POST' action={`${BACKENDURL}/email-and-password/reset-password-token`}>
        <div className='header'>
          <p className='header__txt'>Reset Your Password</p>
          <p>Enter your new password</p>
        </div>
        <div className='login__form'>
          <input value={token} name='token' className='token'/>
          <p className='login__lable'>Password</p>
          <input className='login__input' name='password' type='password'/>
        </div>
        <div><button className='login__btn'>Send</button></div>
      </form>
    </div>
  )
}

export default ResetPasswordWithToken
