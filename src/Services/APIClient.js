import axios from 'axios'
import RefreshToken from './RefreshToken'

const headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  Accept: 'application/json',
}

const token = localStorage.getItem('accessToken')
const userId = localStorage.getItem('userId')

// if (token) {
//   Object.assign(headers, {
//     Authorization: `Bearer ${token}`,
//     user: `${userId}`,
//   })
// }

const APIClient = axios.create({
  baseURL: 'https://los-bsg.clofaas.com/services',
  headers: headers,
})

APIClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('accessToken')
    const userId = localStorage.getItem('userId')

    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
        user: `${userId}`,
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

APIClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true

      const result = RefreshToken()

      if (result?.accessToken) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${result?.accessToken}`,
        }
      }

      return axios(config)
    }
    return Promise.reject(error)
  }
)
export default APIClient
