import axios from '../config.js'

export function getBindPhone(old_code,new_telephone,new_code){
    const url = "api/Member/bindnewtel"
    const data = {
        old_code:old_code,
        new_telephone:new_telephone,
        new_code:new_code,
        // token:sessionStorage.getItem("token")
    }
    
    return axios.post(url,data)
}