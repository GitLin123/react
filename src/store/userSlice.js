// store/userSlice.js
import { createSlice } from '@reduxjs/toolkit';

// 安全解析localStorage
const safeParseJSON = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

const initialState = {
  data: safeParseJSON('user'),
  token: localStorage.getItem('token') || null,
  isLogin: !!localStorage.getItem('token')
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.data = action.payload;
      state.isLogin = !!action.payload;
    },
    updateToken: (state, action) => {
      state.token = action.payload;
    },
    clearUser: (state) => {
      state.data = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.isLogin = false;
    }
  }
});

export const { setUser, updateToken, clearUser } = userSlice.actions;
export default userSlice.reducer;