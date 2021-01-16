import React, {useState, useEffect} from 'react'
import {BACKENDURL, FRONTENDURL} from '../config'
import {Link} from 'react-router-dom'

function Login() {
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(window.location.search.substring(1) ? true : false)
  }, [])

  return (
    <form method='POST' action={`${BACKENDURL}/email-and-password/login`} className='login'>
      <div className='login__btn_container'>
        <button className='login__btn'>Login</button>
        <Link to='/sign-up'><p className='login__btn'>Sign Up</p></Link>
      </div>
      <div className='login__form'>
        <p className='login__lable'>Email</p>
        <input name='email' type='email' className='login__input'/>
        <p className='login__lable'>Password</p>
        <input name='password' type='password' className='login__input'/>
      </div>
      {error && (
        <div className='login__error'>
          <p className='login__error__txt'>Invalid Email or Password</p>
        </div>
      )}
      <div className='google'>
        <a className='google-btn' href={`${BACKENDURL}/auth/google`}>Login with Google</a>
        <Link to='/reset-password'><p className='google-btn'>Reset Password</p></Link>
      </div>
    </form>
  )
}

export default Login
