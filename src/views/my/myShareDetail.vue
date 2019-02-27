<template>
	<div class="myShareDetail">
		<van-list>
			<van-cell>
				<template slot="title">
					<div class="userInfo">
						<div class="userImg" :style="'background:url('+user_data.head_img+') center/cover no-repeat;'"></div>
						<div class="userOtherInfo">
							<div class="userName">{{user_data.realname}}</div>
							<div class="invitationTime">{{user_data.add_time}}</div>
						</div>
					</div>
					<div class="userLeve">{{user_data.member_type}}</div>
				</template>
			</van-cell>
		</van-list>
        <div v-for="(share,index) in share_info" :key="index">
		<van-card  :desc="share.goods_desc" :thumb="share.goods_pic">
			<div slot="title" class="van-card-title">
				<div class="goodsName">{{share.goods_name}}</div>
				<div class="goodsState">{{share.status}}</div>
			</div>
			<div slot="tags" class="goodsNum">数量：{{share.goods_nums}}</div>
			<div slot="footer">
				<div class="goodsPrice">￥{{share.total_fee}}</div>
			</div>
		</van-card>

		<van-list style="margin-top: 1px;" v-if="share.money">
			<van-cell>
				<template slot="title" class="van-cell-title">
					<span class="van-cell-text">奖励金额</span>
					<span style="color: #eb5790;">￥{{share.money}}</span>
				</template>
			</van-cell>
		</van-list>
        </div>
	</div>
</template>

<script>
    import { List } from 'vant';
    import { getMyshareDetail } from "@/api/share/index.js";

	export default {
		name: "myShareDetail",
		components: {},
		data() {
			return {
				user_data: {
					name: '测试名字',
					time: '2018-03-03 09:08:15',
					header_img: 'https://img5.duitang.com/uploads/item/201407/16/20140716023921_u3juM.thumb.700_0.jpeg',
					leve: '普通消费者'
				},
				// share_info: {
				// 	goods_img: 'https://img5.duitang.com/uploads/item/201407/16/20140716023921_u3juM.thumb.700_0.jpeg',
				// 	goods_name: '乐康然大米10kg',
				// 	goods_label: '专利栽培技术，天然水源灌溉',
				// 	goods_num: 2,
				// 	goods_price: 380,
				// 	goods_state: '已签收',
				// 	rewar_gold: 520
                // },
                share_info: []
			};
		},
		methods: {
            getMyshareDetailDate() {
                getMyshareDetail(this.$route.query.shareId).then((res)=>{
                    console.log(res)
                   this.user_data = res.member_info;
                   this.share_info = res.order_list;
                }).catch((err)=>{
                    Toast(err.info ? err.info : '获取数据失败');
                })
            }
		},
		created() {
            this.getMyshareDetailDate()
		}
	};
</script>

<style lang="less">
	@import "../../styles/color.less";
	.myShareDetail {
		background-color: #f5f5f5;
		padding-top: 44px;
		.van-list {
			.van-cell {
				.van-cell__title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					.userInfo {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.userImg {
							width: 52px;
							height: 52px;
							margin-right: 10px;
						}
					}
				}
			}
		}
		.van-card {
			background: #fff;
			.van-card__content {
				.van-card-title {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 14px;
					color: #333;
				}
				.goodsNum {
					position: absolute;
					left: 115px;
					bottom: 5px;
					font-size: 12px;
					color: #999;
				}
				.van-card__row {
					.van-card__desc {
						font-size: 12px;
						color: #999;
					}
				}
			}
		}
	}
</style>