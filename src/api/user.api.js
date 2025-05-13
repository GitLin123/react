import http from "../utils/axios";

// RESTful风格API路径定义
export const USER_API = {
  GET_USERS: '/user',
  CREATE_USER: '/user/sign', 
  DELETE_USER: (id) => `/user/delete/${id}`,
  GET_USER_BY_ID: (id) => `/user/${id}`,
  SEARCH_USER_BY_NAME: (username) => `/name/${username}`,
  USER_LOGIN: '/user/login',
  GET_USERIMAGES:(id) =>  `/user/images/${id}`,
  ADD_USERIMAGES: '/user/add_image'
}

/**
 * 获取所有用户信息
 * @returns {Promise<Array<{id: number, username: string, email: string}>>} 用户列表（不含敏感信息）
 */
export const getUsers = () => {
  return http.get(USER_API.GET_USERS);
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
  return http.post(USER_API.CREATE_USER, userData);
};

/**
 * 删除指定ID的用户
 * @param {number} id - 用户ID
 * @returns {Promise<{status: string, deletedId: number}>} 删除结果
 */
export const deleteUser = (id) => {
  return http.delete(USER_API.DELETE_USER(id));
}

/**
 * 根据ID查询用户详情
 * @param {number} id - 用户ID
 * @returns {Promise<object>} 用户详细信息
 */
export const getUserById = (id) => {
  return http.get(USER_API.GET_USER_BY_ID(id));
}

/**
 * 根据用户名搜索用户
 * @param {string} username - 用户名（支持模糊搜索）
 * @returns {Promise<object>} 匹配的用户列表
 */
export const searchUserByName = (username) => {
  return http.get(USER_API.SEARCH_USER_BY_NAME(username));
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
    return http.post(USER_API.USER_LOGIN,userLoginInfo)
}

/**
 * 获取用户图库
 * @returns {Promise<Array<{id: number, imageUrl: string}>>} 用户图库列表
*/

export const getUserImage = (id) => {
  return http.get(USER_API.GET_USERIMAGES(id));
}

// data: { userId, imageUrl }
/**
 * 添加用户图库
 * @param {Object} data - 用户图库信息
 * @param {number} data.userId - 用户ID
 * @param {string} data.imageUrl - 图片URL
 * @returns {Promise<{status: string}>} 添加结果
 */
export const addUserImage = (data) => {
  return http.post(USER_API.ADD_USERIMAGES,data);
}