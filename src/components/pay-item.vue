<template>
    <div class="pay-item">
       <van-popup v-model="payShow" position="bottom" :overlay="true" :close-on-click-overlay="closeoVerlay">
			<van-nav-bar title="确认付款" left-text="" >
			  	<van-icon name="close" slot="right" @click="$emit('hidePay')" />
			</van-nav-bar>
            <van-row class="text-title">￥{{total}}</van-row>
			<van-radio-group v-model="radio" @change="payChange">
			  	<van-cell-group>
                    <van-cell title='' clickable @click="radio = '1'" center v-if="identity == 3 || identity == 4">
						<van-radio name="1"></van-radio>
						<div v-show='balance_state' class="balance_pz"></div>
						<template slot="title">
							<img :src="balance"/>
							<div class="van-cell-text">
                                <span>余额支付</span>
                                <p>剩余{{ wallet }}元</p>
                            </div>
						</template>
					</van-cell>
					<van-cell title='' clickable @click="radio = '2'" center>
						<van-radio name="2"></van-radio>
						<div v-show='balance_state' class="balance_pz"></div>
						<template slot="title">
							<img :src="wxPay"/>
							<div class="van-cell-text">
                                <span>微信支付</span>
                                <p>微信安全支付</p>
                            </div>
						</template>
					</van-cell>
			  	</van-cell-group>
			</van-radio-group>
			<van-button size="large" @click.native.stop="$emit('pay')">立即付款</van-button>
		</van-popup>
    </div>
</template>

<script>
import balance from '_img_/order/yue.png'
import wxPay from '_img_/order/wx_pay.png'
import { mapGetters, mapActions, mapState } from 'vuex'

export default {
    data () {
        return {
            balance: balance,
            wxPay: wxPay,
			balance_state: false,
			radio: '2',
			closeoVerlay: false
        }
    },
    props: {
    	payShow: Boolean,
    	total: [String, Number],
    	wallet: [String, Number]
    },
    computed: {
      ...mapGetters(['identity']),
    },
    created () {
    },

    methods: {
    	payChange(val) {
    		this.$emit('getRadio', val)
    	}
    }
}
</script>

<style lang="less">
@import "../styles/color.less";

.pay-item{
    .van-cell:not(:last-child)::after{
        margin-left: 0;
    }
    text-align: center;
	.van-popup{
		.text-title{
			font-size: 30px;
            padding: 32px 0;
            text-align: center;
		}
		.van-nav-bar{
			position: relative;
		}
		.van-button--large {
			width: 90%;
			border-radius: 5px;
			background-color: @activeColor;
            color: #FFFFFF;
            margin: 0 auto;
			margin-bottom: 35px;
		}
		.van-radio .van-icon-checked{
			color: @priceColor;
		}
		.van-icon-alipay{
			// color: $errorButtonBg;
			font-size: 0.48rem;
			margin-right: 10px;
		}
		.van-nav-bar__title{
			// color: $descColor;
		}
		.van-cell-group{
			margin:0 15px;
            margin-bottom: 100px;
            text-align: left;
		}
		.van-hairline--top-bottom::after{
			border-top: none;
		}
		.van-cell__title{
			-webkit-box-flex: 6;
		    -webkit-flex: 6;
		    flex: 6;
			img{
				padding: 0;
			    width: 24px;
			    height: 24px;
                margin-right: 10px;
                position: relative;
                top: -5px;
			}
			.available_balance{
				// color: $checkBoxColor;
				font-size: 0.24rem;
			} 
		}
		.van-cell__value {
		    -webkit-box-flex: 1;
		    -webkit-flex: 1;
		    flex: 1;
		}
		.balance_pz{
			position: absolute;
			left: 0;
			top: 0;
			background-color: rgba(255,255,255,.8);
			width: 100%;
			height: 100%;
        }
        .van-nav-bar__right{
            font-size: 18px;
            right: auto;
            left: 15px;
        }
        .van-cell-text{
            display: inline-block;
            p{
                margin: 0;
                font-size: 12px;
                color: @descColor;
                height: 16px;
                line-height: 16px;
            }
	    }
	}
    @media screen and (max-width: 360px) {
        .Contacts .van-cell__title,.placeOrder .Contacts .van-cell__value{
            font-size: 14px;
        }
        .van-popup .van-cell__value{
            flex: 2;
        }
        .van-popup .van-cell__title{
            flex: 17;
        }
        .van-popup .van-cell__title img{
            margin-right: 0px;
        }
        .van-popup .van-cell__title .van-cell-text{
            display: inline-block;
        }
    }
}

</style>
