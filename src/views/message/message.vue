<template>
    <div class="message">
        <van-tabs v-model="active" :line-width="80">

            <van-tab class="free-rice">
                <div slot="title">
                    <span>免费大米</span>
                    <div class="van-info">{{riceMsg}}</div>
                </div>
                <van-list
                  v-model="loading_f"
                  :finished="finished_f"
                  :offset="offset"
                  @load="onLoad_f"
                >
                <van-cell-group v-for="(free,index) in mesFree" :key="index">
                    <van-cell :value="'￥'+free.money" :title="free.title" class="free-rice-title" @click.native.stop="$router.push({name: 'messageDetails', query: { give_id: free.give_id }})" />
                    <van-cell class="free-rice-dec" :title="free.desc" :value="free.receive_count+'/'+free.total_count" @click.native.stop="$router.push({name: 'messageDetails', query: { give_id: free.give_id }})" />
                    <van-icon name="arrow" />
                </van-cell-group>
                </van-list>
            </van-tab>

            <van-tab class="health-delivery">
                <div slot="title">
                    <span>健康传递</span>
                    <div class="van-info">{{healthMsg}}</div>
                </div>
                <van-list
                  v-model="loading"
                  :finished="finished"
                  :offset="offset"
                  @load="onLoad"
                >
                    <div class="health-delivery-main" v-for="(item,index) in mesHealth" :key="index" @click="$router.push({name:'myShareDetail',query:{shareId : item.share_id}})" >
                      <van-cell-group>
                          <van-cell title="分享成功" :value="item.add_time" />
                      </van-cell-group>
                      <van-card
                          :title="item.goods_name"
                          :desc="item.realname" 
                          :price="item.member_type"
                          currency=""
                          :thumb="item.head_img"
                          >
                      </van-card>
                      <div class="health-delivery-footer">
                          <p>{{item.desc}}</p>
                          <p>订单编号 {{item.order_no}}<span class="status">{{item.order_status}}</span></p>
                      </div>
                  </div>
                </van-list>
            </van-tab>
            <van-tab class="order-message">
                <div slot="title">
                    <span>订单消息</span>
                    <div class="van-info">{{orderMsg}}</div>
                </div>
                <van-list
                  v-model="loading_a"
                  :finished="finished_a"
                  :offset="offset"
                  @load="onLoad_a"
                >
                  <van-row class="order-item" v-for="(item, index) in mesOrder" :key="index" @click.native.stop="$router.push({name: 'myOrderDetail', query: {order_no: item.order_no}})">
                      <van-cell-group>
                          <van-cell :value="item.add_time" class="dealing">
                              <template slot="title">
                                  <span>{{ item.title }}</span>
                              </template>
                          </van-cell>
                      </van-cell-group>
                      <van-row class="order-item-list">
                          <list-item 
                          :imgArea="[78,78]" 
                          :imgUrl="item.goods_pic" 
                          :title="item.goods_name" 
                          :desc="item.order_no" 
                          :price="item.goods_price" 
                          :number="item.goods_nums"  />
                      </van-row>
                  </van-row>
                </van-list>
            </van-tab>
        </van-tabs>
    </div>
</template>


<script>
import { Dialog, Toast } from "vant";
import ListItem from "@/components/list-item";
import messageTx from "_img_/home/index_message_tx.png";
import shopSm from "_img_/shop/shop_min.jpg";
import {
  getMessageFree,
  getMessageHealth,
  getMessageOrder
} from "@/api/message/index.js";
import { getMessageCount } from "@/api/home/index.js";
export default {
  name: "message",
  components: {
    ListItem
  },
  data() {
    return {
      active: 0,
      messageTx: messageTx,
      isLoadFinished: false,

      loading: false,
      finished_a: false,
      finished_f: false,

      finished: false,
      offset: 10,
      healthPage: 1,
      healthAllPage: 1,
      healthMark: true,

      loading_a: false,
      loading_f: false,

      orderPage: 1,
      orderAllPage: 1,
      orderMark: true,

      mesFree: [],
      mesHealth: [],
      mesOrder: [],

      riceMsg: "",
      healthMsg: "",
      orderMsg: ""
    };
  },
  methods: {
    getData() {},
    onLoad() {
      // 异步更新数据
      this.getHealth();
    },
    onLoad_a() {
      // 异步更新数据
      this.getOrder();
    },
    onLoad_f() {
      this.getMessageFree();
    },
    getHealth() {
      var $_this = this;
      if ($_this.healthMark == false) {
        return;
      }
      $_this.healthMark = false;
      if ($_this.healthPage > $_this.healthAllPage) {
        $_this.loading = false;
        $_this.finished = true;
        return;
      }
      var page = $_this.healthPage;
      getMessageHealth(page, 4)
        .then(res => {
          if (res.status == "1") {
            $_this.healthAllPage = res.all_page;
            var arr = res.share_list;
            $_this.mesHealth.push.apply($_this.mesHealth, arr);
            $_this.loading = false;
            $_this.healthPage++;
          } else {
            Toast("暂无数据");
            //$_this.mesHealth = []
          }
          $_this.healthMark = true;
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
          $_this.healthMark = true;
          //$_this.mesHealth = []
        });
    },
    getMessageCount() {
      getMessageCount()
        .then(res => {
          if (res.count1 != 0) {
            this.riceMsg = res.count1;
          }
          if (res.count2 != 0) {
            this.healthMsg = res.count2;
          }
          if (res.count3 != 0) {
            this.orderMsg = res.count3;
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    getOrder() {
      var $_this = this;
      if ($_this.orderMark == false) {
        return;
      }
      $_this.orderMark = false;
      if ($_this.orderPage > $_this.orderAllPage) {
        $_this.loading_a = false;
        $_this.finished_a = true;
        return;
      }
      var page = $_this.orderPage;
      getMessageOrder(page, 6)
        .then(res => {
          if (res.status == "1") {
            $_this.orderAllPage = res.all_page;
            var arr = res.list;
            $_this.mesOrder.push.apply($_this.mesOrder, arr);
            $_this.loading_a = false;
            $_this.orderPage++;
          } else {
            Toast("暂无数据");
            //$_this.mesOrder = []
          }
          $_this.orderMark = true;
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
          $_this.orderMark = true;
          //$_this.mesOrder = []
        });
    },
    getMessageFree() {
      getMessageFree()
        .then(res => {
          if (res.status == "1") {
            this.loading_f = false;
            this.finished_f = true;
            this.mesFree = res.list;
            console.log(this.mesFree);
          } else {
            Toast("暂无数据");
            this.mesFree = [];
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
          this.mesFree = [];
        });
    }
  },
  created() {
    // this.getMessageFree();
    this.getMessageCount();
    // this.getHealth();
    // this.getOrder();
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
body,
html {
  overflow-x: hidden;
}
.message {
  padding-top: 44px;
  .van-info {
    left: 80%;
    top: 0.4em;
    min-width: 1.2em;
    line-height: 1.2;
    border-radius: 0.6em;
  }
  .van-tabs--line {
    padding-top: 54px;
  }
  .van-card {
    background-color: #ffffff;
  }
  .free-rice {
    .free-rice-title {
      .van-cell__title {
        flex: 5;
      }
      position: static;
      padding-bottom: 0px;
      padding-top: 20px;
    }

    .free-rice-dec {
      padding-top: 0;
      padding-bottom: 20px;
    }
    .van-icon-arrow {
      position: absolute;
      right: 15px;
      top: 50%;
      -ms-transform: translate(0, -50%); /* IE 9 */
      -moz-transform: translate(0, -50%); /* Firefox */
      -webkit-transform: translate(0, -50%); /* Safari 和 Chrome */
      transform: translate(0, -50%);
      font-size: 16px;
      z-index: 2;
    }
    .van-cell__value {
      padding-right: 30px;
    }
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
    .van-hairline--top-bottom::after {
      border: none;
    }
    .van-cell-group {
      margin-bottom: 10px;
    }
  }
  .health-delivery {
    .van-card {
      margin: 0;
    }
    .health-delivery-main {
      padding-bottom: 10px;
      background-color: #ffffff;
      border-bottom: 1px solid #eeeeee;
      position: relative;
      .van-hairline--top-bottom::after {
        border: none;
      }
      .van-card {
        background-color: #fafafa;
        // padding: 13px 0;
        padding: 15px 15px 15px 105px;
        height: 110px;
      }
      .van-card__thumb {
        width: 78px;
        height: 78px;
        top: 15px;
      }
      .van-card__content {
        .van-card__row {
          font-size: 14px;
          .van-card__desc {
            font-size: 14px;
            color: @titleColor;
          }
        }
      }
      .health-delivery-footer {
        position: absolute;
        right: auto;
        left: 105px;
        bottom: 25px;
        width: 68%;
        p {
          margin: 0;
          font-size: 12px;
          color: @descColor;
          width: 100%;
          padding-right: 45px;
          .status {
            position: absolute;
            right: 0;
            bottom: 0;
            color: @titleColor;
            font-size: 14px;
          }
        }
      }
    }
  }
  .order-message {
    .order-item {
      &:not(:last-child) {
        // margin-bottom: 10px;
        background-color: #ffffff;
        padding-bottom: 10px;
      }
      .order-item-list {
        background-color: #fafafa;
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
          background-color: #fafafa;
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
          // color: $orderStatus;
        }
      }
      .van-cell__value {
        flex: 0 0 auto;
        min-width: 6em;
        color: @descColor;
      }
      .van-cell__title {
        font-size: 14px;
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
  }
}
@media (max-width: 320px) {
  .message .health-delivery .health-delivery-main .health-delivery-footer {
    width: 63%;
  }
}
</style>
