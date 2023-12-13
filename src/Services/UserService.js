import axios from "axios"
import { useQuery } from "react-query"
import APIClient from "./APIClient"

export const SetActiveGroup = async ({ userId, moduleId, roleId }) => {
  // return process.env.REACT_APP_ENV === 'LOCAL'
  // ? `await axios('./Data/User/response.json').then((res) => res.data)`
  // :
  return await APIClient.post("/user", { userId, moduleId, roleId })
}

export const GetUserById = async ({ userId }) => {
  return await APIClient.post("/user", { userId })
}
