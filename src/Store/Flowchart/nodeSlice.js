import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  data: {},
  type: '',
}

export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    setNode: (state, action) => {
      state.id = action.payload.id;
      state.data = action.payload.data;
      state.type = action.payload.type;
    },
    resetNode: (state, action) => {
      state =  initialState;
    },
  },
})

export const { setNode, resetNode } = nodeSlice.actions

export const nodeReducer = nodeSlice.reducer
