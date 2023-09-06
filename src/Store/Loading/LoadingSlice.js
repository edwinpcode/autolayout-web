import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  table: false,
  field: false,
  spin: false,
}

export const loadingSlice = createSlice({
  name: 'loading',
  initialState,
  reducers: {
    setLoadingTable: (state, action) => {
      state.table = action.payload
    },
    setLoadingField: (state, action) => {
      state.field = action.payload
    },
    setLoadingSpin: (state, action) => {
      state.spin = action.payload
    },
  },
})

export const { setLoadingTable, setLoadingField, setLoadingSpin } =
  loadingSlice.actions

export const loadingReducer = loadingSlice.reducer
