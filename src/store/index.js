// 新版（使用Redux Toolkit）
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer
  }
});

export default store;