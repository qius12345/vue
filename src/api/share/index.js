import axios from "../config.js"

// 我的分享
export function getMyshare(type,page,listRow){
    const url="api/Myshare/index";
    const data = {
        // token:sessionStorage.getItem("token")
        type: type,
        page: page,
        list_row: listRow,
    }
    return axios.post(url,data)
}
// 我的分享详情
export function getMyshareDetail(shareId){
    const url="api/Myshare/detail";
    const data = {
        share_id: shareId,
    }
    return axios.post(url,data)
}
// 大米奖励数据
export function getRice(addressId){
    const url="api/Myshare/receive_before";
    const data = {
        address_id: addressId,
    }
    return axios.post(url,data)
}

// 领取大米奖励
export function getReceive(addressId){
    const url="api/Myshare/receive";
    const data = {
        address_id: addressId,
    }
    return axios.post(url,data)
}

// 商品详情分享
export function getGoodShare(pageUrl){
    const url="api/Goods/goods_share";
    const data = {
        goods_id: 1,
        url: pageUrl
    }
    return axios.post(url,data)
}