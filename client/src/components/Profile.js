import React, {useState, useEffect} from 'react'
import {BACKENDURL, FRONTENDURL} from '../config'

function Profile({user}) {
  const [name, setName] = useState(user.name)
  return (
    <form encType='multipart/form-data' className='login' method='POST' action={`${BACKENDURL}/user/${user._id}`}>
      <div><img alt={`${user.name}'s Avatar'`} className='avatar' src={`${BACKENDURL}/avatars/${user.avatar}`}/></div>
      <div className='login__form'>
        <p className='login__lable'>Name</p>
        <input className='login__input' value={name} onChange={e => setName(e.target.value)} name='name'/>
        <p className='login__lable'>Email</p>
        <input className='login__input' value={user.email} onChange={() => alert('u can\'t change your email')}/>
        <p className='login__lable'>Avatar</p>
        <input className='login__input' name='avatar' type='file' accept="image/png, image/jpeg, image/jpg" />
      </div>
      <div><button className='google-btn'>Update</button></div>
    </form>
  )
}

export default Profile;
