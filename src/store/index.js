import Vuex from 'vuex'
import Vue from 'vue'
import userInfo from './modules/userInfo'
import getters from './getters'
// import types from './types'

Vue.use(Vuex);

const store = new Vuex.Store({
    modules: {
        userInfo
    },
    getters,
})
// export default new Vuex.Store({
//     state: {
//         user: {},
//         token: null,
//         title: ''
//     },
//     modules: {
//         userInfo
//     },
//     getters,
//     mutations: {
//         [types.LOGIN]: (state, data) => {
//             localStorage.token = data;
//             state.token = data;
//         },
//         [types.LOGOUT]: (state) => {
//             localStorage.removeItem('token');
//             state.token = null
//         },
//         [types.TITLE]: (state, data) => {
//             state.title = data;
//         }
//     }
// })
export default store