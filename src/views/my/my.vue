<template>
    <div class="my">
        <div class="my-info">
            <van-card
            :title="username"
            :centered="isCentered"
            :thumb="head_img"
        >
        <div slot="desc" class="member" @click.stop="$router.push({path:'myInfo'})">
            <span class="member-rank">{{ memberType }}</span> <van-icon name="arrow" />
        </div>
        <div slot="footer" v-if="memberTypeId != 0">
            <img :src="qrCode" alt="" @click="bigImg" />
        </div>
        </van-card>
        </div>
        <van-cell-group>
            <van-cell is-link  v-for="(icon,index) in icons" :key="index" @click.native="goDetial(icon.url)" v-if="icon.isShow">
                <template slot="title">
                    <img class="icon" :src="icon.img" alt="">
                    <span class="van-cell-text">{{ icon.name }}</span>
                    <!-- <div class="van-info" v-if="icon.url == 'myOrder'">{{allNums}}</div> -->
                </template>
            </van-cell>
			<van-cell is-link clickable @click.native="callPhone">
                <template slot="title">
                    <img class="icon" :src="myService.img" alt="">
                    <span class="van-cell-text">{{ myService.name }}</span>
                </template>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
import myService from "_img_/my/my_service.png";
import headPortrait from "_img_/my/my_headPortrait.png";
import { Toast, Dialog } from "vant";
import { ImagePreview } from "vant";
import { getUserInfo, getQrCode, getInfoList } from "@/api/my/userinfo.js";

export default {
  name: "my",
  components: {},
  data() {
    return {
      headPortrait: headPortrait,
      qrCode: "",
      qrCode1: [],
      isCentered: true,
      head_img: "",
      username: "",
      memberType: "",
      memberTypeId: "",
      showMyBalance: false,
      icons: [],
      myService: {
        name: "联系客服",
        img: myService
      },
      instance: "",
      telephone: '',
      allNums:''
    };
  },
  methods: {
    callPhone() {
      window.location.href = "tel://0755637";
    },
    bigImg() {
      var instance = ImagePreview({
        images: [this.qrCode1],
      });
      instance.showIndex = false;
      this.instance = instance;
    },
    getUserInfo() {
      getUserInfo()
        .then(res => {
          if (res.status == "1") {
            this.head_img = res.head_img;
            this.username = res.username;
            this.memberType = res.member_type;
            this.memberTypeId = res.member_type_id;
            this.telephone = res.telephone;
            this.allNums = res.order_info.all_nums;

            if(this.memberTypeId != 0) {
                this.getQrCode();
            }

            this.$nextTick(function () {
                this.$toast.clear();
            })

            this.getInfoList();

          } else if (res.status == "2") {
            Toast("账号被冻结");
            this.$router.go(-1);
          } else {
            Toast(res.info);
          }
        })
        .catch(err => {
        //   Toast(err.info ? err.info : '获取数据失败');
        });
    },
    getQrCode() {
      var url = 'https://'+ window.location.host + window.location.pathname + '#' + this.$route.path;
      var backUrl = window.btoa(url);

      getQrCode(backUrl)
        .then(res => { 
            if(res.status == 1){
                this.qrCode = res.pic;
                this.qrCode1.push(res.pic);
                
            }else{
               Toast('二维码获取失败'); 
            }
        })
        .catch(err => {
          Toast('二维码获取失败');
        });
    },
    getInfoList() {
      getInfoList()
        .then(res => {
          this.icons = res.icons;
        })
        .catch(err => {
        //   Toast(err.info ? err.info : '获取数据失败');
        });
    },
    goDetial(url){
        if(url == 'myPhone'){
            this.$router.push({name:url,query:{'telephone':this.telephone}})
        }else{
            this.$router.push({name:url})
        }
    }
  },
  created() {
    this.getUserInfo();
    if(this.qrCode == ''){
        this.$toast.loading({
        mask: true,
        message: "加载中" + "...",
        loadingType: "spinner",
        duration: 0
      });
    }
  },
  mounted() {},
  beforeRouteLeave(to, from, next) {
      if(this.instance != ''){
          this.instance.close();
      }
    next();
  }
};
</script>

<style lang="less">
.my {
  //   padding-top: 46px;
  background-color: #ffffff;
  .van-image-preview__image {
    max-width: 60%;
  }
  .van-cell__title {
    text-align: left;
  }
  .icon {
    width: 16px;
    height: 16px;
    line-height: 16px;
    vertical-align: middle;
  }
  .van-cell {
    font-size: 15px;
    line-height: 40px;
    .van-info{
        left: 90%;
        top: 1.8em;
    }
  }
  .van-cell-text {
    margin-left: 5px;
  }
  .van-cell__right-icon {
    line-height: 40px;
  }
  .van-cell:not(:last-child)::after {
    margin-right: 15px;
  }
  .my-info {
    background-color: #f4b656;
    padding: 24px 15px 0 15px;
    .van-card {
      border-radius: 5px 5px 0 0;
      padding: 20px 15px 20px 15px;
      padding-left: 80px;
      font-size: 14px;
      height: 120px;
    }

    .van-card__thumb {
      width: 55px;
      height: 55px;
      top: 50%;
      margin-top: -30px;
    }
    .van-card__footer {
      bottom: 15px;
      img {
        width: 75px;
        height: 75px;
        line-height: 75px;
      }
    }
    .van-card__content {
      display: inline-block;
      text-align: left;
      height: 20px;
      line-height: 20px;
      .van-card__row {
        display: inline-block;
      }
    }
    .member {
      display: inline-block;
      overflow: hidden;
      margin-left: 5px;
      .van-icon {
        vertical-align: middle;
      }
    }
    .member-rank {
      background-color: #ffd259;
      font-size: 10px;
      padding: 2px 5px;
      border-radius: 30px;
    }

    .van-card__title {
      max-height: 20px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      display: inline-block;
      max-width: 100px;
    }

    @media (max-width: 321px) {
      .van-card__footer {
        bottom: 8px;
      }
      .van-card__footer img {
        width: 55px;
        height: 55px;
        line-height: 55px;
      }
      .van-card {
        height: 80px;
        padding-left: 65px;
      }
      .van-card__thumb {
        left: 10px;
      }
      .van-card__thumb img {
        width: 40px;
        height: 40px;
      }
    }
  }
}
.van-image-preview__overlay {
  background-color: rgba(0, 0, 0, 0.7);
}
.van-swipe {
  .van-swipe-item {
    .van-image-preview__image {
      width: 60%;
    }
  }
}
</style>