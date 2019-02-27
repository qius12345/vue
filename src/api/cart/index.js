import axios from "../config.js"

//购物车列表
export function getCartList(){
    const url = "api/Cart/cart_list"
    const data = {
    }
    return axios.post(url,data)
}
// 删除购物车
export function delCart(cartIds){
    const url = "api/Cart/del_cart_goods_list"
    const data = {
        token:sessionStorage.getItem("token"),
        cartids: cartIds
    }
    return axios.post(url,data)
}

// 改变购物车数量
export function changeCartNum(cartIds,cartNum){
    const url = "api/Cart/change_cart_goods_nums"
    const data = {
        token:sessionStorage.getItem("token"),
        cart_id: cartIds,
        nums:cartNum
    }
    return axios.post(url,data)
}
