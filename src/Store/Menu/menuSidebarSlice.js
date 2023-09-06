import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: [
    {
      menuId: '',
      trackId: '',
      menuDesc: '',
      icon: 'fal fa-id-card',
      path: '/',
      child: [
        {
          menuId: '',
          trackId: '',
          menuDesc: '',
          icon: 'fal fa-id-card',
          path: '/',
        },
      ],
    },
  ],
}

export const menuSidebarSlice = createSlice({
  name: 'menuSidebar',
  initialState,
  reducers: {
    setMenuSidebarSlice: (state, action) => {
      state.data = action.payload
    },
  },
})

export const { setMenuSidebarSlice } = menuSidebarSlice.actions

export const menuSideabarReducer = menuSidebarSlice.reducer
