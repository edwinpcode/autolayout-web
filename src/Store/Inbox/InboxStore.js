import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  param: [
    {
      id: "",
      value: "",
    },
  ],
  data: {},
  filter: [],
}
const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    setInboxParam: (state, action) => {
      state.param = action.payload
    },
    setInboxData: (state, action) => {
      state.data = action.payload
    },
    setInboxFilter: (state, action) => {
      state.filter = action.payload
    },
  },
})

export const { setInboxParam, setInboxData, setInboxFilter } =
  inboxSlice.actions

export const inboxReducer = inboxSlice.reducer
