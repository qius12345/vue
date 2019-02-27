<template>
	<div class="myOrderDetail">
		<!--订单状态-->
		<van-list class="orderStateList">
			<van-cell>
				<template slot="title">
					<span class="van-cell-text">{{orderStateString}}</span>
					<van-icon name="arrow" />
				</template>
			</van-cell>
		</van-list>


		<!--按钮-->
		<van-list class="btnList" v-if='orderState==1'>
			<van-button type="default" @click="cancleOrder()">取消订单</van-button>
			<van-button type="default" style='background-color: #e55680;color: #fff;border: #E55680;' @click="show_pay()">立即支付</van-button>
		</van-list>
		<van-list class="btnList" v-else-if='orderState==2'>
			<!-- <van-button type="default" @click="cancleOrder()">取消订单</van-button> -->
			<van-button type="default" style='background-color: #e55680;color: #fff;border: #E55680;' @click="$router.push({name:'shopDetails', query: { order: 'showPay', shopId: shopInfo.shopId}})">再来一单</van-button>
		</van-list>
		<van-list class="btnList" v-else-if='orderState==3'>
			<van-button type="default" @click="confirmOrder()">确认收货</van-button>
			<van-button type="default" style='background-color: #e55680;color: #fff;border: #E55680;' @click="$router.push({name:'shopDetails', query: { order: 'showPay', shopId: shopInfo.shopId }})">再来一单</van-button>
		</van-list>
		<van-list class="btnList" v-else-if='orderState==4 || orderState==5'>
			<!-- <van-button type="default" @click="$router.push({name:'myOrderAftersales', query: { order_no: orderInfo.orderNumber }})">申请售后</van-button> -->
            <van-button type="default" style='background-color: #e55680;color: #fff;border: #E55680;' @click="$router.push({name:'shopDetails', query: { order: 'showPay', shopId: shopInfo.shopId }})">再来一单</van-button>
		</van-list>
		<!-- <van-list class="btnList" v-else-if='orderState==11'>
			<van-button type="default">退款申请中</van-button>
		</van-list>
		<van-list class="btnList" v-else-if='orderState==12'>
			<van-button type="default">退款完成</van-button>
		</van-list> -->

		<van-list class="btnList" v-else-if='orderState==5'>
			<!--<van-button type="default">取消订单</van-button>-->
			<div class="successTip">感谢您对领鲜的信任，期待再次光临。</div>
			<van-button type="default" style='background-color: #e55680;color: #fff;border: #E55680;' @click="$router.push({name:'shopDetails', query: { order: 'showPay', shopId: shopInfo.shopId }})">再来一单</van-button>
		</van-list>
		
		<div class="SegmentingLine" v-if="orderState!=4"></div>

		<!--订单收件人地址信息-->
		<van-list class="userInfoList">
			<van-cell>
				<template class="userNamePhone" slot="title">
					<div class="name">收货人：{{addressInfo.name}}</div>
					<div class="phone">{{addressInfo.phone}}</div>
				</template>
			</van-cell>
			<van-cell icon="location" class="address">
				<template slot="title">
					收货人：{{addressInfo.address}}
				</template>
			</van-cell>
		</van-list>

		<div class="SegmentingLine"></div>

		<!--商品信息-->
		<van-card class="shopInfo" :title="shopInfo.shopName" :desc="shopInfo.shopDesc" :num="shopInfo.shopNum" :price="shopInfo.shopPrice" :thumb="shopInfo.shopImg" />

		<div class="SegmentingLine"></div>

		<!--物流信息-->
		<van-cell-group class="logisticsInfo" v-if="logisticsInfo.shipping_time != ''">
			<van-cell title="物流信息" is-link class="title" @click="$router.push({name:'myOrderLogistics',query:{'order_no':orderInfo.orderNumber}})"/>
			<van-cell>
				<template slot="title">
					<span>发货时间:</span>{{logisticsInfo.shipping_time}}
				</template>
			</van-cell>
			<van-cell>
				<template slot="title">
					<span>收货时间:</span>{{logisticsInfo.confirm_time}}
				</template>
			</van-cell>
		</van-cell-group>
		
		
		<div class="SegmentingLine"></div>
		
		
		<!--订单信息-->
		<van-cell-group class="orderInfo">
			<van-cell title="订单信息" is-link class="title" />
			<van-cell>
				<template slot="title">
					<span>订单编号：</span>{{orderInfo.orderNumber}}
				</template>
			</van-cell>
			<van-cell>
				<template slot="title">
					<span>交易流水：</span>{{orderInfo.tradingFlow}}
				</template>
			</van-cell>
			<van-cell>
				<template slot="title">
					<span>创建时间：</span>{{orderInfo.creatTime}}
				</template>
			</van-cell>
			<van-cell>
				<template slot="title">
					<span>付款时间：</span>{{orderInfo.payTime}}
				</template>
			</van-cell>
			<!-- <van-cell>
				<template slot="title">
					<span>物流单号：</span>{{orderInfo.logisticsNumber}}
				</template>
			</van-cell> -->
		</van-cell-group>
		
		<div class="SegmentingLine"></div>
		
		<!--商品信息-->
		<van-cell-group class="shopInfoTwo">
			<van-cell title="商品信息" is-link class="title" />
			<van-cell>
				<template slot="title">
					<div class="shopMoney"><span>商品总价</span><span>￥{{totalPrice}}</span></div>
					<div class="freight"><span>运费</span><span>{{express_fee}}</span></div>
				</template>
			</van-cell>
			<van-cell>
				<template slot="title">
					<div class="shopMoneyCount">合计：￥{{total_fee}}</div>
				</template>
			</van-cell>
		</van-cell-group>
		
		<div class="SegmentingLine"></div>
		
		<div class="footTip">如果收到的商品出现质量、错发、漏发等问题可联系客服。</div>

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
import PayItem from "@/components/pay-item";
import { Icon } from "vant";
import { Cell, CellGroup } from "vant";
import { List } from "vant";
import { Button } from "vant";
import { Card, Toast, Dialog } from "vant";
import {
  getOrderDetails,
  getCancleOrder,
  getConfirmOrder,
  payOrder,
  walletPay,
  wechatPay
} from "@/api/order/index.js";
import { getUserInfo } from "@/api/my/userinfo.js";

export default {
  name: "myOrderDetail",
  components: {
    PayItem
  },
  data() {
    return {
      order_id: "",
      orderId: "",
      payShow: false,
      showPasswordInput: false,
      showKeyboard: true,
      closeoVerlay: false,
      value: "",
      orderState: 1,
      orderStateString: "",
      totalPrice: "0.00",
      addressInfo: {
        name: "",
        phone: "",
        address: ""
      },
      shopInfo: {
        shopName: "",
        shopImg: "",
        shopPrice: "",
        shopNum: 1,
        shopDesc: "",
        shopId:''
      },
      logisticsInfo: {
        shipping_time: "",
        confirm_time: ""
      },

      orderInfo: {},
      memberInfo: {
        mobile: "",
        wallet: 0.0
      },
      listData: [],
      total_fee: "",
      express_fee: ""
    };
  },
  methods: {
    //支付
    walletPlay() {},
    hidePay() {
      this.payShow = false;
    },
    jsApiCall(res) {
       var that = this
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
            Toast("支付成功");
            setTimeout(() => {
              that.$router.go(0);
            }, 1000);
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
        if (this.orderId != "") {
          this.showPasswordInput = true;
          this.payShow = false;
          this.value = "";
        } else {
          Toast("提交失败,支付号不存在");
        }
      } else {
        if (this.orderId != "") {
          var isWxMini = window.__wxjs_environment === "miniprogram";
          if (isWxMini) {
            // let path = `/pages/pay/?&appId=${appId}&timeStamp=${timeStamp}&nonceStr=${nonceStr}&package=${package1}&signType=${signType}&signType=${signType}&paySign=${paySign}&jumpUrl=${jumpUrl}$sjumpUrl=${sjumpUrl}`;
            console.log('跳转到小程序页面了');
            

            wechatPay(this.orderId, 0, 1)
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
            wechatPay(this.orderId, 0, 0)
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
    handleChangePayType(payType) {
      this.payType = payType;
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length == 6) {
        walletPay(this.orderId, this.value)
          .then(res => {
            if (res.status == "1") {
              Toast(res.info);
              setTimeout(() => {
                this.$router.go(0);
              }, 2000);
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
            Toast(err.info ? err.info : '获取数据失败');
          });
      }
    },
    onDelete() {
      this.value = this.value.slice(0, this.value.length - 1);
    },
    hidePasswordInput() {
      this.showPasswordInput = false;
      this.payShow = true;
    },
    orderstate(k) {
      var strOrder = "";
      if (k == 0) {
        this.orderStateString = "已取消";
      } else if (k == 1) {
        this.orderStateString = "待支付";
      } else if (k == 2) {
        this.orderStateString = "待发货";
      } else if (k == 3) {
        this.orderStateString = "配送中";
      } else if (k == 4) {
        this.orderStateString = "交易成功/待评价";
      } else if (k == 5) {
        this.orderStateString = "已完成";
      } else if (k == 11) {
        this.orderStateString = "退款申请";
      } else if (k == 11) {
        this.orderStateString = "退款申请完成";
      }
    },
    cancleOrder() {
      Dialog.confirm({
        title: "确定取消吗",
        message: ""
      })
        .then(() => {
          getCancleOrder(this.$route.query.order_no)
            .then(res => {
              if (res.status == 1) {
                Toast(res.info);
                this.$router.go(-1);
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
    confirmOrder() {
      Dialog.confirm({
        title: "确定收货吗",
        message: ""
      })
        .then(() => {
          getConfirmOrder(this.$route.query.order_no)
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
    show_pay() {
      payOrder(0, this.order_id)
        .then(res => {
          this.orderId = res.out_trade_no;
          this.payShow = true;
        })
        .catch(err => {
            Toast(err.info ? err.info : '获取数据失败');
        });
    }
  },
  created() {},
  mounted() {
    let order_no = this.$route.query.order_no;
    this.order_id = order_no;
    if (order_no == "") {
      Toast("异常错误");
      this.$router.go(-1);
      return;
    }
    getUserInfo()
      .then(res => {
        this.memberInfo.wallet = res.wallet;
      })
      .catch(err => {
        Toast(err.info ? err.info : "请求失败");
      });

    getOrderDetails(order_no)
      .then(res => {

        if (res.status == 1) {
          this.orderState = res.order_info.order_status;
          this.orderstate(this.orderState); //订单状态
          //收货

          this.totalPrice = res.order_info.total_price;
          this.total_fee = res.order_info.total_fee;
          this.express_fee = res.order_info.express_fee;

          this.addressInfo = {
            name: res.address_info.consignee,
            phone: res.address_info.telephone,
            address:
              res.address_info.province +
              res.address_info.city +
              res.address_info.district +
              res.address_info.place
          };

          this.shopInfo = {
            shopName: res.goods_list.list[0].goods_name,
            shopImg: res.goods_list.list[0].goods_pic,
            shopPrice: res.goods_list.list[0].goods_price,
            shopNum: res.goods_list.list[0].goods_nums,
            shopDesc: res.goods_list.list[0].sku_info,
            shopId: res.goods_list.list[0].goods_id,
          };

          this.logisticsInfo.shipping_time = res.order_info.shipping_time;
          this.logisticsInfo.confirm_time = res.order_info.confirm_time;
          this.orderInfo = {
            orderNumber: res.order_info.order_no,
            tradingFlow: res.order_info.trade_no,
            creatTime: res.order_info.order_time,
            payTime: res.order_info.pay_time,
            // logisticsNumber: res.order_info
          };
        } else {
          Toast(res.info);
          this.$router.go(-1);
        }
      })
      .catch(err => {
        Toast(err.info ? err.info : '获取数据失败');
        this.$router.go(-1);
      });
  },
  computed: {}
};
</script>

<style lang="less">
@import "../../styles/color.less";
.myOrderDetail {
  padding-top: 44px;
  min-height: calc(100vh - 44px);
  background: #fff;
  /*灰色分割线*/
  .SegmentingLine {
    height: 10px;
    background: #f5f5f5;
  }
  /*订单状态*/
  .orderStateList {
    .van-cell {
      height: 55px;
      background: #e55680;
      padding: 0 15px;
      line-height: normal;
      font-size: 21px;
      align-items: center;
      .van-cell__title {
        color: #fff;
        line-height: 1;
        display: flex;
        align-items: center;
        .van-icon {
          margin-left: 10px;
          vertical-align: middle;
          font-size: 15px;
        }
      }
    }
  }
  /*按钮*/
  .btnList {
    padding: 15px;
    font-size: 0;
    .van-button {
      height: 34px;
      width: 102px;
      line-height: 34px;
      border: solid 1px #b1b1b1;
      font-size: 14px;
      color: #666666;
      margin-right: 15px;
    }
    .successTip {
      font-size: 14px;
      margin-bottom: 15px;
      color: #000;
    }
  }
  /*收件人信息*/
  .userInfoList {
    padding: 15px;
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
    .van-cell {
      padding: 0;
      /*收件人信息*/
      .van-cell__title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          font-size: 15px;
          color: #333;
        }
        .phone {
          font-size: 12px;
          color: #333;
        }
      }
    }
    .address {
      .van-cell__title {
        font-size: 14px;
        color: #333;
      }
    }
    .van-cell:first-child {
      padding: 0 0 5px 21px;
    }
  }
  /*商品信息*/
  .shopInfo {
    margin: 0;
    background: #fff;
    padding: 20px 15px 20px 105px;
    height: 78px;
    box-sizing: inherit;
    /*图片*/
    .van-card__thumb {
      width: 78px;
      height: 78px;
      top: 20px;
    }
    .van-card__content {
      .van-card__row {
        height: 39px;
        align-items: center;
      }
    }
  }
  /*物流信息*/
  .logisticsInfo {
    .title {
      .van-cell__title {
        span {
          font-size: 16px !important;
          color: #333 !important;
          font-weight: bold;
        }
      }
      .van-icon {
        color: #666666;
      }
    }
    .van-cell {
      .van-cell__title {
        font-size: 14px;
        color: #333;
        span {
          color: #999;
        }
      }
    }

    .van-cell:not(:last-child)::after {
      margin-right: 15px;
    }
  }

  /*订单信息*/
  .orderInfo {
    .title {
      .van-cell__title {
        span {
          font-size: 16px !important;
          color: #333 !important;
          font-weight: bold;
        }
      }
      .van-icon {
        color: #666666;
      }
    }
    .van-cell {
      .van-cell__title {
        font-size: 14px;
        color: #333;
        span {
          color: #999;
        }
      }
    }

    .van-cell:not(:last-child)::after {
      margin-right: 15px;
    }
  }

  /*商品总价及运费*/
  .shopInfoTwo {
    .title {
      .van-cell__title {
        span {
          font-size: 16px !important;
          color: #333 !important;
          font-weight: bold;
        }
      }
      .van-icon {
        color: #666666;
      }
    }
    .van-cell {
      .van-cell__title {
        .shopMoney,
        .freight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #333;
          font-size: 14px;
        }

        .shopMoneyCount {
          color: #e55680;
          font-size: 16px;
          text-align: right;
          font-weight: bold;
        }
      }
    }

    .van-cell:not(:last-child)::after {
      margin-right: 15px;
    }
  }

  /*底部提示语句*/
  .footTip {
    font-size: 12px;
    text-align: center;
    padding: 15px 0;
    color: #666;
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
</style>