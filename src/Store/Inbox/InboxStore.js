import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  param: [
    {
      id: "",
      value: "",
    },
  ],
}
const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    setInbox: (state, action) => {
      state.param = action.payload
    },
  },
})

export const { setInbox } = inboxSlice.actions

export const inboxReducer = inboxSlice.reducer
