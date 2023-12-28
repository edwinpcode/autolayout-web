import axios from "axios"
import APIClient, { APIPublic } from "./APIClient"

export const AuthLogin = async ({
  userId,
  password,
  latitude,
  longitude,
  address,
}) => {
  const param = {
    loginType: "loginauthentication",
    userId: userId,
    password: password,
    lat: `${latitude}`,
    lon: `${longitude}`,
    addr: address,
  }

  const result =
    // process.env.REACT_APP_ENV === 'LOCAL'
    // ? 'res_login'
    // :
    await APIPublic.post("/userlogin", param).then((res) => res.data)

  return result
}

export const GetAuthModule = async (userId) => {
  // return process.env.REACT_APP_ENV === 'LOCAL'
  // ? 'local'
  // :
  return await APIClient.post("/user", { userId })
}

export function AuthLogout({ userId, moduleId, groupId }) {
  const param = {
    loginType: "logoutuser",
    userid: userId,
    moduleId: moduleId,
    groupId: groupId,
    lat: "-7.745130",
    lon: "110.412620",
    addr: "jakarta",
  }
  return APIClient.post("/userlogin", param)
}

export function getMenuAccess(userid, m) {
  const param = {
    userid: userid,
    moduleId: "60",
    role: "00",
  }
  return APIClient.post("/getMenuAccess", JSON.stringify(param))
}

export function getInbox(userid, tc) {
  const param = {
    tc: "2.0",
    type: "assigned",
    userid: "0812345678",
    rangedate: "all",
  }

  return APIClient.post("/getInbox", JSON.stringify(param))
}
export function getDashboard({ userId, moduleId, groupId }) {
  const param = {
    userId: userId,
    moduleId: moduleId,
    groupId: groupId,
  }
  return APIClient.post("/dashboard/count", param)
}

export function getBoxForm(userId, level, fieldId, path) {
  const param = {
    userId: userId,
    level: level,
    fieldId: fieldId,
  }
  return APIClient.post(path, JSON.stringify(param))
}

export function changePassword(payload) {
  return APIClient.post("/changePassword", payload)
}
