import { getUserInfo } from '@/api/my/userinfo.js'

const userInfo = {
    state: {
        identity: '',
        cartNum: ''
    },
    mutations: {

    },
    actions: {
        getUserInfo({ commit, state }) {
            getUserInfo().then(res => {
                state.identity = res.member_type_id;
                state.cartNum = res.cart_nums == 0 ? null : res.cart_nums;
            }).catch(() => {

            })
        }
    }
}

export default userInfo