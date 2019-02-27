<template>
    <div class="order">
        <van-tabs  sticky :swipe-threshold="5" id="orderListTab" :line-width="50" @click="handleSwitchTab" v-model="orderStatusActiveIndex">
            <van-tab v-for="val in statusList" :title="val.title" :key="val.key">
                <div slot="title">
                    {{val.title}}
                    <div class="van-info" v-if="val.title != '全部'">{{val.number}}</div>
                </div>
                <van-list :immediate-check="false" v-if="listData.length > 0">
                    <van-row class="order-item" v-for="(item, index) in listData" :key="index">
                        <van-cell-group>
                            <van-cell :value="getOrderStatus(item.order_status)" class="dealing">
                                <template slot="title">
                                    <span>订单编号:{{ item.order_no }}</span>
                                </template>
                            </van-cell>
                        </van-cell-group>
                        <van-row class="order-item-list"  @click.native.stop="$router.push({name: 'myOrderDetail', query: { order_no: item.order_no }})">
                            <list-item  :imgArea="[78,78]" :imgUrl="orderGoodsInfo.goods_pic" :title="orderGoodsInfo.goods_name" :desc="orderGoodsInfo.goods_skuinfo" :price="orderGoodsInfo.goods_price" :number="orderGoodsInfo.goods_nums" v-for="orderGoodsInfo in item.goods_list" :key="orderGoodsInfo.id" />
                        </van-row>
                        <van-cell-group>
                            <van-cell class="order-item-desc">
                                <template slot="title">
                                    <span>共{{ item.goods_nums }}件商品 合计：&yen;
                                        <i>{{ item.total_fee }}</i>（含运费{{ item.express_fee }}元）</span>
                                </template>
                            </van-cell>
                        </van-cell-group>
                        <van-row class="pay-button-box" v-if="item.order_status != 0">
                        	<van-button size="small cancelOrder-btn btn" v-if="item.order_status != 5 && item.order_status == 4" @click.native.stop="$router.push({name: 'myOrderEvaluation', query: { order_no: item.order_no }})">评价</van-button>
                          <!-- <van-button size="small cancelOrder-btn btn van-button--primary" v-else-if="item.order_status >= 4">已评价</van-button> -->
                        	<!-- <van-button size="small cancelOrder-btn btn">分享</van-button> -->
                            <van-button size="small payOrder-btn btn" v-else-if="item.order_status == 3" @click="confirmOrder(item.order_no)">确认收货</van-button>
                            <van-button size="small payOrder-btn btn" v-else-if="item.order_status == 2" @click="remindOrder(item.order_no)">提醒发货</van-button>
                        	<van-button size="small payOrder-btn btn" v-else-if="item.order_status > 1" @click="$router.push({name:'shopDetails', query: { order: 'showPay' }})">再来一单</van-button>
                            <div v-else-if="item.order_status == 1">
                                <van-button size="small payOrder-btn btn" @click="show_pay(item.out_trade_no,item.total_fee,item.order_no)">付款</van-button>
                                <van-button size="small payOrder-btn btn" @click="cancleOrder(item.order_no)">取消订单</van-button>
                            </div>
                        </van-row>

                    </van-row>
                </van-list>
                <div class="nullOrder" v-else>
                    <img :src="nullOrder" alt="">
                    <p>您暂时无订单记录</p>
                </div>
            </van-tab>
        </van-tabs>
        <PayItem 
            :payShow = "payShow"
            :total = "totalPrice"
            :wallet = "memberInfo.wallet"
            @pay = "pay"
            @getRadio = "handleChangePayType"
            @hidePay = "hidePay"
        />
        
        <van-popup v-model="showPasswordInput" position="bottom" :overlay="true" :close-on-click-overlay="closeoVerlay">
            <van-nav-bar title="输入支付密码" left-text="" >
                <van-icon name="close" slot="right" @click="hidePasswordInput" />
            </van-nav-bar>
            <!-- 密码输入框 -->
            <van-password-input
                :value="value"
                info="密码为 6 位数字"
                @focus="showKeyboard = true"
            />

            <!-- 数字键盘 -->
            <van-number-keyboard
                :show="showKeyboard"
                @input="onInput"
                @delete="onDelete"
                @blur="showKeyboard = false"
            />
        </van-popup>
    </div>
</template>

<script>
import { Dialog, Toast } from "vant";
import PayItem from "@/components/pay-item";
import ListItem from "@/components/list-item";
import shopSm from "_img_/shop/shop_min.jpg";

import nullOrder from "_img_/order/nullOrder.png";

import {
  getOrderList,
  getOrderComment,
  getRemind_order,
  wechatPay,
  walletPay,
  getConfirmOrder,
  getCancleOrder
} from "@/api/order/index.js";

import { getUserInfo } from "@/api/my/userinfo.js";

export default {
  name: "Order",
  components: {
    ListItem,
    PayItem
  },
  data() {
    return {
        nullOrder:nullOrder,
      payShow: false,
      loading: true,
      isLoadFinished: false,
      totalPrice: "0.00",
      statusList: [
        {
          key: "0",
          title: "全部",
          number: ""
        },
        {
          key: "1",
          title: "待付款",
          number: ''
        },
        {
          key: "2",
          title: "待发货",
          number: ''
        },
        {
          key: "3",
          title: "配送中",
          number: ''
        },
        {
          key: "4",
          title: "待评价",
          number: ''
        }
      ],
      status: "",
      orderStatusActiveIndex: 0,
      page: 1,
      listData: [],
      total: 0,
      orderID: 0,
      payShow: false,
      totalPrice: 0,
      walletBalance: 10,
      memberInfo: {
        mobile: "",
        wallet: 0.0
      },
      closeoVerlay: false,
      showPasswordInput: false,
      showKeyboard: true,
      value: "",
      order_id: "",
      newOrderNo: "",

      unpay_nums: '',//待支付
      undelivery_nums: '',//代发货
      unreceive_nums: '',//待收货
      unevaluate_nums: ''//待评价
    };
  },
  computed: {},
  methods: {
    //提醒
    remindOrder(order_no) {
      getRemind_order(order_no)
        .then(res => {
          Toast(res.info);
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    deleteOrder() {
      Dialog.confirm({
        title: "确定删除吗?"
      })
        .then(() => {})
        .catch(() => {});
    },
    getOrderDetail() {},
    //订单状态
    getOrderStatus(idKey) {
      //订单状态 0：已取消，1：已下单/待付款 2：已付款/待发货送达 3：已送达/待确认收货完成 4：确认收货完成/待评价 5：已评价/完成 11：退款申请 12：退款完成
      let str = "";
      if (idKey == 0) {
        str = "已取消";
      } else if (idKey == 1) {
        str = "待付款";
      } else if (idKey == 2) {
        str = "待发货";
      } else if (idKey == 3) {
        str = "待收货";
      } else if (idKey == 4) {
        str = "交易成功/待评价";
      } else if (idKey == 5) {
        str = "已评价";
      } else if (idKey == 11) {
        str = "退款申请";
      } else if (idKey == 12) {
        str = "退款完成";
      }
      return str;
    },
    getUserInfo() {
      getUserInfo()
        .then(res => {
          this.memberInfo.wallet = res.wallet;

         if(res.order_info.unpay_nums >= '0'){
            this.statusList[1].number = res.order_info.unpay_nums == 0 ? '' : res.order_info.unpay_nums;
         }
         if( res.order_info.undelivery_nums >= '0'){
            this.statusList[2].number = res.order_info.undelivery_nums == 0 ? '' : res.order_info.undelivery_nums;
         }
         if(res.order_info.unreceive_nums >= '0'){
            this.statusList[3].number = res.order_info.unreceive_nums == 0 ? '' : res.order_info.unreceive_nums;
         }
         if(res.order_info.unevaluate_nums >= '0'){
            this.statusList[4].number = res.order_info.unevaluate_nums == 0 ? '' : res.order_info.unevaluate_nums;
         }
        })
        .catch(err => {
          Toast(err.info ? err.info : "请求失败");
        });
    },
    //列表
    getData(indexKey) {
      this.payShow = false;
      this.isLoadFinished = false;
      getOrderList(indexKey, 1)
        .then(res => {
          this.loading = false;
            if(!this.loading){
                this.$toast.clear();
            }
          if (res.status == "1") {
            this.listData = res.list;
            // if (this.page >= res.all_page) {
            //   this.isLoadFinished = true;
            // } else {
            //   this.page++;
            // }
          } else {
            // this.isLoadFinished = true;
            this.listData = [];
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
          this.listData = [];
        });
    },
    handleSwitchTab(index) {
         this.loading = true;
        if(this.loading){
            this.$toast.loading({
                mask: true,
                message: "加载中" + "...",
                loadingType: "spinner",
                duration: 0
            });
        }
      this.status = this.statusList[index].key;
      this.page = 1;
      //   this.listData = [];
      this.total = 0;
      this.$router.replace(
        { name: "myOrder", query: { status: this.status } },
        () => {
          this.getUserInfo();
          this.getData(this.status);
        }
      );
    },
    refreshData() {
      this.status = this.$route.query.status;

      for (let index in this.statusList) {
        let status = this.statusList[index];
        if (status && status.key == this.status) {
          this.orderStatusActiveIndex = index;
        }
      }
      this.page = 1;
      //   this.listData = [];
      this.total = 0;
      if(this.status != ''){
        this.getData(this.status);
      }else{
          this.getData(0);
      }

    },
    handleChangePayType(payType) {
      this.payType = payType;
    },
    show_pay(id, price, newOrderNo) {
      this.payShow = true;
      this.order_id = id;
      this.totalPrice = price;
      this.newOrderNo = newOrderNo;
    },
    hidePay() {
      this.payShow = false;
    },
    getRadio(name) {
      this.typeName = name;
    },
    jsApiCall(res) {
      var that = this;
      WeixinJSBridge.invoke(
        "getBrandWCPayRequest",
        {
          appId: res.appId, //公众号名称，由商户传入
          timeStamp: res.timeStamp, //时间戳，自1970年以来的秒数
          nonceStr: res.nonceStr, //随机串
          package: res.package,
          signType: res.signType, //微信签名方式：
          paySign: res.paySign //微信签名
        },
        function(res) {
          if (res.err_msg == "get_brand_wcpay_request:ok") {
            // Toast("支付成功");

            that.payShow = false;
            that.$router.push({
              name: "myOrderDetail",
              query: { order_no: that.newOrderNo }
            });
          } else {
            //取消支付
            Toast("支付失败");
          }
        }
      );
    },
    callpay(res) {
      if (typeof WeixinJSBridge == "undefined") {
        if (document.addEventListener) {
          document.addEventListener("WeixinJSBridgeReady", jsApiCall, false);
        } else if (document.attachEvent) {
          document.attachEvent("WeixinJSBridgeReady", jsApiCall);
          document.attachEvent("onWeixinJSBridgeReady", jsApiCall);
        }
      } else {
        this.jsApiCall(res);
      }
    },
    pay() {
      if (this.payType == "1") {
        if (this.order_id != "") {
          this.showPasswordInput = true;
          this.payShow = false;
          this.value = "";
        } else {
          Toast("提交失败,支付号不存在");
        }
      } else {
        if (this.order_id != "") {
            var isWxMini = window.__wxjs_environment === "miniprogram";
          if (isWxMini) {
            // let path = `/pages/pay/?&appId=${appId}&timeStamp=${timeStamp}&nonceStr=${nonceStr}&package=${package1}&signType=${signType}&signType=${signType}&paySign=${paySign}&jumpUrl=${jumpUrl}$sjumpUrl=${sjumpUrl}`;
            console.log('跳转到小程序页面了');
            

            wechatPay(this.order_id, 0, 1)
              .then(res => {
                
                let jumpUrl = encodeURIComponent(
                    "https://www.lekangran.com/Wx/#/myOrder"
                );
                let sjumpUrl = encodeURIComponent(window.location.href);

                console.log(res)
                let appId = encodeURIComponent(res.appId);
                let timeStamp = encodeURIComponent(res.timeStamp);
                let nonceStr = encodeURIComponent(res.nonceStr);
                let package1 = encodeURIComponent(res.package);
                let signType = encodeURIComponent(res.signType);
                let paySign = encodeURIComponent(res.paySign);

                let path = `/pages/pay/index?&appId=${appId}&timeStamp=${timeStamp}&nonceStr=${nonceStr}&package=${package1}&signType=${signType}&signType=${signType}&paySign=${paySign}&jumpUrl=${jumpUrl}`;
                // let path = `/pages/pay/pay?jumpUrl=${jumpUrl}&title=${desc}`;
                
                wx.miniProgram.navigateTo({
                    url: path
                });
                
              })
              .catch(err => {
                Toast(err.info ? err.info : "获取数据失败");
              });
          } else {
            wechatPay(this.order_id, 0, 0)
              .then(res => {
                this.callpay(res);
              })
              .catch(err => {
                Toast(err.info ? err.info : "获取数据失败");
              });
          }
        } else {
          Toast("提交失败,支付号不存在");
        }
      }
    },
    hidePasswordInput() {
      this.showPasswordInput = false;
      this.payShow = true;
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length == 6) {
        walletPay(this.order_id, this.value)
          .then(res => {
            if (res.status == "1") {
              Toast(res.info);
              this.payShow = false;
              setTimeout(() => {
                this.$router.go(0);
              }, 1000);
            } else if(res.status == "11"){
              Toast(res.info);
              if(res.telephone == ''){
                  setTimeout(() => {
                    this.$router.replace({
                      name: "myPhone",
                    });
                  }, 1000);
              }else{
                  setTimeout(() => {
                    this.$router.replace({
                      name: "myInfo",
                      query: { phone: res.telephone }
                    });
                  }, 1000);
              }
            } else {
                Toast(res.info);
            }
          })
          .catch(err => {
            Toast(err.info ? err.info : "获取数据失败");
          });
      }
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    confirmOrder(order_no) {
      Dialog.confirm({
        title: "确定收货吗",
        message: ""
      })
        .then(() => {
          getConfirmOrder(order_no)
            .then(res => {
                if(this.loading){
                    this.$toast.loading({
                        mask: true,
                        message: "加载中" + "...",
                        loadingType: "spinner",
                        duration: 0
                    });
                }
              if (res.status == 1) {
                Toast(res.info);
                this.$router.go(0);
                this.$router.push({
                  name: "myOrderEvaluation",
                  query: { order_no: order_no }
                });
              } else {
                Toast(res.info);
              }
            })
            .catch(err => {
              Toast(err.info ? err.info : "获取数据失败");
            });
        })
        .catch(() => {});
    },
    cancleOrder(order_no) {
      Dialog.confirm({
        title: "确定取消吗",
        message: ""
      })
        .then(() => {
          getCancleOrder(order_no)
            .then(res => {
              if (res.status == 1) {
                Toast(res.info);
                this.$router.go(0);
              } else {
                Toast(res.info);
              }
            })
            .catch(err => {
              Toast(err.info ? err.info : '获取数据失败');
            });
        })
        .catch(() => {});
    },
  },
  created() {
    // this.refreshData();
    if(this.loading){
        this.$toast.loading({
            mask: true,
            message: "加载中" + "...",
            loadingType: "spinner",
            duration: 0
      });
    }
  },
    beforeRouteEnter(to, from, next) {
        next(vm => {
        vm.refreshData();
        });
    },
  mounted() {
    this.getUserInfo();
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";

.order {
    .van-tabs{
        position: static;
    }
  .van-info {
    left: 80%;
    top: 0.4em;
    min-width: 1.2em;
    line-height: 1.2;
    border-radius: 0.6em;
  }
  padding-top: 46px;
  .van-tabs__content {
    padding-top: 10px;
  }
  .van-tabs__wrap {
    position: fixed;
    top: 46px;
  }
  .order-item {
    &:not(:last-child) {
      margin-bottom: 10px;
    }
    .order-item-list {
      background-color: #f5f5f5;
      padding: 0 15px;
      .row {
        .card-title {
          line-height: 24px;
          height: 24px;
          font-weight: 400;
          margin-top: 5px;
        }
        .card-footer {
          left: auto !important;
          right: 0px;
          bottom: auto;
          top: 15px;
        }
        .card-footer-price {
          color: @titleColor;
          font-size: 15px;
          line-height: 24px;
          font-weight: 400;
        }
        background-color: #f5f5f5;
        &:not(:last-child) {
          margin-bottom: 2px;
        }
        .card-number {
          right: 0px;
          bottom: 30px;
          font-weight: 400;
          color: @descColor;
          font-size: 12px;
        }
        .card-desc {
          margin-top: 15px;
        }
      }
    }
    .dealing {
      .van-cell__value {
        color: #e55680;
      }
    }
    .van-cell__value {
      flex: 0 0 auto;
      min-width: 6em;
    }
    .van-cell__title {
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .order-item-desc {
      padding-left: 10px;
      padding-right: 10px;
      .van-cell__title {
        text-align: right;
        i {
          font-style: normal;
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .pay-button-box {
      height: 28px;
      line-height: 28px;
      text-align: right;
      padding: 6px 12px;
      padding-right: 2px;
      background-color: #fff;
      .btn {
        padding: 0 24px;
        margin-right: 10px;
      }
      a {
        display: inline-block;
        height: 28px;
        line-height: 28px;
        // border: 1px solid $orderStatus;
        // color: $orderStatus;
        font-size: 12px;
        padding: 0 24px;
        border-radius: 15px;
      }
      .cancelOrder-btn {
        // color: $titleColor;
        // border-color: $titleColor;
        border-radius: 15px;
        // padding: 0 15px;
      }
      .payOrder-btn {
        color: @checkBoxColor;
        border-color: @checkBoxColor;
        border-radius: 15px;
        padding: 0 12px;
      }
    }
  }
  .list-empty {
    padding-top: 80px;
    .tips {
      color: #666;
      padding-top: 10px;
    }
  }
  .van-number-keyboard {
    position: relative;
  }
  .van-password-input {
    padding: 20px 0;
    padding-top: 60px;
  }
  .van-popup--bottom {
    min-height: 50%;
  }
  .nullOrder{
      text-align: center;
      position: absolute;
        left: 50%;
        top: 50%;
        -ms-transform:translate(-50%,-50%); 	/* IE 9 */
        -moz-transform:translate(-50%,-50%); 	/* Firefox */
        -webkit-transform:translate(-50%,-50%); /* Safari 和 Chrome */
        transform:translate(-50%,-50%);
        color: #999999;
        img{
            width: 100px;
        }
  }
}
</style>