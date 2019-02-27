<template>
    <div class="messageDetails">
        <div class="messageDetails-title">
            <van-cell-group v-cloak>
                <van-cell :title="'返利说明：'+mesData.describe" />
                <van-cell :title="'返利时间：'+mesData.add_time" />
                <van-cell :title="'返利类型：'+mesData.type" />
            </van-cell-group>
        </div>
        <div class="messageDetails-lists">
            <van-cell title="返利记录" />
            <ul>
              <!-- <li v-for="(item,index) in mesData.info" :key="index" :class="item.type == 2 ? 'active' : (item.type == 1 ? '' : 'onTime')">
                    <van-row>
                        <van-col span="6"><span v-if="item.type != 1" >{{ item.type != 1 ? item.key : ''}}</span> <img v-if="item.type == 1" :src="tick" alt=""></van-col>
                        <van-col span="10">{{ item.title }}</van-col>
                        <van-col span="8">{{ item.str}}</van-col>
                    </van-row>
                </li> -->
                <li v-for="(data,index) in mesData.info" :key="index" :class="data.type == 2 ? 'active' : (data.type == 1 ? '' : 'onTime')">
                    <van-row @click.native="$router.push({name:'myOrderLogistics',query:{'record_id' : data.record_id}})">
                        <van-col span="6"><span v-if="data.type != 1" >{{ data.type != 1 ? data.key : ''}}</span> <img v-if="data.type == 1" :src="tick" alt=""></van-col>
                        <van-col span="10">{{ data.title }}</van-col>
                        <van-col span="8">{{data.str}}</van-col>
                    </van-row>
                </li>
            </ul>
        </div>
        
    </div>
</template>


<script>
import { Dialog, Toast } from "vant";
import messageTx from "_img_/home/index_message_tx.png";
import shopSm from "_img_/shop/shop_min.jpg";
import tick from "_img_/home/message_details_tick.png";
import { getMessageFreeDetail,getMessageFreeSh,getMessageFreeWl  } from '@/api/message/index.js'

export default {
  name: "messageDetails",
  components: {},
  data() {
    return {
      active: 0,
      mesId: 0,
      mesData: [],
      tick: tick,
      messageTx: messageTx,
    };
  },
  methods: {
      getMessageFreeDetail() {
          this.mesId=this.$route.query.give_id;
            getMessageFreeDetail(this.mesId).then((res) =>{
            if(res.status == "1"){
                this.mesData = res.list
            }else{
                Toast("暂无数据")
                this.mesData = []
            }
            console.log(res)
            }).catch((err) =>{
            Toast(err.info ? err.info : '获取数据失败');
            this.mesData = []
        })
      }
  },
  created() {
      this.getMessageFreeDetail();
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.messageDetails {
  padding-top: 46px;
  [v-cloak]{display:none;}
  .messageDetails-title {
    .van-cell:not(:last-child)::after {
      margin: 0;
      border-bottom: none;
    }
    .van-cell-group {
      padding: 10px 15px;
      .van-cell {
        padding: 0;
      }
      .van-cell:not(:last-child) {
        padding-bottom: 10px;
      }
    }
  }

  .messageDetails-lists {
    background-color: #ffffff;
    margin-top: 10px;
    .van-cell:not(:last-child)::after {
      margin: 0;
    }
    h4 {
      margin: 0;
    }
    ul {
      li {
        margin: 0 15px;
        height: 42px;
        line-height: 42px;
       
        .van-col--6 {
          img {
            width: 17px;
            height: 17px;
          }
          span {
            display: inline-block;
            width: 14px;
            height: 14px;
            line-height: 14px;
            text-align: center;
            border: 1px solid @titleColor;
            border-radius: 50%;
            font-size: 14px;
          }
        }
        .van-col--10 {
          font-size: 14px;
        }
        .van-col--8 {
          text-align: right;
          color: @infoColor;
        }
      }
      li:not(:last-child){
        border-bottom: 1px solid #eeeeee;
      }
      .onTime {
        .van-col--6 {
          span {
            border: 1px solid @descColor;
            color: @descColor;
          }
        }
        .van-col--10 {
          font-size: 14px;
          color: @descColor;
        }
        .van-col--8 {
          color: @descColor;
        }
      }
    }
  }
}
</style>
