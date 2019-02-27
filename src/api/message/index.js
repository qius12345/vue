import axios from "../config.js"

//消息分类列表
/*export function getMessageCateList(){
    const url = "Message/msg_label_list"
    const data = {
        token:sessionStorage.getItem("token")
    }
    return axios.post(url,data)
}*/
// 消息列表
/*export function getCartList(type,page){
    const url = "Message/msg_list"
    const data = {
        token:sessionStorage.getItem("token"),
        type:type,
        page:1
    }
    return axios.post(url,data)
}*/

// 免费大米
export function getMessageFree(){
    const url = "api/Message/free_message"
    const data = {
        token:sessionStorage.getItem("token")
    }
    return axios.post(url,data)
}
// 免费大米详情
export function getMessageFreeDetail(id){
    const url = "api/Message/free_message_detail"
    const data = {
        token:sessionStorage.getItem("token"),
        give_id:id
    }
    return axios.post(url,data)
}
// 免费大米收货
export function getMessageFreeSh(id){
    const url = "api/Message/shouhuo"
    const data = {
        token:sessionStorage.getItem("token"),
        record_id:id
    }
    return axios.post(url,data)
}
// 免费大米物流
export function getMessageFreeWl(id){
    const url = "api/Message/wuliu"
    const data = {
        token:sessionStorage.getItem("token"),
        record_id:id
    }
    return axios.post(url,data)
}
// 健康传递
export function getMessageHealth(page,list_row){
    const url = "api/Message/health_message"
    const data = {
        token:sessionStorage.getItem("token"),
        page:page,
        list_row:list_row,
    }
    return axios.post(url,data)
}
// 订单消息
export function getMessageOrder(page,list_row){
    const url = "api/Message/order_message"
    const data = {
        token:sessionStorage.getItem("token"),
        page:page,
        list_row:list_row,
    }
    return axios.post(url,data)
}