import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  panel: [],
  action: [],
  lastPayload: {},
}

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormPanel: (state, action) => {
      state.panel = action.payload
    },
    setFormAction: (state, action) => {
      state.action = action.payload
    },
    setFormLastPayload: (state, action) => {
      state.lastPayload = action.payload
    },
  },
})

export const { setFormPanel, setFormAction, setFormLastPayload } =
  formSlice.actions

export const formReducer = formSlice.reducer
