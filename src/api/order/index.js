import axios from "../config.js"

//订单列表
export function getOrderList(type,page){
    const url = "api/myorder/order_list"
    const data = {
        token:sessionStorage.getItem('token'),
        status:type,                            //订单状态
        page:page                               //分页
    }
    return axios.post(url,data)
}

//评价
export function getOrderComment(order_no,store_exp_star,store_service_star,is_name,goodslist){
    const url = "api/Myorder/comment_order"
    const data = {
        token:sessionStorage.getItem("token"),
        order_no:order_no,                   //订单编号
        store_exp_star:store_exp_star,       //商铺物流
        store_service_star:store_service_star,   //商铺服务
        is_name:is_name,                     //是否匿名 1是 0 否
        goodslist:goodslist,                 //商品评价信息数组
    }
    return axios.post(url,data)
}

//详情
export function getOrderDetails(order_no){
    const url = "api/Myorder/order_detail"
    const data = {
        token:sessionStorage.getItem("token"),
        order_no:order_no                       //订单编号
    }
    return axios.post(url,data)
}
//取消订单
export function getCancleOrder(order_no){
    const url = "api/Myorder/cancle_order"
    const data = {
        order_no:order_no
    }
    return axios.post(url,data)
}
//删除订单
export function getDeleteOrder(order_no){

}
//确认收货
export function getConfirmOrder(order_no){
    const url = "api/Myorder/confirm_order"
    const data = {
        order_no:order_no
    }
    return axios.post(url,data)
}
//退款
export function getApply_aftersales(order_no,reason,desc,slide_img){
    const url = "api/Myorder/apply_aftersales"
    const data = {
        order_no:order_no,          //订单号
        reason:reason,              //原因
        desc:desc,                  //说明
        slide_img:slide_img         //图片
    }
    
    return axios.post(url,data)
}
//提醒发货
export function getRemind_order(order_no){
    const url = "api/Myorder/remind_order_shipping"
    const data={
        order_no:order_no
    }
    return axios.post(url,data)
}

// 立即购买
export function cartBuy(type,goods_id,sku_id,goods_nums,cartIds,address_id) {
    const url = 'api/Order/sure_order'
    const data = {
        type: type,
        goods_id: goods_id,
        sku_id: sku_id,
        goods_nums: goods_nums,
        cartids: cartIds,
        address_id: address_id
    }
    return axios.post(url, data)
}

// 生成订单
export function createOrder(type,goodsId,skuId,goodsNums,cartIds,addressId) {
    const url = 'api/Order/make_order'
    const data = {
        type: type,
        goods_id: goodsId,
        sku_id: skuId,
        goods_nums: goodsNums,
        cartids: cartIds,
        address_id: addressId,
    }
    return axios.post(url, data)
}
// 订单支付
export function payOrder(type,order_no) {
    const url = 'api/Order/before_pay_info'
    const data = {
        type: type,
        order_no: order_no,
    }
    return axios.post(url, data)
}

// 余额支付
export function walletPay(out_trade_no,pay_password){
    const url = "api/Pay/walletPay"
    const data = {
        out_trade_no: out_trade_no,
        pay_password: pay_password,
    }
    return axios.post(url,data)
}
//微信支付
export function wechatPay(out_trade_no,type,run_way){
    const url = "api/Pay/wechatPay"
    const data = {
        out_trade_no: out_trade_no,
        type: type,
        run_way: run_way
    }
    return axios.post(url,data)
}

// 物流信息
export function logisticsMsg(order_no){
    const url = "api/Myorder/get_order_express"
    const data = {
        order_no: order_no,
    }
    return axios.post(url,data)
}
//大米物流
export function getLogisticsFree(record_id){
    const url = "api/Message/wuliu"
    const data = {
        record_id: record_id,
    }
    return axios.post(url,data)
}

// 评论图片上传

export function subImg(file){
    const url = "api/Base/uploadimg"
    const data = {
        img_str: file,
    }
    return axios.post(url,data)
}


