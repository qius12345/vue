<template>
	<div>
		<div class="placeOrder">
			<van-cell-group v-if="addressInfo.address_id" @click.native="selectAddress">
				<van-cell :title="'收货人：' + addressInfo.consignee" :value="addressInfo.telephone" :border="false" class="Contacts" />
				<van-cell :value="'收货地址：' + normalizeReceivingAddress" border icon="location" is-link style="padding-top: 0px;" />
                <!-- <van-cell class="placeOrder-" value="（收货不便时,可选择免费代收货服务）"  /> -->
			</van-cell-group>
			<van-cell-group v-else style="box-shadow:0px 2px 10px 4px #eaeaea;" @click.native="selectAddress">
				<van-cell value="暂无地址,立即前往添加" :border="false" is-link class="Contacts" style="padding: 20px;"  />
			</van-cell-group>
			
			<div class="" style="font-size: 0;">
				<img src="../../../static/images/order/placeOrder_line.jpg" width="100%" />
			</div>
			<van-row class="buy-shop-list">
				<list-item v-for="item in goodsList" :key="item.sku_id" :name="item.sku_id" :price="item.goods_price" :imgArea="[90,90]" :imgUrl="item.goods_logo" :title="item.goods_name" :desc="item.goods_skuinfo"  :number="item.goods_nums" />
			</van-row>
			<van-submit-bar class="cart-submit van-hairline--top" :price="orderInfo.orderAmount * 100" :button-text="submitBarText" @click.native="showPay"></van-submit-bar>
			
			<van-row class="total">
				<van-panel title="商品合计" :status="'￥' + orderInfo.goodsAmount"  class="total_panel"></van-panel>
				<van-panel title="运费" :status="orderInfo.expressFee" class="total_pane2"></van-panel>
			</van-row>
			<PayItem 
				:payShow = "payShow"
				:total = "orderInfo.orderAmount"
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
		<!-- <van-toast :mask="true" message="加载中..." type="loading" v-model="loading"></van-toast> -->
	</div>
</template>

<script>
import ListItem from "@/components/list-item";
import shopSm from "_img_/shop/shop_min.jpg";
import PayItem from "@/components/pay-item";
import { getUserInfo } from "@/api/my/userinfo.js";
import { getRice, getReceive } from "@/api/share/index.js";
import wx from "weixin-js-sdk";

import { Toast, Dialog } from "vant";
import {
  cartBuy,
  createOrder,
  payOrder,
  walletPay,
  wechatPay
} from "@/api/order/index.js";

export default {
  name: "Cart",
  components: {
    ListItem,
    PayItem
  },
  data() {
    return {
      showPasswordInput: false,
      loading: true,
      orderInfo: {
        goodsAmount: 0.0,
        orderAmount: 0.0,
        expressFee: "包邮"
      },
      goodsList: [],
      memberInfo: {
        mobile: "",
        wallet: 0.0
      },
      addressInfo: {},
      addressId: 0,
      payType: "",
      submitBarText: "提交订单",

      order_id: "",
      payShow: false,
      addressStatus: 0,
      value: "",
      showKeyboard: true,
      closeoVerlay: false,
      order_no: ""
    };
  },
  computed: {
    normalizeReceivingAddress() {
      return (
        this.addressInfo.province +
        this.addressInfo.city +
        this.addressInfo.district +
        this.addressInfo.address
      );
    }
  },
  created() {
    this.addressId = this.$route.query.addressId;
    this.getCartOrderInfo();
  },
  activated() {},
  methods: {
    getCartOrderInfo() {
      if (this.$route.query.goodsId) {
        cartBuy(
          1,
          this.$route.query.goodsId,
          this.$route.query.sku_id,
          this.$route.query.goods_nums,
          "",
          this.addressId
        )
          .then(res => {
            this.goodsList = res.goods_info[0].goods_list;
            this.addressInfo = res.address_info;
            this.orderInfo.goodsAmount = res.goods_all_money;
            this.orderInfo.orderAmount = res.order_all_money;
            this.orderInfo.expressFee = res.express_fee;
          })
          .catch(err => {
            Toast(err.info ? err.info : "获取数据失败");
            this.addressInfo = {};
            this.orderInfo.goodsAmount = 0.0;
            this.orderInfo.orderAmount = 0.0;
            this.orderInfo.expressFee = 0.0;
          });
      } else if (this.$route.query.getRice) {
        this.submitBarText = "立即领取";
        getRice(this.addressId)
          .then(res => {
            this.goodsList = res.goods_info[0].goods_list;
            this.addressInfo = res.address_info;
            this.orderInfo.goodsAmount = res.goods_all_money;
            this.orderInfo.orderAmount = res.order_all_money;
            this.orderInfo.expressFee = res.express_fee;
          })
          .catch(err => {
            Toast(err.info ? err.info : "请求失败");
          });
      } else {
        cartBuy(3, "", "", "", this.$route.query.cartIds, this.addressId)
          .then(res => {
            this.goodsList = res.goods_info[0].goods_list;
            this.addressInfo = res.address_info;
            this.orderInfo.goodsAmount = res.goods_all_money;
            this.orderInfo.orderAmount = res.order_all_money;
            this.orderInfo.expressFee = res.express_fee;
          })
          .catch(err => {
            Toast(err.info ? err.info : "获取数据失败");
            this.addressInfo = {};
            this.orderInfo.goodsAmount = 0.0;
            this.orderInfo.orderAmount = 0.0;
            this.orderInfo.expressFee = 0.0;
          });
      }
    },
    formatPrice(price) {
      return (price / 100).toFixed(2);
    },
    showPay() {
      if (this.addressInfo.address_id != "") {
        if (this.$route.query.getRice) {
          getReceive(this.addressInfo.address_id)
            .then(res => {
              Toast(res.info);
              if (res.status == 1) {
                setTimeout(() => {
                  this.$router.replace({ name: "myShare" });
                }, 2000);
              }
            })
            .catch(err => {
              Toast(err.info ? err.info : "请求失败");
            });
        } else {
          getUserInfo()
            .then(res => {
              this.memberInfo.wallet = res.wallet;
            })
            .catch(err => {
              Toast(err.info ? err.info : "请求失败");
            });
          if (this.$route.query.goodsId) {
            createOrder(
              1,
              this.$route.query.goodsId,
              this.$route.query.sku_id,
              this.$route.query.goods_nums,
              "",
              this.addressInfo.address_id
            )
              .then(res => {
                if (res.status == "1") {
                  this.order_no = res.order_no;
                  payOrder(0, res.order_no)
                    .then(res => {
                      this.order_id = res.out_trade_no;
                      this.payShow = true;
                    })
                    .catch(err => {
                      Toast(err.info ? err.info : "获取数据失败");
                    });
                } else {
                  Toast(res.info ? res.info : "请求失败");
                }
              })
              .catch(error => {
                // this.payShow = false
                // this.$toast('提交失败')
                Toast(err.info ? err.info : "请求失败");
              });
          } else {
            createOrder(
              3,
              "",
              "",
              "",
              this.$route.query.cartIds,
              this.addressInfo.address_id
            )
              .then(res => {
                if (res.status == "1") {
                  payOrder(0, res.order_no)
                    .then(res => {
                      this.order_id = res.out_trade_no;
                      this.payShow = true;
                    })
                    .catch(err => {
                      Toast(err.info ? err.info : "获取数据失败");
                    });
                } else {
                  Toast(res.message ? res.message : "请求失败");
                }
              })
              .catch(error => {
                Toast(err.info ? err.info : "获取数据失败");
                // this.payShow = false
                // this.$toast('提交失败')
              });
          }
        }
      } else {
        Toast("请填写地址");
      }
    },
    hidePay() {
      this.payShow = false;
      this.$router.replace({ name: "myOrder" });
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
            Toast("支付成功");
            setTimeout(() => {
              that.$router.replace({
                name: "myOrderDetail",
                query: { order_no: that.order_no }
              });
            }, 1000);
            // location.href = "https://www.lekangran.com/Wx/#/myOrder";
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
    handleChangePayType(payType) {
      this.payType = payType;
    },
    onInput(key) {
      this.value = (this.value + key).slice(0, 6);
      if (this.value.length == 6) {
        walletPay(this.order_id, this.value)
          .then(res => {
            if (res.status == "1") {
              Toast(res.info);
              setTimeout(() => {
                this.$router.replace({
                  name: "myOrderDetail",
                  query: { order_no: this.order_no }
                });
              }, 1000);
            } else if (res.status == "11") {
              Toast(res.info);
              if (res.telephone == "") {
                setTimeout(() => {
                  this.$router.replace({
                    name: "myPhone"
                  });
                }, 1000);
              } else {
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
    hidePasswordInput() {
      this.showPasswordInput = false;
      this.payShow = true;
    },
    selectAddress() {
      if (this.$route.query.getRice) {
        this.$router.push({
          name: "myLocalhost",
          query: {
            getRice: this.$route.query.getRice
          }
        });
      } else if (this.$route.query.goodsId) {
        this.$router.push({
          name: "myLocalhost",
          query: {
            goodsId: this.$route.query.goodsId,
            sku_id: this.$route.query.sku_id,
            goods_nums: this.$route.query.goods_nums
          }
        });
      } else if (this.$route.query.cartIds) {
        this.$router.push({
          name: "myLocalhost",
          query: {
            cartIds: this.$route.query.cartIds
          }
        });
      }
    }
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";

.placeOrder {
  padding-top: 50px;
  padding-bottom: 50px;
  .van-contact-card {
    background-color: transparent;
  }
  .row .card-desc {
    // color: $ashColor;
  }
  .van-submit-bar {
    bottom: 0;
    .van-submit-bar__text {
      text-align: left;
      padding-left: 15px;
    }
  }
  .row .card-title {
    line-height: 24px;
    height: 24px;
  }
  .cart-top {
    height: 38px;
    line-height: 38px;
    padding: 0 10px;
    .van-checkbox {
      float: left;
      vertical-align: middle;
    }
    & > span {
      float: right;
      text-align: right;
      padding-right: 5px;
      .van-icon {
        vertical-align: middle;
        color: #aaa;
        font-size: 20px;
      }
    }
  }
  .cart-goods {
    padding-bottom: 62px;
    .cart-goods-item {
      position: relative;
      .van-checkbox__icon {
        display: none;
      }
      .van-checkbox__label {
        width: 100%;
        padding: 0 15px;
        padding-top: 10px;
        margin-left: 0;
        box-sizing: border-box;
        & > .van-row {
          margin: 3px;
          // box-shadow: 0px 2px 3px 2px #f5f5f5;
        }
      }
    }
  }
  .cart-submit {
    .van-checkbox {
      margin-left: 10px;
    }
    .van-submit-bar__price {
      color: @priceColor;
      font-size: 15px;
    }
  }
  .van-submit-bar .van-button {
    background-color: @activeColor;
    border: 1px solid @activeColor;
  }
  .van-stepper__minus,
  .van-stepper__plus,
  .van-stepper__minus--disabled,
  .van-stepper__plus--disabled {
    border: none;
    background-color: #fff;
  }
  .van-stepper__input {
    border: none;
    font-weight: bold;
    background-color: #f5f5f5;
  }
  .van-contact-card__content {
    text-align: left;
    background-color: #fff;
    margin: 15px;
  }
  .row {
    // margin: 15px;
    margin-top: 15px;
    margin-bottom: 0;
    // box-shadow:0px 2px 10px 4px #eaeaea;
  }
  .van-contact-card::after {
    content: "";
    display: block;
    height: 6px;
    background: -webkit-repeating-linear-gradient(
      135deg,
      #f68e8f 0,
      #f68e8f 20%,
      #fff 0,
      #fff 25%,
      #90c9f6 0,
      #90c9f6 45%,
      #fff 0,
      #fff 50%
    );
    background: repeating-linear-gradient(
      -45deg,
      #f68e8f 0,
      #f68e8f 20%,
      #fff 0,
      #fff 25%,
      #90c9f6 0,
      #90c9f6 45%,
      #fff 0,
      #fff 50%
    );
    background-size: 180px;
  }
  .van-contact-card--edit .van-contact-card__icon {
    vertical-align: bottom;
  }
  .van-card {
    margin: 15px;
    background-color: #ffffff;
    padding: 15px;
    height: auto;
    margin-top: 0;
  }
  .van-card__thumb {
    /*height: auto;*/
  }
  .van-card__thumb img {
    display: none;
  }
  .van-cell-group {
    margin-bottom: 15px;
  }
  .Contacts {
    font-size: 14px;
    padding-bottom: 5px;
    .van-cell__title {
      padding-left: 21px;
      font-size: 14px;
    }
    .van-cell__value {
      font-size: 14px; /*font-weight: 700;*/
    }
  }
  .van-cell__value--alone {
    font-size: 14px; /*line-height: 16px;*/
    word-wrap: break-word;
    word-break: break-all;
  }
  .total {
    // box-shadow:0px 2px 10px 4px #eaeaea;
    // margin:15px;
    margin-top: 15px;
    .van-cell-group {
      margin: 0;
    }
    margin-bottom: 15px;
    .van-hairline--top-bottom::after,
    .van-cell:not(:last-child)::after {
      // border: none;
      border-top: none;
    }
    .total_panel {
      font-size: 0.28rem;
      .van-cell {
        // padding-bottom: 0;
        .van-cell__value {
          color: @titleColor;
        }
      }
    }
    .total_pane2 {
      font-size: 0.28rem;
      .van-cell {
        // padding-top: 0;
        .van-cell__value {
          color: @titleColor;
        }
      }
    }
  }
  .buy-shop-list {
    background-color: #ffffff;
    padding: 0 15px;
  }
  .row {
    .card-footer {
      left: auto !important;
      right: 0;
      .card-footer-price {
        color: @titleColor;
        font-size: 15px;
      }
    }
    .card-number {
      right: auto;
      left: 110px;
      color: @descColor;
      font-weight: 400;
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
}
@media screen and (max-width: 360px) {
  .placeOrder .Contacts .van-cell__title,
  .placeOrder .Contacts .van-cell__value {
    font-size: 14px;
  }
  .placeOrder .van-popup .van-cell__value {
    flex: 2;
  }
  .placeOrder .van-popup .van-cell__title {
    flex: 17;
  }
  .placeOrder .van-popup .van-cell__title img {
    margin-right: 0px;
  }
  .placeOrder .van-popup .van-cell__title .van-cell-text {
    display: inline-block;
  }
}
</style>