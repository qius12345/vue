<template>
    <div :class=" showRow ? 'row' : 'block'" :style="{height:imgArea[0] + 'px',paddingLeft:imgArea[1] + 20 + 'px'}">
        <van-row class="card-thumb" :style="{height:imgArea[0] + 'px',width:imgArea[1] + 'px'}">
            <img :src="imgUrl" alt="">
        </van-row>
        <van-row class="card-content">
            <van-row class="card-title">
                <span>{{title}}</span>
            </van-row>
            <van-row class="card-desc">
                <span>{{desc}}</span>
            </van-row>
            <van-row class="card-footer" :style="{left:imgArea[1] + 20 + 'px'}">
                <van-row class="card-footer-price">
                    <span>&yen; {{price}}</span>
                </van-row>
                <van-row class="card-footer-count" v-if="count">
                    <span>{{count}}人购买{{num}}</span>
                </van-row>
            </van-row>
            <van-row class="card-step" v-if="num" @click.native.stop="changeCartStepper">
                <van-stepper v-model='stepperNum' integer :min="1" :step="1" />
            </van-row>
            <van-row class="card-number" v-if="number">
                <span>×{{number}}</span>
            </van-row>
        </van-row>
    </div>
</template>

<script>
import numberPrecision from 'number-precision'
export default {
    data() {
        return {
            stepperNum: this.num
        }
    },
    props: {
        showRow: {
            type: Boolean,
            default: true
        },
        title: String,
        desc: String,
        imgUrl: String,
        price: [String, Number],
        count: [String, Number],
        num: [String, Number],
        number: [String, Number],
        imgArea: {
            type: Array,
            default() {
                return [140, 140]
            }
        },
        cartId: [String, Number],
    },
    methods: {
		setShowAddReduce() {
            this.$emit('setShowAddReduce',true);
            
        },
        changeCartStepper() {
            
        }
    },
    watch: {
        stepperNum(newStepperNum,oldStepperNum) {
            var newNum = 0;
            if (parseInt(oldStepperNum) != 0) {
                newNum = parseInt(newStepperNum);
                this.$emit('changeCartStepper', newNum,this.cartId);
            }
        }
    }
}
</script>

<style lang="less" scoped>

@import "../styles/color.less";

.card-footer-price {
    color: @priceColor;
    font-weight: bold;
    line-height: 20px;
    font-size: 15px;
}
.card-footer-count {
    font-size: 12px;
    line-height: 20px;
}
.row {
    position: relative;
    background: #fff;
    padding: 10px 0 10px 175px;
    .card-thumb {
        top: 10px;
        left: 0;
        position: absolute;
        img {
            border: none;
            max-width: 100%;
            max-height: 100%;
        }
    }
    .card-title {
        font-weight: bold;
        max-height: 30px;
        line-height: 30px;
        font-size:14px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: left;
        color: @titleColor;
    }
    .card-desc {
        color: #666;
        font-size: 12px;
        height: 36px;
        line-height: 18px;
        max-height: 36px;
        overflow: hidden;
        white-space: normal;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-align: left;
        color: @descColor;
    }
    .card-footer {
        text-align: left;
        left: 110px;
        bottom: 10px;
        position: absolute;
        .card-footer-count {
            color: #333;
        }
    }
    .card-step {
        position: absolute;
        right: 0;
        bottom: 10px;
    }
    .card-number{
        position: absolute;
        right: 12px;
        bottom: 10px;
        font-weight: bold;
    }
}

.block {
    height: auto !important;
    padding: 5px !important;
    .van-col {
        padding: 5px;
        border-radius: 20px;
        overflow: hidden;
    }
    .card-thumb {
        height: 0px !important;
        width: 100% !important;
        padding-top: 100%;
        position: relative;
        box-shadow: 0 1px 0 #f5f5f5;
        img {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
    }
    .card-content {
        padding: 12px;
        background-color: #fff;
        .card-title {
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            text-align: left;
            color: @titleColor;
        }
        .card-desc {
            color: #666;
            font-size: 13px;
            height: 36px;
            line-height: 18px;
            max-height: 36px;
           display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			overflow: hidden;
            color: @descColor;
            text-align: left;
        }
        .card-footer {
            margin-top: 5px;
            height: 24px;
            line-height: 24px;
            .card-footer-count {
                float: right;
                border: 1px solid #c2c2c2;
                border-radius: 20px;
                padding: 1px 5px;
                color: #666;
            }
            .card-footer-price {
                float: left;
                position: relative;
                top: 3px;
            }
        }
        .van-hairline--bottom::after{
        	border: none;
        }
    }
}
@media screen and (max-width: 360px) {
	.block .card-content .card-desc{
		font-size: 12px;
	}
	.block .card-content .card-footer .card-footer-count{
		padding: 1px 3px;
	}
	.card-footer-price{
		font-size: 12px;
	}
}
</style>
