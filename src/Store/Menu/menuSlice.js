import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  activeMenuId: "",
  activeTrackId: "",
  activeMenuDesc: "",
  activeTabId: "",
  path: "",
}

export const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuSlice: (state, action) => {
      state.activeMenuId = action.payload.menuId
      state.activeTrackId = action.payload.trackId
      state.activeMenuDesc = action.payload.menuDesc
      state.path = action.payload.path
    },
    setTabId: (state, action) => {
      state.activeTabId = action.payload
    },
  },
})

export const { setMenuSlice, setTabId } = menuSlice.actions

export const menuReducer = menuSlice.reducer
