import axios from 'axios'

const APIClientMobile = () => {
  const headers = {
    'Content-Type': 'application/json;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    Accept: 'application/json',
  }

  const token = localStorage.getItem('accessToken')
  if (token) {
    Object.assign(headers, {
      Authorization: `Bearer ${token}`,
    })
  }

  const res = axios.create({
    baseURL:
      process.env.REACT_APP_ENV === 'LOCAL'
        ? 'http://localhost:3000/Data'
        : process.env.REACT_APP_API_END_POINT_MOBILE,
    headers: headers,
  })
  return res
}

export default APIClientMobile
