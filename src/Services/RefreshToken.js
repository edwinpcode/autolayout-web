import APIClient from './APIClient'
import memoize from 'memoize'

const RefreshToken = async () => {
  const accessToken = localStorage.getItem('accessToken')
  const refreshToken = localStorage.getItem('refreshToken')
  const res = await APIClient.post('/refresh-token', {
    accessToken,
    refreshToken,
  })
  localStorage.setItem('accessToken', res.data.accessToken)
  localStorage.setItem('refreshToken', res.data.refreshToken)
  localStorage.setItem('expiredIn', res.data.expiredIn)
}

const maxAge = 10000

const memoizedRefreshToken = memoize(RefreshToken, { maxAge })

export default memoizedRefreshToken
