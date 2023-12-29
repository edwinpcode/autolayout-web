import axios from "axios"
import { useQuery } from "react-query"
import APIClient, { formDataConfig } from "./APIClient"

export const SetActiveGroup = async ({ userId, moduleId, roleId }) => {
  // return process.env.REACT_APP_ENV === 'LOCAL'
  // ? `await axios('./Data/User/response.json').then((res) => res.data)`
  // :
  return await APIClient.post("/user", { userId, moduleId, roleId })
}

export const GetUserById = async ({ userId }) => {
  return await APIClient.post("/user", { userId })
}

export const updatePhoto = async (payload) => {
  return await APIClient.post("uploadphotoprofile", payload, formDataConfig)
}

export const userStatus = async ({ userid, presensiType }) => {
  return await APIClient.post("/presensi", { userid, presensiType })
}
