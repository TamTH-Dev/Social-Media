import { createContext, useReducer } from 'react'

import AuthReducer from './AuthReducer'

const INITIAL_STATE = {
  user: null,
  isFetching: false,
  error: false,
}

export const AuthContext = createContext(INITIAL_STATE)

export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
  const user = state.user || JSON.parse(localStorage.getItem('social_user'))
  return (
    <AuthContext.Provider
      value={{
        user,
        isFetching: state.isFetching,
        error: state.error,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
