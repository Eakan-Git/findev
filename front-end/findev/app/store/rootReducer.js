import { combineReducers } from "@reduxjs/toolkit";
import jobSlice from "../../features/job/jobSlice";
import toggleSlice from "../../features/toggle/toggleSlice";
import filterSlice from "../../features/filter/filterSlice";
import employerSlice from "../../features/employer/employerSlice";
import employerFilterSlice from "../../features/filter/employerFilterSlice";
import candidateSlice from "../../features/candidate/candidateSlice";
import candidateFilterSlice from "../../features/filter/candidateFilterSlice";
import shopSlice from "../../features/shop/shopSlice";
import userSlice from "../../features/user/userSlice";

import { loginApi } from "../service/auth";

export default combineReducers({
  job: jobSlice,
  toggle: toggleSlice,
  filter: filterSlice,
  employer: employerSlice,
  employerFilter: employerFilterSlice,
  candidate: candidateSlice,
  candidateFilter: candidateFilterSlice,
  shop: shopSlice,
  user: userSlice,
  [loginApi.reducerPath]: loginApi.reducer,
});
