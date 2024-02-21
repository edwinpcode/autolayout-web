import { createSlice } from "@reduxjs/toolkit"

const initialState = []

const tabSlice = createSlice({
  name: "tab",
  initialState,
  reducers: {
    setTab: (state, action) => {
      return action.payload
    },
  },
})

export const { setTab } = tabSlice.actions

const tabReducers = tabSlice.reducer

export default tabReducers
