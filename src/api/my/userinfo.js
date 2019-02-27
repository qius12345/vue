import axios from "../config.js"

//用户信息
export function getUserInfo(){
    const url="api/Member/info"
    const data = {
    }
    return axios.post(url,data)
}

//验证码
export function getMessageCode(telephone,codetype){
    const url = "api/Base/getMessageCode"
    const data = {
        telephone:telephone,
        codetype:codetype,
    }
    
    return axios.post(url,data)
}
// 二维码
export function getQrCode(h5Url){
    const url = "api/Member/invite_url"
    const data = {
        h5_url: h5Url,
    }
    
    return axios.post(url,data)
}
//支付密码
export function getPayPassword(code,password,repassword){
    const url = "api/Member/setpaypwd"
    const data= {
        code:code,
        password:password,
        repassword:repassword
    }
    return axios.post(url,data)
}
//修改用户信息
export function saveUserInfo(nickname,sex,address,head_img,birth){
    const url = "api/Member/savememberinfo";
    const data= {
        token:sessionStorage.getItem("token"),
        nickname:nickname,      //昵称
        sex:sex,                //性别（0未知 1男 2女）
        address:address,        //地址
        head_img:head_img,      //头像地址
        birth:birth             //生日（格式：2000-01-01）
    }
    console.log(data)
    return axios.post(url,data)
}
// 个人中心列表数据
export function getInfoList(){
    const url = "api/Member/icons";
    const data= {

    }
    return axios.post(url,data)
}

// 提现
export function withdraw(amount){
    const url = "api/WalletScore/apply_withdrawal";
    const data= {
        amount: amount,
        type: 1
    }
    return axios.post(url,data)
}
