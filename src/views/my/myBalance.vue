<template>
    <div class="myBalance">
        <div class="myBalance-money">
            <h2>{{money}}</h2>
            <h6>账户总余额(￥)</h6>
            <van-row class="myBalance-Btn">
                <van-col span="12" class="freezeMoney">
                    <p>冻结金额(元)</p>
                    <p class="myBalance-price">{{freezeMoney}}</p>
                </van-col>
                <van-col span="12">
                    <p>可提现金额(元)</p>
                    <p class="myBalance-price">{{withdrawMoney}}</p>
                </van-col>
            </van-row>
        </div>
        <div class="myBalance-btn">
            <van-cell-group>
                <van-cell title="提现" is-link @click="$router.push({name:'withdrawDeposit'})">
                    <template slot="icon">
                        <img :src="balanceWithdraw" alt="">
                    </template>
                </van-cell>
                <van-cell title="收支明细" is-link  @click="showDetails = true;">
                    <template slot="icon">
                    <img :src="balanceDetails" alt="">
                    </template>
                </van-cell>
            </van-cell-group>


            <van-popup v-model="showDetails" position="right" class="popup">
                <van-nav-bar
                    title="收支明细"
                    left-text=""
                    
                    left-arrow
                    @click-left="onClickLeft"
                    
                    />
                    <div class="myBalanceDetails">
                        <van-cell-group>
                            <van-cell v-for="(item,index) in detailsList" :key="index" center :title="item.remark+'/'+item.pay_way" :value="item.money" :label="item.add_time" />
                        
                        </van-cell-group>
                    </div>
            </van-popup>
        </div>
    </div>

    
    
</template>


<script>
import balanceDetails from "_img_/my/my_balance_details.png";
import balanceWithdraw from "_img_/my/my_balance_withdraw.png";
import { getWalletScoreList } from "@/api/my/walletscore.js";
import { Toast } from 'vant';


export default {
  name: "myBalance",
  components: {},
  data() {
    return {
        balanceDetails: balanceDetails,
        balanceWithdraw: balanceWithdraw,
        money: '',
        freezeMoney: '',
        withdrawMoney: '',
        showDetails:false,
        detailsList:[{
            pay_way:'1',
            remark:'1',
            money_before:'1',
            money_after:'1',
            money:'1',
            status:'1',
            add_time:'1'
        }],
        withdraw: ''
    };
  },
  methods: {
    onClickLeft(){
        this.showDetails = false;
        this.withdraw = '2';
    }
  },
  created() {
      if(this.$route.query.withdraw){
          this.withdraw = this.$route.query.withdraw
      }
      this.$toast.loading({
        mask: true,
        message: "加载中" + "...",
        loadingType: "spinner",
        duration: 0
      });
  },
  mounted() {
    // var bodyHeight = window.screen.height;
    // var myBalance =  document.getElementsByClassName('myBalance');
    // myBalance[0].style.height = bodyHeight + 'px';

    getWalletScoreList().then((res) =>{
        
        if(res.status == "1"){
            this.money = res.wallet_all;
            this.freezeMoney = res.wallet_frost;
            this.withdrawMoney = res.wallet;
            this.detailsList = res.list;


        }else{
            // Toast(res.info)
        }
        this.$nextTick(function () {
            this.$toast.clear();
        })
    }).catch((err) =>{
        // Toast(err.info ? err.info : '获取数据失败');
    })
    
    if(this.withdraw == '1'){
        this.showDetails = true;
    }
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.myBalance {
    padding-top: 46px;
    .myBalance-money{
        background-color: #eb5790;
        color: #ffffff;
        position: relative;
        margin-bottom: -30px;
        text-align: center;
        h2{
            margin: 0;
            padding-top: 36px;
            font-size: 50px;
        }
        h6{
            margin: 0;
        }
        .freezeMoney{
            border-right: 1px solid #eeeeee;
        }
        .myBalance-Btn{
            background-color: #ffffff;
            margin: 0 15px;
            border-radius: 8px;
            box-shadow: 0 0 4px hsla(214,3%,49%,.5);
            position: relative;
            bottom: -20px;
            z-index: 3;
            color: #333333;
            padding: 20px;
            
            p{
                margin: 0;
                line-height: 24px;
                font-size: 14px;
                color: #666666
            }
            .myBalance-price{
                font-size: 20px;
            }
        }
    }
    .van-cell-group{
        .van-cell{
            text-align: left;
            padding: 15px;
            img{
                width: 18px;
                height: 18px;
                margin-right: 10px;
                position: relative;
                top: 3px;
            }
        }
        .van-cell:not(:last-child)::after{
            margin: 0;
        }
    }
    .myBalance-btn{
        padding-top: 60px;
        background-color: #ffffff;
    }
    .van-hairline--top-bottom::after{
        border-width:0;
    }
    .myBalanceDetails{
        padding: 0 15px;
        padding-top: 46px;
    }
}
.myBalanceDetails {
    .van-cell{
        text-align: left;
        padding: 15px;
        .van-cell__title{
            font-size: 15px;
            flex: 2;
        }
        .van-cell__label{
            color: @descColor;
        }
        .van-cell__value{
            font-size: 17px;
        }
    }
    .van-cell:not(:last-child)::after{
        margin-left: 0;
    }
}
.popup {
    width: 100%;
    height: 100%;
    
    box-sizing: border-box;
  
  }
</style>
