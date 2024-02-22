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
  autoOpenFirstItem: "0",
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
    setAutoOpenFirstItem: (state, action) => {
      state.autoOpenFirstItem = action.payload
    },
    resetInbox: () => {
      return initialState
    },
  },
})

export const {
  setInboxParam,
  setInboxData,
  setInboxFilter,
  setAutoOpenFirstItem,
  resetInbox,
} = inboxSlice.actions

export const inboxReducer = inboxSlice.reducer
