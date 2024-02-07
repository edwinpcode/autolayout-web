import { createSlice } from "@reduxjs/toolkit"

const initialState = []

const moduleSlice = createSlice({
  name: "module",
  initialState,
  reducers: {
    setModule: (state, action) => {
      return action.payload
    },
  },
})

export const { setModule } = moduleSlice.actions

const moduleReducer = moduleSlice.reducer

export default moduleReducer
