import React from 'react'
import {BACKENDURL, FRONTENDURL} from '../config'

function ResetPassword() {
  return (
    <div className='reset-password'>
      <form method='POST' action={`${BACKENDURL}/email-and-password/reset-password`} className='login'>
        <div className='header'>
          <p className='header__txt'>Reset Your Password</p>
          <p>Enter your Email to recieve a reset password link</p>
        </div>
        <div className='login__form'>
          <p className='login__lable'>Email</p>
          <input className='login__input' name='email' type='email'/>
        </div>
        <div><button className='login__btn'>Send</button></div>
      </form>
    </div>
  )
}

export default ResetPassword;
