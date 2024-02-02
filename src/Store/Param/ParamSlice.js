import { createSlice } from "@reduxjs/toolkit"

const initialState = [
  {
    id: "",
    value: "",
  },
]

export const paramSlice = createSlice({
  name: "param",
  initialState,
  reducers: {
    setParam: (state, action) => {
      return action.payload
    },
  },
})

export const { setParam } = paramSlice.actions

export const paramReducer = paramSlice.reducer
