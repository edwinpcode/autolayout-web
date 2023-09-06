import axios from 'axios'
import APIClient from './APIClient'

export const getMenu = async (userId, moduleId, roleId) => {
  const result =
    process.env.REACT_APP_ENV === 'LOCAL'
      ? await axios('./Data/Menu/response.json')
      : await APIClient.post('/getmenuaccess', { userId, moduleId, roleId })
  return result
}
