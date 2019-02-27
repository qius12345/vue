<template>
    <div class="shopEvaluateList">
        <van-cell-group class="shopEvaluate">
            <div class="evaluateBtn">
                <van-button @click="getEvaluateInfo($event),''" type="default" class="activeBtn">全部{{comment_nums}}</van-button>
                <van-button @click="getEvaluateInfo($event,'is_new')" type="default">最新</van-button>
                <van-button @click="getEvaluateInfo($event,'is_good')" type="default">好评{{comment_good_nums}}</van-button>
                <van-button @click="getEvaluateInfo($event,'is_bed')" type="default">差评{{comment_bed_nums}}</van-button>
                <van-button @click="getEvaluateInfo($event,'is_pic')" type="default">有图{{comment_pic_nums}}</van-button>
            </div>
            <van-cell-group v-for="(evaluate,index) in commentInfo" :key="index">
                <van-cell :value="evaluate.add_time" center>
                    <template slot="title">
                    <div class="headPortrait">
                        <img :src="evaluate.user_headlogo" alt="" width="100%">
                    </div>
                    <span class="van-cell-text">{{ evaluate.username }}</span>
                    <van-rate v-if="evaluate.quality_star != ''" readonly v-model="evaluate.quality_star" />
                    </template>
                </van-cell>
                <van-cell class="shopEvaluateText" :value="evaluate.content" />
                <van-row gutter="10" class="shopEvaluateImg">
                    <van-col v-for="(pic,index) in evaluate.pic_list" :key="index" span="6"><img :src="pic" width="100%" alt=""></van-col>
                </van-row>
            </van-cell-group>
        </van-cell-group>
    </div>
</template>


<script>
import { getEvaluateList } from "@/api/home/index.js";
import { Dialog, Toast } from "vant";

export default {
  name: "shopEvaluateList",
  components: {},
  data() {
    return {
      id: 1,
      shopEvaluateRank: 3,
      commentInfo: [],
      comment_pic_nums: "",
      comment_nums: "",
      comment_pic_nums: "",
      comment_bed_nums: "",
      comment_good_nums: ""
    };
  },
  methods: {
    getGoodsData(name) {
        let is_pic,is_new,is_bed,is_good;
      if(name == 'is_new'){
        is_new = 1;
      }
      if(name == 'is_good') {
        is_good = 1;
      }
      if(name == 'is_bed') {
        is_bed = 1 ;
      }
      if(name == 'is_pic') {
        is_pic = 1;
      }

      getEvaluateList(is_pic,is_new,is_bed,is_good)
        .then(res => {
          this.commentInfo = res.comment_list;

          this.comment_pic_nums = res.comment_pic_nums;
          this.comment_nums = res.comment_nums;
          this.comment_bed_nums = res.comment_bed_nums;
          this.comment_good_nums = res.comment_good_nums;

        })
        .catch(err => {
          this.commentInfo = [];
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    getEvaluateInfo(el,name) {
      el.currentTarget.parentNode.childNodes.forEach(function(val) {
        if (val.classList != undefined) {
          val.classList.remove("activeBtn");
        }
      });
      el.currentTarget.classList.add("activeBtn");

      this.getGoodsData(name);
    }
  },
  mounted() {},
  created() {
    this.getGoodsData();
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";

.shopEvaluateList {
  //   background-color: #ffffff;
  padding-top: 46px;
  .evaluateBtn {
    padding: 0 15px;
    padding-top: 20px;
    padding-bottom: 10px;
    .van-button--warning {
      background-color: @infoColor;
      border: @infoColor;
      margin-bottom: 10px;
      height: 30px;
      line-height: 30px;
    }
    .van-button--default {
      background-color: #f3f3f3;
      border: #f3f3f3;
      margin-bottom: 10px;
      height: 30px;
      line-height: 30px;
    }
    .activeBtn {
      background-color: @infoColor;
      border: @infoColor;
      color: #ffffff;
    }
  }
  // padding-top: 46px;
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
      padding-bottom: 15px;
      // border-bottom: 1px solid #eeeeee;
    }
    .van-cell__title {
      flex: 3;
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
      display: inline-block;
      width: 30px;
      height: 30px;
      vertical-align: middle;
      margin-right: 5px;
    }
    .van-rate {
      display: inline-block;
      vertical-align: middle;
      margin-left: 10px;
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
