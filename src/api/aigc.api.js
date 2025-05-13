import http from "../utils/axios"

export const AI_API = {
    AIGC_PICTURE:'/ai/generate'
}

export const generate = (data) => http.post(AI_API.AIGC_PICTURE,data,{timeout:15000})