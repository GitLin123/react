import http from "../utils/axios";

// RESTful风格API路径定义
export const API = {
  GET_USERS: '/users',
  CREATE_USER: '/sign', 
  DELETE_USER: (id) => `/delete/${id}`,
  GET_USER_BY_ID: (id) => `/users/${id}`,
  SEARCH_USER_BY_NAME: (username) => `/${username}`,
  USER_LOGIN: '/login'
}

/**
 * 获取所有用户信息
 * @returns {Promise<Array<{id: number, username: string, email: string}>>} 用户列表（不含敏感信息）
 */
export const getUsers = () => {
  return http.get(API.GET_USERS);
}

/**
 * 创建用户（注册接口）
 * @param {Object} userData - 用户注册信息
 * @param {string} userData.username - 用户名（需唯一）
 * @param {string} userData.email - 邮箱（需唯一）
 * @param {string} userData.password - 密码（至少6位）
 * @returns {Promise<{id: number, username: string, email: string}>} 新用户数据（不含密码）
 */
export const createUser = (userData) => {
  return http.post(API.CREATE_USER, userData);
};

/**
 * 删除指定ID的用户
 * @param {number} id - 用户ID
 * @returns {Promise<{status: string, deletedId: number}>} 删除结果
 */
export const deleteUser = (id) => {
  return http.delete(API.DELETE_USER(id));
}

/**
 * 根据ID查询用户详情
 * @param {number} id - 用户ID
 * @returns {Promise<object>} 用户详细信息
 */
export const getUserById = (id) => {
  return http.get(API.GET_USER_BY_ID(id));
}

/**
 * 根据用户名搜索用户
 * @param {string} username - 用户名（支持模糊搜索）
 * @returns {Promise<object>} 匹配的用户列表
 */
export const searchUserByName = (username) => {
  return http.get(API.SEARCH_USER_BY_NAME(username));
}

/**
 * 用户登录
 * 
 * @param {Object} userLoginInfo -用户登录信息
 * @param {string} userLoginInfo.username -用户登录账号
 * @param {string} userLoginInfo.password -用户登录密码
 * @returns {JSON<{token: string, user: object, expireIn: number}>} -token 用户信息 过期时间
 * */

export const userLogin = (userLoginInfo) => {
    return http.post(API.USER_LOGIN,userLoginInfo)
}