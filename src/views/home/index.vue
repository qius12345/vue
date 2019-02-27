<template>
    <div class="home" v-if="sessionToken">
        <div class="home_main" v-cloak>
            <div class="swiper-box">
                <van-swipe :loop="loop">
                    <van-swipe-item v-if="video != ''" class="video-swiper" @click.native="playVideo">
                        <video id="myvideo" :src="video" :muted="muteStatus" width="100%">
                            您的手机不支持视频播放
                        </video>
                        <div class="video-swiper-pay" v-if="isPlay">
                            <van-icon name="play" />
                        </div> 
                        <div class="video-cover" v-if="videoCoverPlay"><img :src="videoImg" width="100%" alt=""></div>
                    </van-swipe-item>
                    <van-swipe-item v-for="(image ,index) in images" :key="index"><img :src="image.img_pic" alt="" width="100%">
                        <div class="pz"></div>
                    </van-swipe-item>
                </van-swipe>
                <div class="message" @click="$router.push({name:'message'})">
                    <img :src="messageCount > 0 ? messageIcon1 : messageIcon" alt="">
                    <div class="van-info"></div>
                </div>
            </div>
            <van-row class="shopList" gutter="10">
                <van-col span="12" v-for="(good,index) in goodList" :key="index" @click.native="$router.push({name:'shopDetails', query: {'shopId': good.goods_id}})">
                    <div class="shop_img_box">
                        <img :src="good.goods_logo" width="100%" height="100%" alt="">
                    </div>
                    <van-cell-group>
                        <van-cell :value="good.goods_name" />
                        <van-cell :title="'￥'+good.goods_price" size="small">
                            <van-button type="primary" size="small" class="buyBtn">立即购买</van-button>
                        </van-cell>
                    </van-cell-group>
                </van-col>
            </van-row>
            <div class="index-footer" @click="$router.push({name:'introduce',query:{'bannerId':bannerId}})">
                <!-- <van-button type="primary" size="large" @click="$router.push({name:'shopDetails'})">立即购买</van-button>    -->
                <img :src="mainImg" alt="" width="100%">
                <!-- <div class="index-footer-text">进入页面</div> -->
            </div>
        </div>
    </div>
</template>


<script>
import indexImg from "_img_/home/index_img.jpg";
import messageIcon from "_img_/home/index_message_icon.png";
import messageIcon1 from "_img_/home/index_message_icon2.png";
import { Toast, Loading } from "vant";
import {
  getHomeBanner,
  getHomeImg,
  getMessageCount,
  getGoodsList
} from "@/api/home/index.js";
import { checkLogin } from "@/api/my/login.js";
import { getQrCode } from "@/api/my/userinfo.js";

export default {
  name: "Home",
  components: {},
  data() {
    return {
      images: [],
      mainImg: "",
      messageIcon: messageIcon,
      messageIcon1: messageIcon1,
      messageCount: "",
      loadingIcon: true,
      loop: true,
      muteStatus: false,
      video: "",
      videoImg: "",
      playStatus: false,
      isPlay: true,
      videoCoverPlay: true,
      myVideo: "",
      paused: "",
      goodList: '',
      bannerId: '',
      sessionToken: ''
    };
  },
  methods: {
    getBannerList() {
      getHomeBanner()
        .then(res => {
          if (res.status == "1") {
            this.images = res.list;
            this.video = res.video;
            this.videoImg = res.pic;
          } else {
            //   Toast('暂无图片');
          }
            
        })
        .catch(err => {
            // Toast('暂无图片');
          // Toast(err.info ? err.info : '获取数据失败');
        });
      getHomeImg()
        .then(res => {
            if(res.status == 1){
                this.mainImg = res.list[0].img_pic;
                this.bannerId = res.list[0].banner_id;
            }

        })
        .catch(err => {
          // Toast(err.info ? err.info : '获取数据失败');
        });
      getMessageCount()
        .then(res => {
            if(res.status == 1){
                this.messageCount = res.count_total;
                
            }
        })
        .catch(err => {
          // Toast(err.info ? err.info : '获取数据失败');
        });
    },
    getGoodsList() {
        getGoodsList().then((res)=>{
            if(res.status == 1){
                this.goodList = res.list;
                this.$toast.clear();
            }
        }).catch((err)=>{

        })
    },
    playVideo() {
      this.myVideo = document.getElementById("myvideo");
      let newVideo = this.myVideo;

      newVideo.addEventListener('ended', () => {
          this.isPlay = true;
      })

      if (newVideo.paused) {
        newVideo.play();
      } else {
        newVideo.pause();
      }

      this.isPlay = !this.isPlay;
      this.videoCoverPlay = false;
    },
  },
  mounted() {
      
  },
  created() {
      this.sessionToken = sessionStorage.getItem("token");
      if(this.sessionToken){

        this.getBannerList();
        this.getGoodsList();
        this.$toast.loading({
            mask: true,
            message: "加载中" + "...",
            loadingType: "spinner",
            duration: 0
        })
      }
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.home {
  //   padding-top: 46px;
  background-color: #ffffff;
  .swiper-box {
    // height: 220px;
    // padding-bottom: 40px;
    // position: relative;
    margin-bottom: 10px;
    .van-swipe {
    //   position: static;
    }
    .van-swipe__indicators {
    //   bottom: 15px;
    }
    .message {
      position: absolute;
      right: 16px;
      top: 11px;
      width: 42px;
      height: 42px;
      padding-top: 0;
      img {
        width: 100%;
      }
    }
    .pz {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: content-box;
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
  .van-button--large {
    height: 42px;
    line-height: 42px;
    margin-bottom: 25px;
    background: @activeColor;
    border-color: @activeColor;
  }
  .index-footer {
    padding: 0 15px;
    position: relative;
    .index-footer-text{
        color: @activeColor;
        position: absolute;
        right: 0;
        bottom: 0;
        z-index: 2;
        font-size: 11px;
        right: 25px;
        bottom: 10px;
    }
  }
  .video-swiper {
    background-color: #000000;
  }
  .video-swiper-pay {
    position: absolute;
    left: 50%;
    top: 50%;
    -ms-transform: translate(-50%, -50%); /* IE 9 */
    -moz-transform: translate(-50%, -50%); /* Firefox */
    -webkit-transform: translate(-50%, -50%); /* Safari 和 Chrome */
    transform: translate(-50%, -50%);
    z-index: 888;
    color: #ffffff;
    font-size: 50px;
  }
  .video-cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .shopList{
    padding: 0 15px;
    
    margin-bottom: 10px;
    .van-cell{
        background-color: #f7f7f7;
        padding: 0;
        .van-cell__title{
            color: #f36745;
        }
        .buyBtn{
            background: @activeColor;
            border-color: @activeColor;
            font-size: 10px;
            height: 16px;
            line-height: 16px;
        }
    }
    .van-cell:not(:last-child)::after{
        border-bottom:none;
    }
    .van-hairline--top-bottom::after{
        border-width: 0;
    }
    .van-cell-group{
        background-color: #f7f7f7;
        .van-col{
            background-color: #f7f7f7;
        }
    }
    .shop_img_box{
        height: 110px;
    }
  }
}
</style>
