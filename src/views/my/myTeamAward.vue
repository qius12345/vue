<template>
	<div class="myTeamAward">
		<van-list class="titleList">
			<van-cell>
				<template slot="title">
					<span class="van-cell-text">团队奖</span>
					<span style="color: #eb5790;">￥{{ team_money }}</span>
				</template>
			</van-cell>
		</van-list>

		<van-list>
			<van-cell>
				<template slot="title">
					<div class="userInfo">
						<div class="userImg" :style="'background:url('+member_info.head_img+ ') center/cover no-repeat;'"></div>
						<div class="userOtherInfo">
							<div class="userName">{{ member_info.realname }}</div>
							<div class="invitationTime">{{ member_info.add_time }}</div>
						</div>
					</div>
					<div class="userLeve">{{ member_info.member_type }}</div>
				</template>
			</van-cell>
		</van-list>

        <div v-for="(order,index) in order_list" :key="index">
            <van-card :desc="order.goods_desc" :thumb="order.goods_pic">
                <div slot="title" class="van-card-title">
                    <div class="goodsName">{{ order.goods_name }}</div>
                    <div class="goodsState">{{ order.status }}</div>
                </div>
                <div slot="tags" class="goodsNum">数量：{{ order.goods_nums }}</div>
                <div slot="footer">
                    <div class="goodsPrice">￥{{ order.total_fee }}</div>
                </div>
            </van-card>

            <van-list style="margin-top: 1px;">
                <van-cell>
                    <template slot="title" class="van-cell-title">
                        <span class="van-cell-text">{{ order.str }}</span>
                        <span style="color: #eb5790;">￥{{ order.money }}</span>
                    </template>
                </van-cell>
            </van-list>
        </div>
		<div class="myInvitationBox">
			<div class="myInvitation"><span class="leftLine"></span>已成功邀请<span class="memberNum">{{datas.length}}</span>位小伙伴<span class="rightLine"></span></div>

			<van-list>
				<van-cell v-for="(invitationUser,user_index) in datas" :key="user_index">
					<template slot="title">
						<div class="myInvitationUserInfo">
							<div class="userImg" :style="'background:url('+invitationUser.head_img+') center/cover no-repeat;'"></div>
							<div class="userOtherInfo">
								<div class="userName">{{invitationUser.realname}}<span class="member_type">{{invitationUser.member_type}}</span></div>
								<div class="invitationTime">{{invitationUser.add_time}}</div>
							</div>
						</div>
						<div style="color: #eb5790;">￥{{invitationUser.money}}</div>
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
		name: "myTeamAward",
		components: {},
		data() {
			return {
                datas: [],
                order_list: [],
                member_info: {},
                team_money: ''
			};
		},
		methods: {
            getMyshareDetailDate() {
                getMyshareDetail(this.$route.query.shareId).then((res)=>{
                    this.member_info = res.member_info;
                   this.order_list = res.order_list;
                   this.datas = res.team_list;
                   this.team_money = res.team_money;
                }).catch((err)=>{
                    Toast(err.info ? err.info : '获取数据失败');
                })
            }
		},
		created() {
            this.getMyshareDetailDate();
		}
	};
</script>

<style lang="less">
	@import "../../styles/color.less";
	.myTeamAward {
		background-color: #f5f5f5;
		padding-top: 44px;
		.titleList {
			margin: 10px 0;
		}
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
					.myInvitationUserInfo {
						display: flex;
						justify-content: space-between;
						align-items: center;
						.userImg {
							height: 52px;
							width: 52px;
							margin-right: 15px;
						}
						/*黄金用户*/
						.userOtherInfo {
							text-align: left;
							.invitationTime {
								color: #888;
							}
						}
					}
				}
			}
			.van-cell:not(:last-child)::after {
				border-bottom: none;
			}
		}
		.van-card {
			background: #fff;
			margin-top: 1px;
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
		.myInvitationBox {
			margin: 10px 0;
			background: #fff;
			.myInvitation {
				padding: 15px 0;
				border-bottom: 1px solid #eee;
				text-align: center;
				/*左右线条*/
				.leftLine {
					display: inline-block;
					vertical-align: middle;
					width: 18px;
					height: 1px;
					background-color: #999;
					margin-right: 10px;
				}
				.rightLine {
					display: inline-block;
					vertical-align: middle;
					width: 18px;
					height: 1px;
					background-color: #999;
					margin-left: 10px;
				}
				/*邀请人数*/
				.memberNum {
					color: #ff9900;
				}
            }
            .member_type{
                color: #999;
                font-size: 10px;
                margin-left: 10px;
            }
		}
	}
</style>