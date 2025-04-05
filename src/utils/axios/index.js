// 二次封装Axios
import axios from 'axios';

// 创建 Axios 实例
const http = axios.create({
  baseURL: '/api', // 根据代理配置自动映射到 http://localhost:3000
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
http.interceptors.request.use(
  (config) => {
    // 可在此添加 Token 等全局请求头
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
http.interceptors.response.use(
  (response) => response.data, // 直接返回数据部分
  (error) => {
    // 统一错误处理
    const message = error.response?.data?.error || '请求失败';
    return Promise.reject(message);
  }
);

export default http;