import axios from 'axios'
import APIClient from './APIClient'

export const getAllStructure = async (payload) => {
  return process.env.REACT_APP_ENV === 'LOCAL'
    ? await axios('./Data/Table/Structure/response.json')
    : await APIClient.post('/liststructure', payload)
}

export const getGridStructure = async (payload) => {
  return await APIClient.post('/getstructuregrid', payload)
}

export const getFieldByGrid = async (payload) => {
  return await APIClient.post('/getFieldByGridId', payload)
}
