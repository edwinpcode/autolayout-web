import axios from 'axios'
import APIClient from './APIClient'

export const getMenu = async (userId, moduleId, roleId) => {
  // const result = await APIClient.post('/getmenuaccess', {
  //   userId,
  //   moduleId,
  //   roleId,
  // })
  const result =
    process.env.REACT_APP_ENV === 'LOCAL'
      ? await axios.get('http://localhost:3002/menu')
      : await APIClient.post('/getmenuaccess', { userId, moduleId, roleId })
  return result
}
