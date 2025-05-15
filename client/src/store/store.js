import { configureStore } from "@reduxjs/toolkit";
import bagReducer from "./bagSlice";
import authReducer from "./authSlice";
import guestReducer from "./guestSlice";

// Загрузка збережених станів
const savedBag = localStorage.getItem("bagState");
const savedAuth = localStorage.getItem("authState");
const savedGuest = localStorage.getItem("guestState");

const initialState = {
  bag: savedBag ? JSON.parse(savedBag).bag : { items: [] },
  auth: savedAuth ? JSON.parse(savedAuth).auth : { user: null },
  guest: savedGuest ? JSON.parse(savedGuest).guest : { isGuest: false },
};

export const store = configureStore({
  reducer: {
    bag: bagReducer,
    auth: authReducer,
    guest: guestReducer,
  },
  preloadedState: initialState,
});

// Слухаємо зміну стану і зберігаємо
store.subscribe(() => {
  const state = store.getState();

  localStorage.setItem("bagState", JSON.stringify({ bag: state.bag }));
  localStorage.setItem("authState", JSON.stringify({ auth: state.auth }));
  localStorage.setItem("guestState", JSON.stringify({ guest: state.guest }));
});
