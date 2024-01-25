import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  data: [
    {
      menuId: "",
      trackId: "",
      menuDesc: "",
      icon: "fal fa-id-card",
      path: "/",
      child: [
        {
          menuId: "",
          trackId: "",
          menuDesc: "",
          icon: "fal fa-id-card",
          path: "/",
        },
      ],
    },
  ],
  searchMenu: "",
}

export const menuSidebarSlice = createSlice({
  name: "menuSidebar",
  initialState,
  reducers: {
    setMenuSidebarSlice: (state, action) => {
      state.data = action.payload
    },
    setSearchMenu: (state, action) => {
      state.searchMenu = action.payload
    },
  },
})

export const { setMenuSidebarSlice, setSearchMenu } = menuSidebarSlice.actions

export const menuSideabarReducer = menuSidebarSlice.reducer
