<template>
	<div class="myOrderLogistics">
        <div v-if="logisticsState.state != ''">
            <div class="SegmentingLine"></div>
            <!--物流状态-->
            <van-card :thumb="logisticsState.shopImg" class="logisticsState" centered>
                <!-- <div slot="title" class="title">{{logisticsState.state}}</div> -->
                <div slot="desc" class="desc">{{logisticsState.expressType}}：{{logisticsState.expressNumber}}</div>
                <div slot="tags" class="tags">官方电话：<span>{{logisticsState.tel}}</span></div>
            </van-card>

            <div class="SegmentingLine"></div>

            <!--快递公司-->
            <!-- <van-list class='expressCompany'>
                <van-cell>
                    <div slot="title" class="title">
                        <div class="expressImg" :style="'background:url('+logisticsState.shopImg+') center/cover no-repeat;'"></div>
                        <div class="expressPerson">
                            <div style="color: #686868;font-size: 13px;">派送员</div>
                            <div style="color: #000;font-size: 14px;">杭州城西分部</div>
                        </div>
                    </div>
                    <van-icon slot="right-icon" name="phone" class="van-cell__right-icon" />
                </van-cell>
            </van-list> -->

            <!-- <div class="SegmentingLine"></div> -->

            <!--快递进程-->
            <logisticsList v-if="logisticsState.state != ''" :express_data="express_data" :address_info="address_info"></logisticsList>
        </div>
        <div v-else>
            <h3>{{logisticsInfo}}</h3>
        </div>
    </div>
</template>

<script>
	import { Card } from 'vant';
	import { List } from 'vant';
	import { Step, Steps } from 'vant';
	import LogisticsList from "@/components/logistics-list";
    import { logisticsMsg, getLogisticsFree } from "@/api/order/index.js";
    import { Toast, Dialog } from "vant";
	export default {
		name: "myOrderLogistics",
		components: {
			LogisticsList
		},
		data() {
			return {
				logisticsState: {
					shopImg: '',
					state: '',
					expressType: '',
					expressNumber: '',
                    tel: '',
                    express_data: ''
                },
                logisticsInfo: '',
                address_info: ''
			};
		},
		methods: {
            logisticsMsg() {
                logisticsMsg(this.$route.query.order_no).then((res)=>{
                    console.log(res);
                    if(res.status == 1){
                        this.logisticsState.shopImg = res.express_logo
                        this.logisticsState.state = res.express_ma
                        this.logisticsState.expressType = res.express_name
                        this.logisticsState.expressNumber = res.express_no
                        this.logisticsState.tel = res.express_tel
                        this.express_data = res.express_data;
                        this.address_info =res.address_info;
                    }else{
                        this.logisticsInfo = res.info
                        Toast(res.info);
                    }
                    // Toast(res);
                }).catch((err)=>{
                    Toast(err.info ? err.info : '获取数据失败');
                })
            },
            getLogisticsFree() {
                getLogisticsFree(this.$route.query.record_id).then((res)=>{
                    console.log(res);
                    this.logisticsState.shopImg = res.express_logo
                    this.logisticsState.state = res.express_ma
                    this.logisticsState.expressType = res.detail_content.express_name
                    this.logisticsState.expressNumber = res.detail_content.express_no
                    this.logisticsState.tel = res.express_tel
                    this.express_data = res.exp;
                    this.address_info =res.address_info;
                }).catch((err)=>{
                    Toast(err.info ? err.info : '获取数据失败');
                })
            }
		},
		created() {
            if(this.$route.query.record_id){
                this.getLogisticsFree()
            }else{
                this.logisticsMsg()
            }

		},
		mounted() {

		}
	};
</script>

<style lang="less">
    @import "../../styles/color.less";
    
	.myOrderLogistics {
        h3{
            text-align: center;
        }
		padding-top: 44px;
		min-height: calc(100vh - 44px);
		background: #fff;
		/*灰色分割线*/
		.SegmentingLine {
			height: 10px;
			background: #f5f5f5;
		}
		/*物流状态*/
		.logisticsState {
			background: #fff;
			margin: 0;
			padding: 20px 15px 20px 105px;
			height: 78px;
			box-sizing: inherit;
			/*图片*/
			.van-card__thumb {
				width: 78px;
				height: 78px;
				top: 20px;
			}
			/*内容*/
			.van-card__content {
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 5px 0px;
				.title {
					color: #eb5790;
					font-size: 15px;
				}
				.desc {
					font-size: 13px;
					color: #686868;
				}
				.tags {
					font-size: 13px;
					color: #686868;
					span {
						color: #669933;
					}
				}
			}
		}
		/*快递公司*/
		.expressCompany {
			.van-cell {
				display: flex;
				align-items: center;
				line-height: inherit;
				.van-cell__title {
					.title {
						display: flex;
						align-items: center;
						.expressImg {
							height: 40px;
							width: 40px;
							margin-right: 10px;
							border-radius: 50%;
						}
					}
				}
				.van-cell__right-icon {
					font-size: 20px;
					color: #eb5790;
				}
			}
			.van-cell:not(:last-child)::after {
				border-bottom: none;
			}
		}
	}
</style>