import axios from "../config.js"

//用户信息
export function getWalletScoreList(){
    const url="api/WalletScore/wallet_list"
    const data = {
    }
    return axios.post(url,data)
}

