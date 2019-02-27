<template>
    <div class="shopDetails">
        <div class="swiper-box">
            <van-swipe :autoplay="3000" :height="220" @change="handleChangeBanner">
                <van-swipe-item v-for="(image ,index) in banner" :key="index"><img :src="image" alt="" width="100%"></van-swipe-item>
            </van-swipe>
            <div class="banner_point">
                {{activeScroll}} / {{bannersScroll}}
            </div>
        </div>

        <van-cell-group class="shop-msg">
            <van-cell class="shopTitle" :title="goodsName" :label="goodsDesc" />
            <van-cell class="shopPrice" :value="'已售'+virtualSales">
                <template slot="title">
                    <span class="van-cell-text"><i>￥</i>{{ goodsPrice }}</span>
                </template>
            </van-cell>
        </van-cell-group>

         <van-cell-group class="share" v-if="$route.query.shopId == 2" @click.native="$router.push({name:'sharePage',query:{id:$route.query.shopId,pid:pid}})">
            <van-cell class="share-title" icon="shop">
                <template slot="icon">
                    <span class="share-icon"><img :src="shareIcon" alt=""></span>
                </template>
                <template slot="title">
                    <span class="van-cell-text share-headline">分享有礼</span><span class="share-text">赶快分享，邀请好友一起来</span>
                </template>
            </van-cell>
            <van-cell class="share-desc" title="分享6位好友成为代言人，一年内每月可免费享受10斤大米"/>
        </van-cell-group>


        <van-cell-group class="shopEvaluate">
            <van-cell :title="'用户评价('+comment_nums+')'" is-link to="shopEvaluateDetail" :value="percent" />
            <van-cell-group v-for="(evaluate,index) in commentInfo" :key="index">
                <van-cell :value="evaluate.add_time" center>
                    <template slot="title">
                    <div class="headPortrait">
                        <img :src="evaluate.user_headlogo" alt="" width="100%">
                    </div>
                    <span class="van-cell-text">{{evaluate.username}}</span>
                    <van-rate v-if="evaluate.quality_star != ''" readonly v-model="evaluate.quality_star" />
                    </template>
                </van-cell>
                <van-cell class="shopEvaluateText" :value="evaluate.content" />
                <van-row gutter="10" class="shopEvaluateImg" v-if="evaluate.pic_list.length > 0">
                    <van-col v-for="(pic,index) in evaluate.pic_list" :key="index" span="6"><img :src="pic" width="100%" alt=""></van-col>
                </van-row>
            </van-cell-group>
        </van-cell-group>

        <van-cell-group class="shop-info">
            <van-cell class="shop-info-headline" title="产品详情"/>
            <van-cell v-for="(param,index) in goodsParam" :key="index" class="shop-hairline">
                <template slot="title">
                    <span class="van-cell-text shop-info-label">{{ param.key }}</span><span class="shop-info-text">{{ param.value }}</span>
                </template>
            </van-cell>
        </van-cell-group>

        <van-row class="shop-imgs" v-html="goodsDetailImages" />

        <van-sku
            v-model="showCustomAction"
            stepper-title="数量"
            hide-stock
            :sku="sku"
            :goods="goods_info"
            :goods-id="id"
            reset-stepper-on-hide
            close-on-click-overlay
            :show-add-cart-btn='showAddCartBtn'
            @buy-clicked="onBuyClicked"
        >
            <!-- 自定义 sku-header-price -->
            <!-- <template slot="sku-header" slot-scope="props">
            </template> -->
            <template slot="sku-actions" slot-scope="props">
                <div class="van-sku-actions">
                <!-- 直接触发 sku 内部事件，通过内部事件执行 onBuyClicked 回调 -->
                    <van-button :type="isBuy ? 'primary' : 'warning'" bottom-action @click="props.skuEventBus.$emit('sku:buy')">{{isBuy ? '立即购买' : '加入购物车'}}</van-button>
                </div>
            </template>
        </van-sku>

        <van-goods-action>
            <van-goods-action-mini-btn icon="cart" @click="$router.push({name: 'cart'})" :info="cartNum" />
            <van-goods-action-big-btn @click="showSku(false)" text="加入购物车" />
            <van-goods-action-big-btn @click="showSku(true)" text="立即购买" primary />
        </van-goods-action>


    </div>
</template>


<script>
// import banner from "_img_/home/index_banner.jpg";
import indexImg from "_img_/home/index_img.jpg";
import shareIcon from "_img_/shop/share_icon.png";
import shopSm from "_img_/shop/shop_min.jpg";
import { getGoodsInfo, addCart, buy } from "@/api/home/index.js";
import { getUserInfo } from "@/api/my/userinfo.js";
import { Dialog, Toast } from "vant";

export default {
  name: "shopDetails",
  components: {},
  data() {
    return {
      banner: [],
      mainImg: indexImg,
      bannersScroll: 3,
      activeScroll: 1,
      shareIcon: shareIcon,
      showAddCartBtn: false,
      showCustomAction: false,
      sku: {},
      goods_info: {
        // 商品标题
        title: "",
        // 默认商品 sku 缩略图
        picture: ""
      },
      id: "",
      goodsParam: [],
      goodsName: "",
      goodsDesc: "",
      goodsPrice: "",
      virtualSales: "",
      shareInfo: {},
      isBuy: false,
      goodsDetailImages: "",
      cartNum: "",
      pid: "",
      commentInfo: [],
      comment_nums: "",
      shopEvaluateRank: 0,
      percent: ""
    };
  },
  methods: {
    handleChangeBanner(index) {
      this.activeScroll = index + 1;
    },
    confirmBuy(sku) {},
    onBuyClicked(sku) {
      console.log(sku);
      if (this.isBuy) {
        this.$router.replace({
          name: "buy",
          query: {
            goodsId: sku.goodsId,
            goods_nums: sku.selectedNum,
            sku_id: ""
          }
        });
      } else {
        this.showCustomAction = false;
        addCart(sku.goodsId, sku.selectedNum, "")
          .then(res => {
            if (res.status == 1) {
              this.showCustomAction = false;
              Toast(res.info);
              this.getCartNum();
            } else {
              Toast(res.info ? res.info : "购物车加入失败");
            }
          })
          .catch(err => {
            Toast("购物车加入失败");
          });
      }
    },
    showSku(isBuy) {
      this.showCustomAction = true;
      if (isBuy) {
        this.isBuy = true;
      } else {
        this.isBuy = false;
      }
    },
    getGoodsData() {
      getGoodsInfo(this.id)
        .then(res => {
          if (res.status == 1) {
            this.banner = res.banner;
            this.goodsParam = res.goods_attr;
            this.goodsName = res.goods_name;
            this.goodsDesc = res.goods_desc;
            this.goodsPrice = res.goods_price;
            this.virtualSales =
              parseInt(res.virtual_sales) + parseInt(res.sales);
            this.bannersScroll = this.banner.length;
            this.shareInfo = res.share_info;
            this.sku = res.sku;
            this.goods_info.title = res.goods_name;
            this.goods_info.picture = res.goods_logo;
            this.sku.price = res.goods_price;
            this.goodsDetailImages = res.goods_detail_h5;
            this.pid = res.pid;
            this.commentInfo = res.comment_info.comment_list;
            this.comment_nums = res.comment_info.comment_nums;
            this.percent = res.percent;
            
          } else {
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    getCartNum() {
      getUserInfo()
        .then(res => {
          this.cartNum = res.cart_nums == 0 ? null : res.cart_nums;
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    goShare(){
        // this.
        window.location.href = 'https://www.lekangran.com/Wx/#/sharePage?id=' + this.$route.query.shopId + '&pid=' + this.pid;
    }
  },
  mounted() {
    if (this.$route.query.order) {
      this.showCustomAction = true;
      this.isBuy = true;
    }
  },
  created() {
    this.id = this.$route.query.shopId;
    this.getGoodsData();
    this.getCartNum();
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";

.shopDetails {
  //   background-color: #ffffff;
  padding-top: 46px;
  .swiper-box {
    height: 220px;
    // padding-bottom: 40px;
    position: relative;
    .van-swipe {
      position: static;
    }
    .van-swipe__indicators {
      display: none;
    }
  }
  .van-goods-action-mini-btn {
    width: 40%;
  }
  .van-cell {
    text-align: left;
  }
  .banner_point {
    position: absolute;
    bottom: 15px;
    right: 15px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    width: 36px;
    height: 20px;
    line-height: 20px;
    color: #ffffff;
    font-size: 12px;
    text-align: center;
    /*padding: 10px;*/
  }
  .shopTitle {
    padding-bottom: 0;
    .van-cell__title {
      font-size: 15px;
    }
    .van-cell__label {
      font-size: 13px;
      line-height: 26px;
      color: @descColor;
    }
  }
  .shopPrice {
    padding-top: 0;
    .van-cell__title {
      color: @priceColor;
    }
    .van-cell__value {
      font-size: 14px;
      color: @descColor;
    }
    .van-cell-text {
      font-weight: 700;
      font-size: 16px;
      i {
        font-style: normal;
        font-size: 12px;
        margin-right: -2px;
      }
    }
  }
  .shop-msg {
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
  }
  .share {
    margin-bottom: 10px;
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
    .van-hairline--top-bottom::after {
      border-width: 0;
    }
    .van-cell {
      background-color: #fff5f1;
      padding: 15px;
    }
    .share-title {
      padding-bottom: 0;
      .share-text {
        font-size: 12px;
        font-weight: 700;
      }
      .share-headline {
        color: @priceColor;
        font-size: 16px;
        margin-right: 5px;
        font-weight: 700;
      }
      .share-icon {
        display: inline-block;
        width: 18px;
        height: 18px;
        margin-right: 10px;
        position: relative;
        top: 2px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
    .share-desc {
      .van-cell__title {
        font-size: 13px;
        color: @titleColor;
      }
    }
  }
  .shopEvaluate {
    margin-bottom: 10px;
    .van-doc-demo-block {
      padding: 0 15px;
    }
    .van-doc-demo-block__title {
      padding-left: 0;
    }
    .van-row {
      padding: 0 15px;
    }
    .van-col {
      color: #fff;
      font-size: 13px;
      text-align: center;
      background-clip: content-box;
    }
    .van-cell__value {
      color: #999999;
    }
    .shopEvaluateText {
      .van-cell__value {
        color: #333333;
      }
    }
    .shopEvaluateImg {
      padding-bottom: 10px;
      // border-bottom: 1px solid #eeeeee;
      .van-col--6 {
        margin-bottom: 5px;
      }
    }
    .van-cell__title {
      flex: 3;
      .van-cell-text {
        height: 14px;
        line-height: 14px;
      }
    }
    .van-cell__value {
      flex: 2;
    }
    .van-hairline--top-bottomnot:not(:last-child)::before {
      content: " ";
      position: absolute;
      pointer-events: none;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      -webkit-transform: scale(0.5);
      transform: scale(0.5);
      border: 0 solid #eee;
    }
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
    .headPortrait {
      // display: inline-block;
      width: 32px;
      height: 32px;
      // vertical-align: middle;
      margin-right: 5px;
      float: left;
      position: relative;
      top: 5px;
    }
    .van-rate {
      // display: inline-block;
      // vertical-align: middle;
      // margin-left: 10px;
      height: 16px;
      line-height: 16px;
      .van-rate__item {
        width: 16px !important;
      }
    }
    .shopEvaluateText {
      padding-top: 0;
    }
  }
  .shop-info {
    margin-bottom: 10px;
    .van-cell:not(:last-child)::after {
      margin-right: 15px;
      border-bottom-style: dashed;
    }
    .shop-hairline {
      .van-cell__title {
        position: relative;

        .shop-info-label {
          position: absolute;
          left: 0;
          top: 0;
          color: @descColor;
        }
        padding-left: 80px;
      }
    }
    .shop-info-headline {
      .van-cell__title {
        font-size: 15px;
        color: @titleColor;
        padding: 0;
      }
    }
  }
  .shop-imgs {
    img {
      width: 100%;
      outline-width: 0px;
      vertical-align: top;
    }
  }
  .van-button--bottom-action {
    background-color: #ffa914;
  }
  .van-button--bottom-action.van-button--primary {
    background-color: @activeColor;
  }
  .van-sku-actions {
    padding: 0 15px;
    margin: 118px 0 30px 0;
  }

  .van-sku-container {
    text-align: left;
    .van-sku-header__img-wrap {
      margin: 0;
    }
    .van-sku-group-container {
      display: none;
    }
    .van-sku-messages {
      padding-bottom: 0;
    }
    .van-button--bottom-action.van-button--primary {
      background-color: @activeColor;
      padding: 0;
      border-radius: 5px;
    }
    .van-sku-actions {
      padding: 0 15px;
      margin: 118px 0 30px 0;
    }
    .van-sku-row__item--active {
      background-color: @priceColor;
      border-color: @priceColor;
    }
    .van-sku-header__goods-info {
      .van-sku__goods-price {
      }
    }
    .sku_desc {
      position: absolute;
      left: 100px;
      top: 50px;
      p {
        margin: 0;
        padding: 0;
        font-size: 12px;
      }
    }
  }
}
</style>
