import axios from 'axios'
import APIClient from './APIClient'

const env = 'PRODUCTION'

// Get ALL flowchart
export const getChart = async () => {
  const payload = {}
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getChart', JSON.stringify(payload))
      : await axios({
          method: 'GET',
          url: '//localhost:5000/chart',
        })
  return result
}

export const getDrilldown = async (payload) => {
  const result =
    process.env.REACT_APP_ENV === env
      ? APIClient.post('/getDrilldown', JSON.stringify(payload))
      : await axios({
          method: 'GET',
          url: '//localhost:5000/drilldown',
        })
  return result
}
