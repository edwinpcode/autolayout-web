import axios from "axios"
import memoizedRefreshToken from "./RefreshToken"

export const APIPublic = axios.create({
  baseURL: process.env.REACT_APP_API_END_POINT,
  headers: {
    Accept: "application/json",
    "Access-Control-Allow-Origin": "*",
  },
})

const APIClient = axios

APIClient.defaults.baseURL = process.env.REACT_APP_API_END_POINT

APIClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("accessToken")
    const userId = localStorage.getItem("userId")
    config.headers["Access-Control-Allow-Origin"] = "*"
    config.headers["Accept"] = "application/json"
    config.headers["Content-Type"] = "application/json;charset=UTF-8"
    if (accessToken) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${accessToken}`,
        user: `${userId}`,
      }
    }

    return config
  },
  (error) => Promise.reject(error),
)

APIClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error?.config

    if (error?.response?.status === 401 && !config?.sent) {
      config.sent = true

      const result = await memoizedRefreshToken()
      if (result?.accessToken) {
        config.headers = {
          ...config.headers,
          authorization: `Bearer ${result?.accessToken}`,
        }
      }

      return APIClient(config)
    }
    return Promise.reject(error)
  },
)

export default APIClient
