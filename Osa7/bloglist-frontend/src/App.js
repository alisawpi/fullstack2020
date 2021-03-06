import React, { useState, useEffect } from 'react'
import { initializeBlogs } from './reducers/blogReducer'
import { createMessage } from './reducers/notificationReducer'
import { loginUser, initializeUser } from './reducers/userReducer'
import Message from './components/Message'
import Login from './components/Login'
import BlogForm from './components/BlogForm';
import { useDispatch, useSelector } from 'react-redux'
import userService from './services/users'
import Menu from './components/Menu'
import Header from './components/Header'
import { Route, useRouteMatch, Switch } from 'react-router-dom'
import UserList from './components/UserList'
import User from './components/User'
import BlogInfo from './components/BlogInfo'
import BlogList from './components/BlogList'


const App = () => {
  const blogs = useSelector(state => state.blogs)
  const user = useSelector(state => state.user)
  const [allUsers, setAllUsers] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const sortedByLikes = blogs.sort((a, b) => (a.likes > b.likes) ? -1 : ((b.likes > a.likes) ? 1 : 0));

  console.log(blogs)
  console.log(user)
  console.log(allUsers)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(initializeUser())
    dispatch(initializeBlogs())
    userService.getAll().then(users => setAllUsers(users))
  }, [])
  const handleUsername = ({ target }) => {
    setUsername(target.value)
  }
  const handlePassword = ({ target }) => {
    setPassword(target.value)
  }
  const handleLogin = async (event) => {
    event.preventDefault()
    console.log('logging in with', username, password)
    try {
      dispatch(loginUser(username, password))
      setUsername('')
      setPassword('')
      dispatch(createMessage({ ok: true, msg: `Logged in user ${username}` }))
    } catch (exception) {
      dispatch(createMessage({ ok: false, msg: 'wrong credentials' }))

    }
  }


  const matchUser = useRouteMatch('/users/:id')
  const visitedUser = matchUser
    ? allUsers.find(u => u.id === matchUser.params.id)
    : null

  const matchBlog = useRouteMatch('/blogs/:id')
  const visitedBlog = matchBlog
    ? blogs.find(b => b.id === matchBlog.params.id)
    : null

  if (!user) {
    return (
      <Login handleLogin={handleLogin} handleUsername={handleUsername}
        handlePassword={handlePassword} username={username} password={password} />
    )
  }

  return (
    <div>
      <Message />
      <div>
        <Menu />
        <div style={{ padding: '10px 10px'}}>
          <Header user={user} />
          <Switch>
            <Route path='/users/:id'>
              <User user={visitedUser} />
            </Route>
            <Route path='/blogs/:id'>
              <BlogInfo blog={visitedBlog} />
            </Route>
            <Route path='/create'>
              <BlogForm />
            </Route>
            <Route path='/users'>
              <UserList users={allUsers} />
            </Route>
            <Route path='/'>
              <BlogList blogs={sortedByLikes} />
            </Route>
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default App