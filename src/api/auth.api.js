import http from "../utils/axios"

export const AUTH_API = {
    VERIFY_TOKEN: '/token/verify',
    USER_INFO_TOKEN: '/token/info'
}

/**
 * @returns {Object<message:string, user:object, success:boolean>}
*/

export const validateToken = () => {
    return http.get(AUTH_API.VERIFY_TOKEN)
}

/**
 * @returns {Object<success:boolean, user:object>}
*/
export const getUserInfoByToken = () => {
    return http.get(AUTH_API.USER_INFO_TOKEN)
}