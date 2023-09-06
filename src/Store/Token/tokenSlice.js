import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const tokenSlice = createSlice({
  initialState,
  name: 'token',
  reducers: {
    setToken: (state, action) => {
      return action.payload
    },
  },
})

export const { setToken } = tokenSlice.actions

export const tokenReducer = tokenSlice.reducer
