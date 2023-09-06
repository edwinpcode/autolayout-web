import APIClient from './APIClient'

export const getListData = async (payload) => {
  return await APIClient.post('/listdata', payload)
}

export const getGridData = async (payload) => {
  return await APIClient.post('/getdatagrid', payload)
}
