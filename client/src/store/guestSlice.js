import { createSlice } from "@reduxjs/toolkit";

const guestSlice = createSlice({
  name: "guest",
  initialState: {
    isGuest: false,
  },
  reducers: {
    setGuest: (state, action) => {
      state.isGuest = action.payload;
    },
  },
});

export const { setGuest } = guestSlice.actions;
export default guestSlice.reducer;
