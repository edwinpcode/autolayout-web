import { createSlice } from "@reduxjs/toolkit"

const initialState = false

const devSlice = createSlice({
  name: "devMode",
  initialState,
  reducers: {
    setDevMode: (state, action) => {
      return action.payload
    },
  },
})

export const { setDevMode } = devSlice.actions

const devReducer = devSlice.reducer

export default devReducer
