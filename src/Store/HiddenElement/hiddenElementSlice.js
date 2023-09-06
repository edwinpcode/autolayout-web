import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  hiddenPanel: [],
  hiddenField: [],
}

export const hiddenElementSlice = createSlice({
  name: 'hiddenElement',
  initialState,
  reducers: {
    setHiddenPanel: (state, action) => {
      state.hiddenPanel = action.payload
    },
    setHiddenField: (state, action) => {
      state.hiddenField = [...state.hiddenField, ...action.payload]
    },
    removeHiddenField: (state, action) => {
      let newHiddenField = state.hiddenField.filter(
        (fieldId) => !action.payload.includes(fieldId)
      )
      state.hiddenField = newHiddenField
    },
    resetHiddenField: (state, action) => {
      state.hiddenField = []
    },
  },
})

export const {
  setHiddenField,
  setHiddenPanel,
  removeHiddenField,
  resetHiddenField,
} = hiddenElementSlice.actions

export const hiddenElementReducer = hiddenElementSlice.reducer
