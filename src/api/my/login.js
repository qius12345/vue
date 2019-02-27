import axios from '../config.js'
//登录
//chat_id极光推送的账号唯一标识
export function checkLogin(telephone,password,chat_id){
    const url="api/member/login"
    const data = {
        telephone:telephone,
        password:password,
        chat_id:chat_id
    }
    
    return axios.post(url,data)
    
}