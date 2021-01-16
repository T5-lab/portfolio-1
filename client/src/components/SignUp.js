import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {BACKENDURL, FRONTENDURL} from '../config'

function SignUp() {
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setError(window.location.search.substring(1)[0] === 'e' ? true : false)
    setSuccess(window.location.search.substring(1)[0] === 's' ? true : false)
  }, [])

  return (
    <form method='POST' action={`${BACKENDURL}/email-and-password/sign-up`} className='login'>
      <div className='login__btn_container'>
        <button className='login__btn'>Sign up</button>
        <Link to='/login'><p className='login__btn'>Login</p></Link>
      </div>
      <div className='login__form'>
        <p className='login__lable'>Name</p>
        <input name='name' className='login__input'/>
        <p className='login__lable'>Email</p>
        <input name='email' type='email' className='login__input'/>
        <p className='login__lable'>Password</p>
        <input name='password' type='password' className='login__input'/>
      </div>
      {error && (
        <div className='login__error'>
          <p className='login__error__txt'>Something Went Wrong</p>
        </div>
      )}
      {success && (
        <div className='login__success'>
          <p className='login__error__txt'>Check your Email</p>
        </div>
      )}
    </form>
  )
}

export default SignUp
