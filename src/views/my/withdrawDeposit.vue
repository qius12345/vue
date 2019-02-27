<template>
    <div class="withdrawDeposit">
        <div class="withdrawDeposit-main">
            <div class="account-direction">
                <van-row class="account-direction-content">
                    <van-col span="8">
                        <span class="account-direction-title">到账方向</span>
                    </van-col>
                    <van-col span="16">
                        <div class="wx-icon">
                            <img :src="wxIcon" alt="">
                        </div>
                        <div class="wx-text">
                            <span>微信</span>
                            <p>2小时内到账</p>
                        </div>
                    </van-col>
                </van-row>
                <h4>提现金额</h4>
                <div class="withdrawDeposit-money">
                    <i>￥</i><input v-model.number="moneyNum" type.number="text">
                </div>
                <p>收益余额￥<i>{{ withdrawMoney }}</i>,<span @click="moneyNum = withdrawMoney">全部提现</span></p>
            </div>    
            <van-button class="withdrawDeposit-btn" size="large" type="primary" @click="withdraw">提现</van-button>
        </div>
    </div>
</template>


<script>
import balanceDetails from "_img_/my/my_balance_details.png";
import balanceWithdraw from "_img_/my/my_balance_withdraw.png";
import wxIcon from "_img_/my/wx_icon.png";
import { withdraw } from "@/api/my/userinfo.js"
import { Toast } from "vant";
import { getWalletScoreList } from "@/api/my/walletscore.js";
export default {
  name: "withdrawDeposit",
  components: {},
  data() {
    return {
      wxIcon: wxIcon,
      moneyNum: '',
      withdrawMoney: ''
    };
  },
  methods: {
    getCode() {},
    withdraw(){
        if(this.moneyNum != ''){
            withdraw(this.moneyNum,).then((res)=>{
                if(res.status == '1'){
                    Toast(res.info);
                    setTimeout(()=>{
                        this.$router.push({name:'myBalance',query:{'withdraw' : 1}});  
                    },1000);
                }else{
                    Toast(res.info);
                }
            }).catch((err)=>{
                Toast(res.info);
            })
        }else{
            Toast('请输入提现金额');
            return false;
        }
    },
    getWalletScoreList() {
        getWalletScoreList().then((res) =>{
            if(res.status == "1"){
                this.withdrawMoney = res.wallet;
            }else{
                Toast(res.info)
            }
        }).catch((err) =>{
            Toast(err.info ? err.info : '获取数据失败');
        })
    }
    // 得到元素的焦点
    //这个事件没人触发
    // 解决方案：在vue中有一个事件叫做mounted，这个事件当vue中的代码叫做完成后会自动触发

  },
  created() {
      this.getWalletScoreList();
  },
  mounted() {
    // var bodyHeight = window.screen.height;
    // var myBalance =  document.getElementsByClassName('myBalance');
    // myBalance[0].style.height = bodyHeight + 'px';
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.withdrawDeposit {
padding-top: 56px;
  margin: 15px;
  margin-top:0;
  .withdrawDeposit-main {
    background-color: #ffffff;
    padding: 30px 22px;
    text-align: left;
    .account-direction {
      .account-direction-title {
        font-weight: 700;
        font-size: 14px;
      }
      .account-direction-content {
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 27px;
      }
      .withdrawDeposit-money {
        border-bottom: 1px solid #eeeeee;
        padding-bottom: 28px;
        position: relative;
        overflow: hidden;
        input {
          border: none;
          font-size: 30px;
          width: 100%;
          padding-left: 30px;
        }
        i {
          position: absolute;
          left: 0;
          top: -5px;
          font-size: 30px;
          font-style: normal;
        }
      }
      h4 {
        font-size: 14px;
      }
      p {
        color: #666666;
        margin: 21px 0;
        i {
          font-style: normal;
        }
        span {
          color: @activeColor;
          margin-left: 8px;
        }
      }
      .wx-icon {
        display: inline-block;
        vertical-align: top;
        margin-right: 5px;
        width: 14px;
        height: 14px;
        position: relative;
        top: 3px;
        img {
          width: 100%;
        }
      }
      .wx-text {
        text-align: left;
        display: inline-block;
        font-size: 14px;
        p {
          margin: 0;
          color: @infoColor;
          font-size: 11px;
          margin-top: 5px;
        }
      }
      .van-col--16 {
        text-align: left;
      }
    }
  }
  .withdrawDeposit-btn {
    height: 42px;
    line-height: 42px;
    font-size: 17px;
    background-color: @activeColor;
    border-color: @activeColor;
  }
}
</style>
