import React, {useState, useEffect} from 'react'
import axios from 'axios'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom"
import {BACKENDURL, FRONTENDURL} from './config'
import Home from './components/Home'
import Login from './components/Login'
import Loading from './components/Loading'
import SignUp from './components/SignUp'
import Verification from './components/Verification'
import ResetPassword from './components/ResetPassword'
import ResetPasswordWithToken from './components/ResetPasswordWithToken'
import Profile from './components/Profile'
import Post from './components/Post'
import MyPosts from './components/MyPosts'
import UserInfo from './components/UserInfo'
import Followers from "./components/Followers";
import Followings from "./components/Followings";
import PostWithDetails from "./components/PostWithDetails";

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    axios.get(`${BACKENDURL}/user`, {withCredentials: true})
      .then(res => {
        console.log('response is >>> ', res)
        setUser(res.data)
      })
      .catch(e => {
        console.log(e)
      })
  }, [])

  useEffect(() => console.log(BACKENDURL, FRONTENDURL), [])
  useEffect(() => {
    console.log(user)
  }, [user])

  if(user) {
    return (
      <div className='app'>
        <div className='bg-image'/>
        <Router>
          <Switch>
            <Route path='/sign-up'>
              {!user.authenticated ? (
                <SignUp/>
              ) : (
                <Redirect to='/'/>
              )}
            </Route>

            <Route path='/login'>
              {!user.authenticated ? (
                <Login/>
              ) : (
                <Redirect to='/'/>
              )}
            </Route>

            <Route path='/reset-password/with-token'>
              <ResetPasswordWithToken/>
            </Route>

            <Route path='/reset-password'>
              <ResetPassword/>
            </Route>

            <Route path='/email-verification'>
              <Verification/>
            </Route>

            <Route path='/post'>
              {user.authenticated ? (
                <Post user={user}/>
              ) : (
                <Redirect to='/login'/>
              )}
            </Route>

            <Route path='/myposts'>
              {user.authenticated ? (
                <MyPosts user={user}/>
              ) : (
                <Redirect to='/login'/>
              )}
            </Route>

            <Route path='/profile'>
              {user.authenticated ? (
                <Profile user={user}/>
              ) : (
                <Redirect to='/login'/>
              )}
            </Route>

            <Route path='/user/:id/followers'>
              {user.authenticated ? (
                  <Followers USER={user}/>
              ) : (
                  <Redirect to='/login'/>
              )}
            </Route>

            <Route path='/user/:id/followings'>
              {user.authenticated ? (
                  <Followings USER={user}/>
              ) : (
                  <Redirect to='/login'/>
              )}
            </Route>

            <Route path='/user/:id'>
              {user.authenticated ? (
                <UserInfo USER={user}/>
              ) : (
                <Redirect to='/login'/>
              )}
            </Route>

            <Route path='/post-details/:postId'>
              {user.authenticated ? (
                  <PostWithDetails USER={user}/>
              ) : (
                  <Redirect to='/login'/>
              )}
            </Route>

            <Route path='/'>
              {user.authenticated ? (
                <Home user={user}/>
              ) : (
                <Redirect to='/login'/>
              )}
            </Route>
          </Switch>
        </Router>
      </div>
    )
  }
  return <Loading/>
}

export default App;
