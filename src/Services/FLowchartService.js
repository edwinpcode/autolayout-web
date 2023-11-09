import axios from 'axios'
import APIClient from './APIClient'
import APILocal from './APILocal'

const env = 'PRODUCTION'

// Get ALL flowchart
export const getFlowchart = async () => {
  //   const result = APIClient.post('/retrieveDataBP', JSON.stringify(payload))
  const payload = {}
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/retrieveDataBP', payload)
      : await APILocal.get('/flowchart')
  return result
}

// get 1 flowchart
export const getFlowchartDetail = async (data) => {
  const payload = {
    flowchart_id: data.id,
  }
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getFlowchartByID', payload)
      : APILocal.get(`/flowchart/${data.id}`)
  return result
}

// insert flowchart
export const postFlowchart = async (payload) => {
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/saveflowchartnew', payload)
      : APILocal.post('/flowchart', payload)
  return result
}

// update flowchart
export const updateFlowchart = async (payload) => {
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/updateflowchart', payload)
      : await APILocal.put(`/flownchart/${payload.id}`, payload)
  return result
}

// delete flowchart
export const deleteFlowchart = async (payload) => {
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/deleteFlowchart', payload)
      : await APILocal.delete(`/flowchart/${payload.id}`)
  return result
}

export const getFlowchartModal = async ({ code }) => {
  const payload = {
    referenceName: 'getProperty',
    param: [
      {
        code,
      },
    ],
  }
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getPropertyFlowchart', payload)
      : code === 'node'
      ? APILocal.get('/flowchartModalNode')
      : APILocal.get('/flowchartModalEdge')
  return result
}

export const getFlowchartToolbox = async () => {
  const payload = {}
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getToolboxFC', payload)
      : APILocal.get('/flowchartToolbox')
  return result
}

export const getNodeDropdown = async () => {
  const payload = {}
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getNodeDropdownFC', payload)
      : APILocal.get('/nodeDropdown')
  return result
}

export const getEdgeDropdown = async () => {
  const payload = {}
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getEdgeDropdownFC', payload)
      : APILocal.get('/edgeDropdown')
  return result
}
