import React from 'react'
import {BACKENDURL, FRONTENDURL} from '../config'

function Post({user}) {
  return (
    <form encType='multipart/form-data' className='login' method='POST' action={`${BACKENDURL}/post`}>
      <div className='login__form'>
        <p className='login__lable'>Image</p>
        <input name='image' className='login__input' type='file' accept="image/png, image/jpeg, image/jpg" />
        <p className='login__lable'>Description</p>
        <textarea className='login__input' name='description'/>
        <input value={user._id} name='userId' style={{display: 'none'}}/>
      </div>
      <div><button className='google-btn'>Post</button></div>
    </form>
  )
}

export default Post;
