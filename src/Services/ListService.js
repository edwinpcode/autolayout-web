import APIClient from './APIClient'
import axios from 'axios'

export const getListData = async (payload) => {
  // return await APIClient.post('/listdata', payload)
  if (process.env.REACT_APP_ENV === 'LOCAL')
    return await axios.get('http://localhost:3002/listdata')
  return await APIClient.post('/listdata', payload)
}

export const getGridData = async (payload) => {
  return await APIClient.post('/getdatagrid', payload)
}
