import axios from 'axios'
import APIClient from './APIClient'

export const retrieveData = (param) => {
  return APIClient.post('/retrivedata', JSON.stringify(param))
}

export const saveData = (actionId, param, url) => {
  param = {
    formname: 'IDCD1001',
    apregno: '000061002022',
    tc: '4.0',
    userid: 'AO_100',
    status: '1',
    panel: param,
    actionId: actionId,
  }

  if (url === 'updatestatus') {
    delete param.panel
    delete param.formname
    param.regno = param.apregno
    delete param.apregno
  } else {
    delete param.status
  }

  return APIClient.post('/' + url, JSON.stringify(param))
}

export const getTab = async ({ menuId, moduleId, param }) => {
  const result =
    process.env.REACT_APP_ENV === 'LOCAL'
      ? ''
      : await APIClient.post('/listtab', { menuId, moduleId, param })

  return result
}

// haecal
export const getField = async (payload) => {
  const result =
    process.env.REACT_APP_ENV === 'LOCAL'
      ? ''
      : await APIClient.post('/getfieldbyformname', payload)
  return result
}

export const getFieldBySub = async (payload) => {
  return await APIClient.post('/getfieldbysub', payload)
}

export const saveForm = async (endpoint, data) => {
  return await APIClient.post(endpoint, data)
}

export const submitForm = async (payload) => {
  return await APIClient.post('/updatestatus', payload)
}

export const getTableForm = async (payload) => {
  // note
  return await axios(
    'http://localhost:3000/Data/AutoLayout/Table/response.json'
  )
}

export const getReference = async (payload) => {
  const result =
    process.env.REACT_APP_ENV === 'LOCAL'
      ? ''
      : await APIClient.post('/getreference', payload)

  return result
}

export const uploadFile = async (formData) => {
  return await APIClient.post('/uploadfiles', formData)
}
export const saveDataAndUpload = async (formData) => {
  return await APIClient.post('/saveDataAndUpload', formData)
}

export const deleteData = async (payload) => {
  return await APIClient.post('/delete', payload)
}

export const getViewDoc = async (payload) => {
  return await APIClient.post('/viewdoc', payload)
}

export const getCancelModal = async (payload) => {
  return await APIClient.post('/canceldata', payload)
}

export const updateStatus = async (payload) => {
  return await APIClient.post('/updatestatus', payload)
}

export const getDataActionWithButton = async (path, payload) => {
  return await APIClient.post(path, payload)
}

export const axiosPost = async (endpoint, payload) => {
  try {
    return await APIClient.post(endpoint, payload)
  } catch (error) {
    window.Swal.fire(
      '',
      'Mohon maaf, sedang terjadi kendala koneksi pada sistem, silahkan coba kembali secara berkala',
      'error'
    )
  }
}
