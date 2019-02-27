// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'


import Vant from 'vant';

import 'vant/lib/vant-css/index.css';

import '@/styles/index.less';

Vue.use(Vant);


Vue.config.productionTip = false

// router.beforeEach((to, from, next) => {
//     // console.log(to);
//     //     console.log(from);
//         alert(to.name);
//     // if (to.meta.requiresAuth) {  // 判断该路由是否需要登录权限
        
//     // }
//     // else {
//     //     
//     // }
//     next();
// })

// alert('main.js'+location.href);


/* eslint-disable no-new */
const vue = new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})

export default vue