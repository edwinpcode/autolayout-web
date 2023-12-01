import APIClient from './APIClient'

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

export default RefreshToken
