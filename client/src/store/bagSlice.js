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
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item._id === id);
      if (item) {
        item.quantity = quantity < 1 ? 1 : quantity;
      }
    },
  },
});

export const { addToBag, removeFromBag, clearBag, updateQuantity } = bagSlice.actions;
export default bagSlice.reducer;
