import { createContext, useReducer } from 'react'

import AuthReducer from './AuthReducer'

const INITIAL_STATE = {
  user: {
    _id: '615b0d0aa02e4f634b680730',
    username: 'demo',
    email: 'demo@gmail.com',
    profilePicture: 'person/1.jpeg',
    coverPicture: '',
    isAdmin: false,
    // followers: ['615b1069a34ea4c6e1a1f86f'],
    // followings: ['615b1069a34ea4c6e1a1f86f'],
    followers: [],
    followings: [],
  },
  isFetching: false,
  error: false,
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
