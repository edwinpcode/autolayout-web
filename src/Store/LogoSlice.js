import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  showText: true,
}

const LogoSlice = createSlice({
  name: "logo",
  initialState,
  reducers: {
    setShowText: (state, action) => {
      state.showText = action.payload
    },
  },
})

export const { setShowText } = LogoSlice.actions

const LogoReducer = LogoSlice.reducer

export default LogoReducer
