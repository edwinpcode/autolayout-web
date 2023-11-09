import axios from 'axios'

const headers = {
  'Content-Type': 'application/json;charset=UTF-8',
  'Access-Control-Allow-Origin': '*',
  Accept: 'application/json',
}

const APILocal = axios.create({
  baseURL: 'http://localhost:3002',
  headers: headers,
})

export default APILocal
