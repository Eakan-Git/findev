import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
import storage from "redux-persist/lib/storage";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { persistReducer } from "redux-persist";
import { loginApi } from "../service/auth";
import { profileApi } from '../service/profile';
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  blacklist: ["loginApi",],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware()
    .concat([loginApi.middleware])
    .concat([profileApi.middleware]),
  devTools: true,
});
setupListeners(store.dispatch);
export default store;
