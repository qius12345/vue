<template>
	<div class="logisticsList">
		<div class="stepBox">

			<!--收货地址-->
			<!--Receiving address-->
			
			<div class="receivingAddress" v-if="address_info != ''">
				<div class="imgBox">
					<img :src="addressImg"/>
				</div>
				<!-- <div class="myAddress">【收货地址】浙江省杭州市江干区 丁晓镇 蔚蓝领秀6-3-1001</div> -->
				<div class="myAddress">{{address_info.province+address_info.city+address_info.district+address_info.place}}</div>
			</div>
			
			
			<!--快递步骤-->
			<div class="stepList" v-for="(express,index) in express_data" :key="index">
				<div class="leftBox">
					<!-- <div class="time1">{{express.AcceptTime}}</div> -->
					<div class="time2">{{express.AcceptTime}}</div>
					<!-- <div class="time2">11:20</div> -->
					<div class="stateIconFinish" :style="'background:url('+duigouImg+') center/cover no-repeat;'"></div>
				</div>
				<div class="rightBox">
					<!-- <div class="title">已签收</div> -->
					<div class="cnt">{{express.AcceptStation}}</div>
				</div>
			</div>
<!-- 			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1">04-18</div>
					<div class="time2">11:20</div>
					<div class="stateIconDayLast" :style="'background:url('+shangImg+') center/cover no-repeat;'"></div>
				</div>
				<div class="rightBox">
					<div class="title">派送中</div>
					<div class="cnt">【杭州市】浙江省杭州市丁桥派件员：崔亚齐<span style="color: #669933;">18069842790</span>正在为您派件</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1">04-18</div>
					<div class="time2">11:20</div>
					<div class="stateIconDayLast" :style="'background:url('+shangImg+') center/cover no-repeat;'"></div>
				</div>
				<div class="rightBox">
					<div class="title">运输中</div>
					<div class="cnt">浙江省杭州市丁桥公司 已签收 签收人：门卫</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1 daycenter">04-18</div>
					<div class="time2 daycenter">11:20</div>
					<div class="stateIcon"></div>
				</div>
				<div class="rightBox">
					<div class="cnt">浙江省杭州市丁桥公司 已签收 签收人：门卫</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1">04-18</div>
					<div class="time2">11:20</div>
					<div class="stateIconDayLast" :style="'background:url('+shangImg+') center/cover no-repeat;'"></div>
				</div>
				<div class="rightBox">
					<div class="title">已揽件</div>
					<div class="cnt">浙江某某公司已揽件</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1">04-18</div>
					<div class="time2">11:20</div>
					<div class="stateIconDayLast" :style="'background:url('+shangImg+') center/cover no-repeat;'"></div>
				</div>
				<div class="rightBox">
					<div class="title">已发货</div>
					<div class="cnt">卖家已发货</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1">04-18</div>
					<div class="time2">11:20</div>
					<div class="stateIconDayLast" :style="'background:url('+shangImg+') center/cover no-repeat;'"></div>
				</div>
				<div class="rightBox">
					<div class="title">已出库</div>
					<div class="cnt">您的包裹已出库</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1">04-18</div>
					<div class="time2">11:20</div>
					<div class="stateIconDayLast" :style="'background:url('+shangImg+') center/cover no-repeat;'"></div>
				</div>
				<div class="rightBox">
					<div class="title">已下单</div>
					<div class="cnt">您的包裹已出库</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1 daycenter">04-18</div>
					<div class="time2 daycenter">11:20</div>
					<div class="stateIcon"></div>
				</div>
				<div class="rightBox">
					<div class="cnt">您的订单已发货单</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1 daycenter">04-18</div>
					<div class="time2 daycenter">11:20</div>
					<div class="stateIcon"></div>
				</div>
				<div class="rightBox">
					<div class="cnt">您的订单已打物流单</div>
				</div>
			</div>
			
			<div class="stepList">
				<div class="leftBox">
					<div class="time1 daycenter">04-18</div>
					<div class="time2 daycenter">11:20</div>
					<div class="stateIcon"></div>
				</div>
				<div class="rightBox">
					<div class="cnt">您的订单开始处理</div>
				</div>
			</div> -->

		</div>
	</div>
</template>

<script>
	import DuiGou from "_img_/order/duigou.png";
	import Shang from "_img_/order/shang.png";
	import myAddress from "_img_/order/address.png";
	
	import { Icon } from 'vant'
	export default {
		name: "logisticsList",
		components: {},
		data() {
			return {
				duigouImg:DuiGou,
				shangImg:Shang,
				addressImg:myAddress
			};
        },
        props:{
            express_data:{type: Array},
            address_info:{}
        },
		methods: {

		},
		created() {
            
		},
		mounted() {
            console.log(this.express_data);
            console.log(this.address_info);
		}
	};
</script>

<style lang="less">
	@import "../styles/color.less";
	.logisticsList {
		background: #fff;
		
		/*收货地址*/
		.receivingAddress{
			position: relative;
			padding:0 15px 15px 65px;
			display:flex;
			color:#eb5790;
			.imgBox{
				position: absolute;
				top: 0;
				left: 57px;
				height: 16px;
				width: 16px;
				img{
					width:100%;
					height: 100%;
				}
			}
			.myAddress{
				width: calc(100% - 15px);
				padding-left: 15px;
				font-size: 13px;
			}
		}
		
		/*步骤框*/
		.stepBox {
			padding: 15px 0;
			.stepList {
				position: relative;
				display: flex;
				padding-bottom: 20px;
				.leftBox {
					position: relative;
					width: 65px;
					text-align: right;
					box-sizing: border-box;
					
					color: #999;
					.time1{
						font-size: 14px;
						margin-right: 15px;
						margin-bottom: 2px;
					}
					.time1.daycenter{
						font-size: 10px;
						margin-right: 15px;
						margin-bottom: 2px;
					}
					.time2{
						font-size: 9px;
						margin-right: 15px;
					}
					/*已签收*/
					.stateIconFinish{
						position: absolute;
						top: 0px;
						right: -7px;
						height: 14px;
						width: 14px;
						border-radius: 50%;
						background: #eb5790;
						z-index: 2;
						.van-icon{
							color: #fff;
							font-size: 12px;
						}
					}
					
					/*每天的最后物流*/
					.stateIconDayLast{
						position: absolute;
						top: 0px;
						right: -6px;
						height: 12px;
						width: 12px;
						border-radius: 50%;
						background: #cbcecb;
						z-index: 2;
					}
					/*其余点*/
					.stateIcon{
						position: absolute;
						top: 0px;
						right: -3px;
						height: 6px;
						width: 6px;
						border-radius: 50%;
						background: #cbcecb;
						z-index: 2;
					}
				}
				.rightBox {
					width: calc(100% - 65px);
					padding:0 10px 0 15px;
					box-sizing: border-box;
					.title{
						font-size: 14px;
						color: #999;
					}
					.cnt{
						font-size: 12px;
						color: #999;
					}
				}
				.rightBox.finish{
					.title,
					.cnt{
						color: #eb5790!important;
					}
				}
			}
			.stepList::after{
				position: absolute;
				content: "";
				height: 100%;
				width: 1px;
				background: #eee;
				top: 0;
				left: 65px;
			}
			.stepList:last-child::after{
				width: 0;
			}
		}
	}
</style>