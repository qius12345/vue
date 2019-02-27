import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Layout from '@/views/layout/layout'
import Home from '@/views/home/index'
import Message from '@/views/message/message'
import MessageDetails from '@/views/message/MessageDetails'
import Cart from '@/views/cart/cart'
import My from '@/views/my/my'
import ShopDetails from '@/views/goods/details'
import ShopEvaluateDetail from '@/views/goods/ShopEvaluateDetail'
import SharePage from '@/views/goods/sharePage'
import MyPhone from '@/views/my/myPhone'
import MyBalance from '@/views/my/myBalance'
import MyShareDetail from '@/views/my/myShareDetail'
import MyShare from '@/views/my/myShare'
import WithdrawDeposit from '@/views/my/withdrawDeposit'
import MyOrder from '@/views/order/myOrder'
import Buy from '@/views/order/buy'
import MyTeamAward from '@/views/my/myTeamAward'
import MyOrderEvaluation from '@/views/order/myOrderEvaluation'
import MyOrderDetail from '@/views/order/myOrderDetail'
import MyOrderLogistics from '@/views/order/myOrderLogistics'
import MyLocalhost from "@/views/my/MyLocalhost"
import MyOrderAftersales from "@/views/order/myOrderAftersales"
import MyInfo from "@/views/my/myInfo"
import WxShare from "@/views/my/wxShare"
import Introduce from "@/views/home/introduce"


export default new Router({
  routes: [{
    path: '/',
    component: Layout,
    redirect: 'home',
    children: [{
        name: 'home',
        path: 'home',
        component: Home,
        meta: {
          keepAlive: false
        }
      },
      {
        name: 'message',
        path: 'message',
        component: Message,
        meta: {
          title: '消息',
          keepAlive: false
        }
      },
      {
        name: 'messageDetails',
        path: 'messageDetails',
        component: MessageDetails,
        meta: {
          title: '消息',
          keepAlive: false
        }
      },
      {
        name: 'shopDetails',
        path: 'shopDetails',
        component: ShopDetails,
        meta: {
          title: '产品详情',
          keepAlive: false
        }
      },
      {
        name: 'sharePage',
        path: 'sharePage',
        component: SharePage,
        meta: {
          title: '把健康传递给好友',
          keepAlive: false
        }
      },
      {
        name: 'cart',
        path: 'cart',
        component: Cart,
        meta: {
          title: '购物车',
          keepAlive: false,
        }
      },
      {
        name: 'my',
        path: 'my',
        component: My,
        meta: {
          keepAlive: false
        }
      },
      {
        name: 'myPhone',
        path: 'myPhone',
        component: MyPhone,
        meta: {
          title: '绑定手机号',
          keepAlive: false
        }
      },
      {
        name: 'myBalance',
        path: 'myBalance',
        component: MyBalance,
        meta: {
          title: '我的余额',
          keepAlive: false
        }
      },
      {
        name: 'withdrawDeposit',
        path: 'withdrawDeposit',
        component: WithdrawDeposit,
        meta: {
          title: '提现',
          keepAlive: false
        }
      },
      {
        name: 'myOrder',
        path: 'myOrder',
        component: MyOrder,
        meta: {
          title: '我的订单',
          keepAlive: false
        }
      },
      {
        name: 'buy',
        path: 'buy',
        component: Buy,
        meta: {
          title: '填写订单',
          keepAlive: false
        }
      },
      {
        name: 'myShare',
        path: 'myShare',
        component: MyShare,
        meta: {
          title: '我的分享',
          keepAlive: false
        }
      }, , {
        name: 'myShareDetail',
        path: 'myShareDetail',
        component: MyShareDetail,
        meta: {
          title: '分享详情',
          keepAlive: false
        }
      }, {
        name: 'myTeamAward',
        path: 'myTeamAward',
        component: MyTeamAward,
        meta: {
          title: '团队奖',
          keepAlive: false
        }
      }, {
        name: 'myOrderEvaluation',
        path: 'myOrderEvaluation',
        component: MyOrderEvaluation,
        meta: {
          title: '评价',
          keepAlive: false
        }
      }, {
        name: 'shopEvaluateDetail',
        path: 'shopEvaluateDetail',
        component: ShopEvaluateDetail,
        meta: {
          title: '评价列表',
          keepAlive: false
        }
      },
      {
        name: 'myOrderDetail',
        path: 'myOrderDetail',
        component: MyOrderDetail,
        meta: {
          title: '订单详情',
          keepAlive: false
        }
      },
      {
        name: 'myOrderLogistics',
        path: 'myOrderLogistics',
        component: MyOrderLogistics,
        meta: {
          title: '物流详情',
          keepAlive: false
        }
      },
      {
        name: 'myLocalhost',
        path: 'myLocalhost',
        component: MyLocalhost,
        meta: {
          title: '我的地址',
          keepAlive: false
        }
      },
      {
        name: 'myInfo',
        path: 'myInfo',
        component: MyInfo,
        meta: {
          title: '个人设置',
          keepAlive: false
        }
      },
      {
        name: 'myOrderAftersales',
        path: 'myOrderAftersales',
        component: MyOrderAftersales,
        meta: {
          title: '申请售后',
          keepAlive: false
        }
      },
      {
        name: 'wxShare',
        path: 'wxShare',
        component: WxShare,
        meta: {
          title: '微信分享',
          keepAlive: false
        }
      },
      {
        name: 'introduce',
        path: 'introduce',
        component: Introduce,
        meta: {
          title: '乐康然',
          keepAlive: false
        }
      },
    ],
  }, ],
  scrollBehavior: () => ({
    y: 0
  }),
})
