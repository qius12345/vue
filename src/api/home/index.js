import axios from '../config.js'

// 获取首页banner
export function getHomeBanner() {
    const url = 'api/Index/index_slide_imgs'
    const data = {
        
    }
    return axios.post(url, data)
}
// 获取首页图
export function getHomeImg() {
    const url = 'api/Index/app_guide_imgs'
    const data = {
        
    }
    return axios.post(url)
}

// 获取图文详情
export function getIntroduce(banner_id) {
    const url = 'api/index/slide_detail'
    const data = {
        banner_id: banner_id
    }
    return axios.post(url,data)
}

// 获取产品列表
export function getGoodsList() {
    const url = 'api/Goods/goods_list'
    const data = {
        
    }
    return axios.post(url, data)
}


// 获取产品详情
export function getGoodsInfo(goodsId) {
    const url = 'api/Goods/goods_info'
    const data = {
        goods_id: goodsId,
    }
    return axios.post(url, data)
}

// 获取产品属性
export function getGoodsSku(goodsId) {
    const url = 'api/Goods/goods_skuinfo'
    const data = {
        goods_id: goodsId,
    }
    return axios.post(url, data)
}

// 加入购物车
export function addCart(goodsId,goodsNums,skuId) {
    const url = 'api/Cart/add_cart'
    const data = {
        goods_id: goodsId,
        sku_id: skuId,
        goods_nums: goodsNums,
    }
    return axios.post(url, data)
}

// 消息数量
export function getMessageCount(goodsId,goodsNums,skuId) {
    const url = 'api/Message/message_count'
    const data = {
        goods_id: goodsId,
        sku_id: skuId,
        goods_nums: goodsNums,
    }
    return axios.post(url, data)
}

//评论列表
export function getEvaluateList(isPic,is_new,is_bed,is_good) {
    const url = 'api/Goods/goods_comment_list'
    const data = {
        goods_id: 1,
        page: 1,
        list_rows: 150,
        is_pic: isPic,
        is_new: is_new,
        is_bed: is_bed,
        is_good: is_good
    }
    return axios.post(url, data)
}


