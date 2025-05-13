import { configureStore } from "@reduxjs/toolkit";
import bagReducer from "./bagSlice";
const savedBag = localStorage.getItem("bagState");
const initialState = savedBag ? JSON.parse(savedBag) : { bag: { items: [] } };

export const store = configureStore({
  preloadedState: initialState,
  reducer: {
    bag: bagReducer,
  },
});

store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem("bagState", JSON.stringify({ bag: state.bag }));
});