import apiService from './helpers/apiService'
import { LoginStart, LoginSuccess, LoginFailure } from './context/AuthActions'

export const loginCall = async (userCrendential, dispatch) => {
  dispatch(LoginStart())
  try {
    const res = await apiService.post('auth/login', userCrendential)
    dispatch(LoginSuccess(res.data.user))
    localStorage.setItem('social_user', JSON.stringify(res.data.user))
  } catch (error) {
    dispatch(LoginFailure(error))
  }
}
