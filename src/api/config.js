import axios from 'axios'
import qs from 'qs'
import Vue from '../main.js'

const ERR_OK = 0
const ERR_LOGIN = '-1'

const Axios = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? '/api' : '/',
  timeout: 20000,
  responseType: 'json',
  withCredentials: true, // 是否允许带cookie这些
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
  },
})

let CancelToken = axios.CancelToken



// POST传参序列化(添加请求拦截器)
Axios.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (config.method === 'post' || config.method === 'put' || config.method === 'delete') {
      // 序列化
      if (config.headers['Content-Type'] !== 'multipart/form-data') {
          if(config.data && config.data!=={}){
            if (sessionStorage.getItem('token')) {
                config.data.token= sessionStorage.getItem('token');
            }
        }else{
            config.data = '';
        }
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  error => {
    return Promise.reject(error.data.error.message)
  }
)

// 返回状态判断(添加响应拦截器)
Axios.interceptors.response.use(
  res => {
    if (res.data) {
        // alert('接口调用'+location.href);
      if (res.data && res.data.status == ERR_LOGIN) {
        
        sessionStorage.removeItem('token');

        var url= window.location.href;
        
        window.location.href = "https://www.lekangran.com/Api/BaseH5/H5/h5_url/" + window.btoa(url);

      }
      return new Promise((resolve) => {
        resolve(res.data)
      })
    } else {
      return Promise.reject('请求异常')
    }
  },
  error => {
    if (error.response) {
    //     switch (error.response.status) {
    //         case 401:
    //             // 返回 401 清除token信息并跳转到登录页面
    //             store.commit(types.LOGOUT);
    //             router.replace({
    //                 path: 'login',
    //                 query: {redirect: router.currentRoute.fullPath}
    //             })
    //     }
    // }
    // return Promise.reject(error.response.data)
    // if (error.message) {
    //     return Promise.reject(error.message)
    // }
    
        return Promise.reject(error.message);
    }
    // 返回 response 里的错误信息
    const errorInfo = error.data.error ? error.data.error.message : error.data
    return Promise.reject(errorInfo)
  }
)

export default Axios
