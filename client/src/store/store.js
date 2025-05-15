import { configureStore } from "@reduxjs/toolkit";
import bagReducer from "./bagSlice";
import authReducer from "./authSlice";

// Загрузка збережених станів
const savedBag = localStorage.getItem("bagState");
const savedAuth = localStorage.getItem("authState");

const initialState = {
  bag: savedBag ? JSON.parse(savedBag).bag : { items: [] },
  auth: savedAuth ? JSON.parse(savedAuth).auth : { user: null },
};

export const store = configureStore({
  reducer: {
    bag: bagReducer,
    auth: authReducer,
  },
  preloadedState: initialState,
});

// Слухаємо зміну стану і зберігаємо
store.subscribe(() => {
  const state = store.getState();

  localStorage.setItem("bagState", JSON.stringify({ bag: state.bag }));
  localStorage.setItem("authState", JSON.stringify({ auth: state.auth }));
});
