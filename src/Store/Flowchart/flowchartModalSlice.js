import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  id: "",
  data: [],
}

export const flowchartModalSlice = createSlice({
  name: "flowchartModal",
  initialState,
  reducers: {
    setflowchartModalId: (state, action) => {
      state.id = action.payload
    },
    setflowchartModalData: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { setflowchartModalId, setflowchartModalData } =
  flowchartModalSlice.actions

export const flowchartModalReducer = flowchartModalSlice.reducer
