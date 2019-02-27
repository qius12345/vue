import axios from '../config.js'

//获取地址列表
export function getAddress_list(){
    const url="api/Address/address_list"
    const data = {
    }
    return axios.post(url,data)
}
//地址详情
export function getAddress_Deatil(id){
    const url = "api/Address/address_deatil"
    const data = {
        address_id:id,
    }
    
    return axios.post(url,data)
}
//添加地址
export function getAddress_Add(id,consignee,telephone,province,city,districe,address,is_default,area_code){
    const url = "api/Address/add_edit_address"
    const data = {
        consignee :consignee,
        telephone:telephone,
        province:province,
        city:city,
        district:districe,
        address:address,
        is_default:is_default,
        area_code:area_code
    }
    
    return axios.post(url,data)
}

//编辑地址
export function getAddress_Edit(id,consignee,telephone,province,city,districe,address,is_default,area_code){
    const url = "api/Address/add_edit_address"
    const data = {
        address_id:id,
        consignee :consignee,
        telephone:telephone,
        province:province,
        city:city,
        district:districe,
        address:address,
        is_default:is_default,
        area_code:area_code
    }
   
    return axios.post(url,data)
}


//删除地址
export function getAddress_Del(id){
    const url="api/Address/del_address"
    const data = {
        address_id:id,
    }
    return axios.post(url,data)
}
//默认地址
export function setAddress_Default(id){
    const url = "api/Address/set_default_address"
    const data = {
        address_id:id,
    }
    return axios.post(url,data)
}