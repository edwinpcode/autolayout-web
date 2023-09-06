import { createSlice } from '@reduxjs/toolkit'
import jwtDecode from 'jwt-decode'

let userId = ''
const token = localStorage.getItem('token') || null

if (token) {
  try {
    const decodedToken = jwtDecode(token)
    userId = decodedToken.unique_name || ''
  } catch (error) {
    console.log(error.message)
  }
}

const initialState = {
  id: userId,
  activeModule: {
    id: '',
    desc: '',
  },
  activeRole: {
    id: '',
    desc: '',
  },
  data: {},
  photoProfile: '',
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { userId, activeModule, activeRole } = action.payload
      state.id = userId
      state.activeModule.id = activeModule.id
      state.activeModule.desc = activeModule.desc
      state.activeRole.id = activeRole.id
      state.activeRole.desc = activeRole.desc
    },
    setUserId: (state, action) => {
      state.id = action.payload
    },
    setUserData: (state, { payload }) => {
      state.data = payload
    },
    setPhotoProfile: (state, action) => {
      state.photoProfile = action.payload
    },
  },
})

export const { setUser, setUserData, setUserId, setPhotoProfile } =
  userSlice.actions

export const userReducer = userSlice.reducer
