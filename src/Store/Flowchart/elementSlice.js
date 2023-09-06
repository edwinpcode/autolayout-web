import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    id: '',
    // for node data
    data: {}, 
    // for node / edge type
    type: '', 
    // for edge data
    label: '',
    markerStart: '', // marker start type
    markerEnd: '', // marker end type
    markerOrient: '', // marker start / end orient
    animated: false,
}

export const elementSlice = createSlice({
    name: 'element',
    initialState,
    reducers: {
      setElement: (state, action) => {
        state.id = action.payload.id;
        state.data = action.payload.data;
        state.type = action.payload.type;
        state.label = action.payload.label;
        state.markerStart = action.payload.markerStart;
        state.markerEnd = action.payload.markerEnd;
        state.markerOrient = action.payload.markerOrient;
        state.animated = action.payload.animated;
      },
      resetElement: (state, action) => {
        state = initialState;
      }
    },
  })
  
  export const { setElement, resetElement } = elementSlice.actions
  
  export const elementReducer = elementSlice.reducer