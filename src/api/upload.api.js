import http from "../utils/axios";

// RESTful风格API路径定义
export const UPLOAD_API = {
    UPLOAD_FILE: '/upload/file', // 上传文件
}


export const uploadFile = (data) => http.post(UPLOAD_API.UPLOAD_FILE, data);  