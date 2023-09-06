import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [],
}

export const dropdownSlice = createSlice({
  name: 'dropdown',
  initialState,
  reducers: {
    setDropdown: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { setDropdown } = dropdownSlice.actions

export const dropdownReducer = dropdownSlice.reducer
