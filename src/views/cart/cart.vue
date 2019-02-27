<template>
    <div class="cart">
        <div class="cart-main" v-if="cartGoodsList.length > 0">
            <van-checkbox-group class="cart-goods" v-model="selectCartGoodsIds" @change="changeSelectCartGoods">
                    <van-swipe-cell :right-width="65" v-for="item in cartGoodsList" :key="item.cart_id" ref="swipeCell">
                        <van-checkbox class="cart-goods-item" :name="item.cart_id">
                            <div class="van-checkbox-label">
                                <list-item :imgArea="[90,90]" @changeCartStepper="showCartStepper" :cartId="item.cart_id" :imgUrl="item.goods_logo" :title="item.goods_name" :desc="item.goods_desc" :price="item.goods_price" :num="item.goods_nums" />
                            </div>
                        </van-checkbox>
                        <span slot="right" class="right" @click="onClose(item.cart_id)">删除</span>
                    </van-swipe-cell>
            </van-checkbox-group>

            <van-cell-group class="cart-total-prices">
                <van-cell title="商品总价" :value="'￥'+totalPrice2" />
                <!-- <van-cell title="运费" value="包邮" /> -->
            </van-cell-group>

            <van-submit-bar :price="totalPrice" :disabled="!selectCartGoodsIds.length" :button-text="'结算' + (selectCartGoodsIds.length > 0 ? `(${selectCartGoodsIds.length})` : '')" @submit="handleOrderSubmit" :loading="submitLoading">
                <div @click="selectAllCartGoods()"><van-checkbox v-model="selectCartGoodsAll" class="van-checkbox-all">全选</van-checkbox></div>
            </van-submit-bar>
        </div>
        <div class="nummCart" v-else>
            <img :src="nullCart" alt="">
            <p>购物车还是空的哦</p>
        </div>
    </div>
</template>

<script>
import ListItem from "@/components/list-item";
import goodsImg from "_img_/cart/goods_img.jpg";

import nullCart from "_img_/cart/nullCart.png";

import { getCartList, delCart, changeCartNum } from "@/api/cart/index.js";
import { cartBuy } from "@/api/order/index.js";
import { Toast, Dialog } from "vant";
export default {
  name: "cart",
  components: {
    ListItem
  },
  data() {
    return {
        loading:true,
      cartGoodsList: [],
      submitLoading: false,
      selectCartGoodsAll: false,
      showCartStepperModel: false,
      selectCartGoodsIds: [],
      currentCartGoodsQuantity: "",
      nullCart: nullCart
    };
  },
  computed: {
    totalPrice() {
      return this.cartGoodsList.reduce(
        (total, item) =>
          total +
          (this.selectCartGoodsIds.indexOf(item.cart_id) !== -1
            ? Number(item.goods_allprice * 100)
            : 0),
        0
      );
    },
    totalPrice2() {
      return this.cartGoodsList.reduce(
        (total, item) =>
          total +
          (this.selectCartGoodsIds.indexOf(item.cart_id) !== -1
            ? Number(item.goods_allprice)
            : 0),
        0
      );
    }
  },
  methods: {
    selectAllCartGoods() {
      if (this.selectCartGoodsAll) {
        this.selectCartGoodsAll = true;
        this.selectCartGoodsIds = this.cartGoodsList.map(el => el.cart_id);
      } else if (!this.selectCartGoodsAll) {
        this.selectCartGoodsAll = false;
        this.selectCartGoodsIds = [];
      }
    },
    changeSelectCartGoods(selectCartGoodsIds) {
      this.selectCartGoodsIds = selectCartGoodsIds;
      if (
        this.selectCartGoodsIds.length == this.cartGoodsList.length &&
        this.selectCartGoodsIds.length != 0
      ) {
        this.selectCartGoodsAll = true;
      } else {
        this.selectCartGoodsAll = false;
      }
    },
    handleOrderSubmit() {
      var cartIds = "-" + this.selectCartGoodsIds.join("-") + "-";
      cartBuy(3, "", "", "", cartIds)
        .then(res => {
          if (res.status == 1) {
            this.$router.push({ name: "buy", query: { cartIds: cartIds } });
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : '获取数据失败');
        });
    },
    showCartList() {
      getCartList()
        .then(res => {
        this.loading = false;
        if(!this.loading){
            this.$toast.clear();
        }
          if (res.status == 1) {
            this.cartGoodsList = res.cart_list_1;
          }
        })
        .catch(err => {
          this.cartGoodsList = [];
          Toast(err.info ? err.info : '获取数据失败');
        });
    },
    deleteCart() {},
    onClose(cart_id) {
      Dialog.confirm({
        message: "确定删除吗？"
      }).then(() => {
        delCart(cart_id)
          .then(res => {
            if (res.status == "1") {
              this.showCartList();
              Toast(res.info);
              this.$router.go(0);
            } else {
              Toast(res.info ? res.info : "删除失败");
            }
          })
          .catch(error => {
            Toast(error.info ? error.info : "删除失败");
          });
      });
    },
    showCartStepper(stepperNum, cartId) {
      // console.log(oldStepperNum);
      if (stepperNum >= 1) {
        changeCartNum(cartId, stepperNum)
          .then(res => {
            if (res.status == 1) {
              Toast(res.info);
              this.showCartList();
            } else {
              Toast(res.info ? res.info : "修改数量失败");
            }
          })
          .catch(err => {
            Toast(err.info ? err.info : "修改数量失败");
          });
      }
    }
  },
  created() {
    this.showCartList();
    if(this.loading){
        this.$toast.loading({
            mask: true,
            message: "加载中" + "...",
            loadingType: "spinner",
            duration: 0
      });
    }
  },
  activated() {
    // this.showCartList();
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.cart {
  padding-top: 46px;
  .van-submit-bar {
    bottom: 50px;
  }
  .van-button--danger {
    color: #ffffff;
    background-color: @activeColor;
    border: @activeColor;
  }
  .cart-goods-item {
    background-color: #ffffff;
    border-bottom: 1px solid #e6e6e6;
    // padding: 0 15px;
    position: relative;
    text-align: left;
    padding-left: 15px;
  }
  .cart-goods-item:last-child {
    border-bottom: none;
  }
  .van-submit-bar__bar {
    padding-left: 15px;
  }
  .van-checkbox__label {
    width: 88%;
  }
  .van-checkbox-all {
    .van-checkbox__label {
      width: auto;
    }
  }
  .van-cell__title {
    text-align: left;
  }
  .cart-total-prices {
    margin-top: 10px;
  }
  .right {
    color: #ffffff;
    font-size: 15px;
    width: 65px;
    height: 111px;
    display: inline-block;
    text-align: center;
    line-height: 111px;
    background-color: #f44;
  }
  .van-submit-bar__price {
    color: @priceColor;
  }
  .nummCart{
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
            width: 120px;
        }
  }
}
</style>
