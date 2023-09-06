import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filtering: [],
  currentPayload: {},
  refreshGrid: false,
}

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    setFilteringList: (state, action) => {
      state.filtering = action.payload
    },
    setCurrentPayload: (state, action) => {
      state.currentPayload = action.payload
    },
    triggerRefreshGrid: (state) => {
      state.refreshGrid = !state.refreshGrid
    },
    reset: (state) => {
      return initialState
    },
  },
})

export const {
  setFilteringList,
  setCurrentPayload,
  triggerRefreshGrid,
  reset,
} = listSlice.actions

export const listReducer = listSlice.reducer
