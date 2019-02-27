<template>
	<div class="myShare">
		<van-tabs v-model="active"  @click="handleSwitchTab">
			<van-tab v-for="(title,leve) in titles" :key="leve">
				<div slot="title" class="title">
					{{title.title}}
					<div class="btmSpace"></div>
				</div>

				<!-- <div class="myInvitation"><span class="leftLine"></span>已成功邀请<span class="memberNum">{{datas.length}}</span>位小伙伴成为{{title.title}}<span class="rightLine"></span></div> -->
				<div class="myInvitation"><span class="leftLine"></span>已成功邀请<span class="memberNum">{{datas.length}}</span>位小伙伴<span class="rightLine"></span></div>
				
				
				<!--普通消费者-->
				<van-list v-if="my_leve==0 || my_leve == 1">
					<van-cell v-for="(user,user_index) in datas" :key="user_index" @click="$router.push({name:'myShareDetail', query: {shareId : user.share_id}})">
						<template slot="title">
							<div class="userInfo">
								<div class="userImg" :style="'background:url('+user.head_img+') center/cover no-repeat;'"></div>
								<div class="userName">{{user.realname}}</div>
							</div>
							<div class="invitationTime">{{user.add_time}}</div>
						</template>
					</van-cell>
				</van-list>
				
				
				<!--代言人-->
				<!-- <van-list v-else-if="my_leve==2 && (leve == 0 || leve==2 || leve == 3)" style=" padding-bottom: 50px;">
					<van-cell v-for="(user,user_index) in datas" :key="user_index" @click="$router.push({name:'myShareDetail', query: {shareId : user.share_id}})">
						<template slot="title">
							<div class="userInfo">
								<div class="userImg" :style="'background:url('+user.head_img+') center/cover no-repeat;'"></div>
								<div class="userName">{{ user.realname }}</div>
							</div>
							<div class="invitationTime">{{ user.add_time }}</div>
						</template>
					</van-cell>
				</van-list> -->
				<van-list v-else-if="my_leve==2" style="padding-bottom: 50px;">
					<van-cell v-for="(user,user_index) in datas" :key="user_index" @click="$router.push({name:'myShareDetail', query: {shareId : user.share_id}})">
						<template slot="title">
							<div class="userInfo">
								<div class="userImg" :style="'background:url('+user.head_img+') center/cover no-repeat;'"></div>
								<div class="userName">{{user.realname}} </div>
							</div>
							<div class="invitationTime">{{user.add_time}}</div>
						</template>
					</van-cell>
					<div class="receiveReward" @click="$router.replace({name:'buy',query:{getRice:'1'}})" v-if="isReceive == 1">领取奖励</div>
				</van-list>


				
				<!--黄金用户-->
				<van-list v-else-if="my_leve==3">
					<van-cell v-for="(user,user_index) in datas" :key="user_index" @click="user.is_team == 0 ? $router.push({name:'myShareDetail', query: {shareId : user.share_id}}) : ''">
						<template slot="title">
							<div class="userInfo">
								<div class="userImg" :style="'background:url('+user.head_img+') center/cover no-repeat;'"></div>
								<div class="gold">
									<div class="userName">{{user.realname}} <span class="member_type">{{user.member_type}}</span> </div>
									<div class="invitationTime">{{user.add_time}}</div>
								</div>
							</div>
							<div class="goldreceiveReward" v-if="user.is_team == 1" @click.stop="gotoMyTeamAward(user.share_id)">团队奖</div>
							<van-icon v-else-if="user.is_team == 0"  slot="right-icon" name="arrow" class="van-cell__right-icon" />
							<!-- <van-icon v-else-if="(leve==2||leve==3) && user.is_team == 0"  slot="right-icon" name="arrow" class="van-cell__right-icon" /> -->
						</template>
					</van-cell>
				</van-list>
				
				
				<!--铂金用户-->
				<van-list v-else-if="my_leve==4">
					<van-cell v-for="(user,user_index) in datas" :key="user_index" @click="user.is_team == 0 ? $router.push({name:'myShareDetail', query: {shareId : user.share_id}}) : ''">
						<template slot="title">
							<div class="userInfo">
								<div class="userImg" :style="'background:url('+user.head_img+') center/cover no-repeat;'"></div>
								<div class="gold">
									<div class="userName">{{user.realname}} <span class="member_type">{{user.member_type}}</span> </div>
									<div class="invitationTime">{{user.add_time}}</div>
								</div>
							</div>
							<div class="goldreceiveReward" v-if="user.is_team == 1" @click.stop="gotoMyTeamAward(user.share_id)">团队奖</div>
							<!-- <van-icon v-else-if="(leve==1||leve==0||leve==2) && user.is_team == 0" slot="right-icon" name="arrow" class="van-cell__right-icon" /> -->
							<van-icon v-else-if="user.is_team == 0" slot="right-icon" name="arrow" class="van-cell__right-icon" />
						</template>
					</van-cell>
				</van-list>
			</van-tab>
		</van-tabs>
	</div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { Tab, Tabs } from "vant";
import { List } from "vant";
import { getUserInfo } from "@/api/my/userinfo.js";
import { getMyshare } from "@/api/share/index.js";

import { Toast, Dialog } from "vant";
export default {
  name: "myShare",
  components: {},
  data() {
    return {
      active: 0,
      my_leve: '',
    //   titles: [
    //     {
    //       key: "",
    //       title: "普通消费者"
    //     },
    //     {
    //       key: "",
    //       title: "代言人"
    //     },
    //     {
    //       key: "",
    //       title: "黄金代理商"
    //     },
    //     {
    //       key: "",
    //       title: "铂金代理商"
    //     }
    //   ],
      titles: [
        // {
        //   key: "",
        //   title: "普通消费者"
        // },
        // {
        //   key: "",
        //   title: "代言人"
        // },
        // {
        //   key: "",
        //   title: "黄金代理商"
        // },
        // {
        //   key: "",
        //   title: "铂金代理商"
        // }
      ],
      datas: [],
      memberType: "",
      memberTypeId: "",
      isReceive: '',
    };
  },
  computed: {
      ...mapGetters(['identity']),
  },
  methods: {
    //跳转到团队奖页面
    gotoMyTeamAward(shareId) {
         this.$router.push({ name: "myTeamAward" , query: {shareId: shareId}});
    },
    getMyshare(type) {
        getMyshare(type, 1, 150)
        .then(res => {
            // cosnole.log(res.is_receive);
            this.datas = res.share_list;
            // console.log(this.datas)
            this.my_leve = this.identity;  

            this.titles = res.titles;
            this.isReceive = res.is_receive;
        })
        .catch((err) => {
            Toast(err.info ? err.info : '获取数据失败');
        });
    },
    handleSwitchTab() {
        // this.page = 1
        // this.datas = []
        // this.getMyshare(this.active+1);
    }
  },
  created() {
    // this.getUserInfo();
    this.getMyshare(1);
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.myShare {
  background-color: #ffffff;
  min-height: 100vh;
  .van-tabs--line {
    padding-top: 46px;
    .van-tabs__wrap {
        display: none;
    //   height: 54px;
    //   position: fixed;
    //   top: 46px;
      .van-tabs__nav--line {
        padding-bottom: 0px;
        .van-tabs__line {
          bottom: 10px;
        }
      }
      .van-tab {
        padding: 0;
        .title {
          .btmSpace {
            width: 100%;
            height: 10px;
            background: #f5f5f5;
          }
        }
      }
    }
    .van-tabs__content {
      .van-tab__pane {
        /*我的邀请*/
        .myInvitation {
          padding: 15px 0;
          border-bottom: 1px solid #eee;
        //   padding-top: 60px;
          text-align: center;
          font-size: 14px;
          color: #999;
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
        /*列表框*/
        .van-list {
          .van-cell {
            /*单条列表*/
            .van-cell__title {
              display: flex;
              justify-content: space-between;
              align-items: center;
              /*用户信息*/
              .userInfo {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .userImg {
                  height: 52px;
                  width: 52px;
                  margin-right: 15px;
                }

                /*黄金用户*/
                .gold {
                  text-align: left;
                  .invitationTime {
                    color: #888;
                  }
                  .member_type{
                      color: #999;
                      font-size: 10px;
                  }
                }
              }

              /*黄金用户领取团队奖按钮*/
              .goldreceiveReward {
                height: 34px;
                width: 85px;
                background: #e55680;
                color: #ffffff;
                font-size: 14px;
                line-height: 34px;
                border-radius: 2px;
                text-align: center;
              }
              .goldreceiveReward.active {
                background: #d9d9d9;
              }
            }
          }

          .receiveReward {
            position: fixed;
            bottom: 0;
            width: 100vw;
            height: 42px;
            line-height: 42px;
            text-align: center;
            background: #e55680;
            color: #fff;
            font-size: 17px;
          }
        }
      }
    }
  }
}
</style>