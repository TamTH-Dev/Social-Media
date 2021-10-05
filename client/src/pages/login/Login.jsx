import { useContext, useRef } from 'react'
import { CircularProgress } from '@material-ui/core'

import { loginCall } from '../../apiCalls'
import { AuthContext } from '../../context/AuthContext'

import './login.css'

const Login = () => {
  const email = useRef()
  const password = useRef()
  const { isFetching, dispatch } = useContext(AuthContext)

  const handleSubmit = (e) => {
    e.preventDefault()
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    )
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
              ref={email}
              required
              placeholder="Email"
              type="email"
              className="loginInput"
            />
            <input
              ref={password}
              required
              minLength="6"
              placeholder="Password"
              type="password"
              className="loginInput"
            />
            <button className="loginButton" disabled={isFetching}>
              {isFetching ? (
                <CircularProgress color="inherit" size="20px" />
              ) : (
                'Log In'
              )}
            </button>
            <span className="loginForgot">Forgot Password?</span>
            <button className="loginRegisterButton">
              Create a new account
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
