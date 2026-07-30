import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
  },
  reducers: {
    setUserCredentials: (state, action) => {

      const payload = action.payload || {};
      state.token = payload ?? null;
    },

    logout: (state) => {
      state.token = null;
    },
  },
});

export const { setUserCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
