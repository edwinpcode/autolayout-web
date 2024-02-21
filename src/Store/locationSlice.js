import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  address: "",
  latitude: 0,
  longitude: 0,
}

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload
    },
    setLatitude: (state, action) => {
      state.latitude = action.payload
    },
    setLongitude: (state, action) => {
      state.longitude = action.payload
    },
  },
})

export const { setAddress, setLatitude, setLongitude } = locationSlice.actions

const locationReducers = locationSlice.reducer

export default locationReducers
