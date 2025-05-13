import { createSlice } from "@reduxjs/toolkit";

const bagSlice = createSlice({
  name: "bag",
  initialState: {
    items: [],
  },
  reducers: {
    addToBag: (state, action) => {
      const existing = state.items.find(item => item._id === action.payload._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
    },
    removeFromBag: (state, action) => {
      state.items = state.items.filter(item => item._id !== action.payload);
    },
    clearBag: (state) => {
      state.items = [];
    },
  },
});

export const { addToBag, removeFromBag, clearBag } = bagSlice.actions;
export default bagSlice.reducer;
