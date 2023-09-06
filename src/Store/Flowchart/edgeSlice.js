import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  id: '',
  label: '',
  type: '',
  source: '',
  target: '',
  markerEnd: {}, // marker end type and orient
  markerStart: {}, // marker start type and orient
  animated: false,
}

export const edgeSlice = createSlice({
  name: 'edge',
  initialState,
  reducers: {
    setEdge: (state, action) => {
      state.id = action.payload.id;
      state.source = action.payload.source;
      state.target = action.payload.target;
      state.label = action.payload.label;
      state.type = action.payload.type;
      state.markerStart = action.payload.markerStart
      state.markerEnd = action.payload.markerEnd;
      state.animated = action.payload.animated;
    },
    resetEdge: (state, action) => {
      state = initialState;
    }
  },
})

export const { setEdge, resetEdge } = edgeSlice.actions

export const edgeReducer = edgeSlice.reducer
