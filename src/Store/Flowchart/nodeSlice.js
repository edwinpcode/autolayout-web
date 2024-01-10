import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: "",
  idForm: "",
  data: {},
  type: "",
}

export const nodeSlice = createSlice({
  name: "node",
  initialState,
  reducers: {
    setNode: (state, action) => {
      state.id = action.payload.id
      state.data = action.payload.data
      state.type = action.payload.type
    },
    setNodeId: (state, action) => {
      state.idForm = action.payload
    },
    resetNode: (state, action) => {
      state = initialState
    },
  },
})

export const { setNode, resetNode, setNodeId } = nodeSlice.actions

export const nodeReducer = nodeSlice.reducer
