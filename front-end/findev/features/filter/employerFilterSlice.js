import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword: "",
    location: "",
    destination: {
        min: 0,
        max: 100,
    },
    category: "",
    companySize: "",
    foundationDate: {
        min: 1900,
        max: 2028,
    },
    sort: "",
    perPage: {
        start: 0,
        end: 0,
    },
    clearAllFlag: false,
};

export const employerFilterSlice = createSlice({
    name: "employer-filter",
    initialState,
    reducers: {
        addKeyword: (state, { payload }) => {
            state.keyword = payload;
        },
        addLocation: (state, { payload }) => {
            state.location = payload;
        },
        addSort: (state, { payload }) => {
            state.sort = payload;
        },
        addPerPage: (state, { payload }) => {
            state.perPage.start = payload.start;
            state.perPage.end = payload.end;
        },
        setClearAllFlag: (state, action) => { 
            state.clearAllFlag = action.payload;
        },

    },
});

export const {
    addKeyword,
    addLocation,
    addSort,
    addPerPage,
    setClearAllFlag
} = employerFilterSlice.actions;
export default employerFilterSlice.reducer;
