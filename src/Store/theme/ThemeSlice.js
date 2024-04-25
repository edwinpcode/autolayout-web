const { createSlice } = require("@reduxjs/toolkit")

const initialState = {
  darkMode: false,
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    setDarkMode: (state, action) => {
      state.darkMode = action.payload
    },
    toggleDarkMode: (state, action) => {
      state.darkMode = !state.darkMode
    },
  },
})

export const { setDarkMode, toggleDarkMode } = themeSlice.actions

const themeReducer = themeSlice.reducer

export default themeReducer
