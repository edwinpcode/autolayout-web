import axios from 'axios'
import APIClient from './APIClient'

const env = 'PRODUCTION'

// Get ALL Report
export const getAllReport = async (param) => {
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getreport', JSON.stringify(param))
      : await axios({
          method: 'GET',
          url: '//localhost:5000/report',
        })
  return result
}

export const getAllReportForm = async (fieldId, level, path) => {
  const param = {
    menuId: fieldId,
    level: level,
  }
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post(path, JSON.stringify(param))
      : ''
  return result
}
