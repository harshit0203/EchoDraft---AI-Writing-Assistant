import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  default_tone: null,
  default_platform: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.default_tone = action.payload.default_tone;
      state.default_platform = action.payload.default_platform;
    },
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.default_tone = null;
      state.default_platform = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
