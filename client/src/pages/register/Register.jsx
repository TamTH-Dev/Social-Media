import { useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { CircularProgress } from '@material-ui/core'

import apiService from '../../helpers/apiService'

import './register.css'

const Register = () => {
  const username = useRef()
  const email = useRef()
  const password = useRef()
  const passwordAgain = useRef()
  const history = useHistory()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (passwordAgain.current.value !== password.current.value) {
      passwordAgain.current.setCustomValidity('Password does not match')
      return
    }
    const user = {
      username: username.current.value,
      email: email.current.value,
      password: password.current.value,
    }
    try {
      await apiService.post('auth/register', user)
      history.push('/login')
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="login">
      <div className="loginWrapper">
        <div className="loginLeft">
          <h3 className="loginLogo">Social</h3>
          <span className="loginDesc">
            Connect with friends and the world around you on Social
          </span>
        </div>
        <div className="loginRight">
          <form className="loginBox" onSubmit={handleSubmit}>
            <input
              required
              ref={username}
              type="text"
              placeholder="Username"
              className="loginInput"
            />
            <input
              required
              ref={email}
              type="email"
              placeholder="Email"
              className="loginInput"
            />
            <input
              required
              ref={password}
              type="password"
              placeholder="Password"
              className="loginInput"
              minLength="6"
            />
            <input
              required
              ref={passwordAgain}
              type="password"
              placeholder="Password Again"
              className="loginInput"
              minLength="6"
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                'Sign Up'
              )}
            </button>
            <button className="loginRegisterButton">Log into Account</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
