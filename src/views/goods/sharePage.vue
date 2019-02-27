<template>
    <div class="sharePage">
        <div class="shareImg">
            <img :src="banner" alt="" width="100%">
        </div>

        <van-cell-group class="shop-msg">
            <van-cell class="shopTitle" :title="goodsName" :label="goodsDesc" />
            <van-cell class="shopPrice">
                <template slot="title">
                    <span class="van-cell-text"><i>￥</i>{{ goodsPrice }}</span>
                </template>
            </van-cell>
            <div class="qrCode" @click="bigImg">
                <img :src="qrCode" alt="">
            </div>
        </van-cell-group>
        <van-radio-group v-model="shareRadio">
            <van-radio name="1">分享时保存图片</van-radio>
        </van-radio-group>
        <van-row class="shareSite">
            <van-col span="12" class="shareIcon1"><img :src="shareIcon1" alt="" @click="showShareArrow"><p>微信朋友圈</p></van-col>
            <van-col span="12" class="shareIcon2"><img :src="shareIcon2" alt="" @click="showShareArrow"><p>微信好友</p></van-col>
        </van-row>
        <van-popup v-model="showArrow">
            <img :src="shareArrow" alt="">
        </van-popup>
    </div>
</template>


<script>
// import banner from "_img_/home/index_banner.jpg";

import shareIcon1 from "_img_/my/share_icon1.png";
import shareIcon2 from "_img_/my/share_icon2.png";
import shareArrow from "_img_/shop/share.png";
import { getGoodShare } from "@/api/share/index.js";
import { Dialog, Toast } from "vant";
import { ImagePreview } from "vant";
import { getQrCode } from "@/api/my/userinfo.js";

import wx from "weixin-js-sdk";

export default {
  name: "shopDetails",
  components: {},
  data() {
    return {
      loading: false,
      qrCode1: [],
      banner: "",
      goodsName: "",
      goodsDesc: "",
      goodsPrice: "",
      qrCode: "",
      shareRadio: "1",
      shareIcon1: shareIcon1,
      shareIcon2: shareIcon2,
      showArrow: false,
      shareArrow: shareArrow,
      instance: "",
      shareInfo: "",
      shareMsg: ""
    };
  },
  methods: {
    getQrCode() {
      var url =
        "https://" +
        window.location.host +
        window.location.pathname +
        "#" +
        this.$route.path;
      var backUrl = window.btoa(url);
      getQrCode(backUrl)
        .then(res => {
          this.qrCode = res.pic;
          this.qrCode1.push(res.pic);
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    bigImg() {
      var instance = ImagePreview({
        images: [this.qrCode1]
      });
      instance.showIndex = false;
      this.instance = instance;
    },
    showShareArrow() {
      this.showArrow = true;
      // console.log(wx);
    },
    shareFriend() {
      var that = this;
      let pageUrl = window.location.href.split("?");

      let id = that.$route.query.id;
      let pid = that.$route.query.pid;

      let url;

      let shareUrl =
        "https://www.lekangran.com/Wx/redirect.html?id=" + id + "&pid=" + pid;

      window.btoa(shareUrl);
      wx.config({
        debug: false, // 开启调试模式
        appId: that.shareInfo.appId, // 必填，公众号的唯一标识
        timestamp: that.shareInfo.timestamp, // 必填，生成签名的时间戳
        nonceStr: that.shareInfo.nonceStr, // 必填，生成签名的随机串
        signature: that.shareInfo.signature, // 必填，签名，见附录1
        jsApiList: [
          "onMenuShareAppMessage", // 获取“分享给朋友”按钮点击状态及自定义分享内容接口
          "onMenuShareTimeline",
          "updateAppMessageShareData",
          "updateTimelineShareData" // 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口
        ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });

      

      wx.ready(function() {
        //需在用户可能点击分享按钮前就先调用
        wx.updateAppMessageShareData(
          {
            title: that.shareInfo.title, // 分享标题
            desc: that.shareInfo.desc, // 分享描述
            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: that.shareInfo.img_url // 分享图标
          },
          function(res) {
            //这里是回调函数
            // alert(11);
          }
        );
        wx.updateTimelineShareData(
          {
            title: that.shareInfo.title, // 分享标题
            link: shareUrl, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
            imgUrl: that.shareInfo.img_url // 分享图标
          },
          function(res) {
            //这里是回调函数
            // alert(pageUrl);
          }
        );
        wx.error(function(err) {
          console.log(err);
          // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        });
      });
    },
    getGoodShare() {
      let pageUrl;
      pageUrl = window.btoa(window.location.href.split('#')[0]);
      console.log(window.location.href);
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isiOS) {
        pageUrl = window.btoa(window.location.href.split('#')[0]);
        console.log(window.location.href.split('#')[0]);
      }
      
      getGoodShare(pageUrl)
        .then(res => {
          this.goodsName = res.goods_name;
          this.goodsDesc = res.goods_desc;
          this.goodsPrice = res.goods_price;
          this.banner = res.share_logo;
          this.shareInfo = res.share_info;
          this.shareMsg = res;

          this.shareFriend();
        })
        .catch(err => {
          //   Toast(err.info ? err.info : "获取数据失败");
        });
      this.getQrCode();
    }
  },
  created() {
    this.getGoodShare();
  },
  mounted() {
    var bodyHeight = window.screen.height;
    var myBalance = document.getElementsByClassName("sharePage");
    myBalance[0].style.height = bodyHeight + "px";
  },
  beforeRouteLeave(to, from, next) {
    if (this.instance != "") {
      this.instance.close();
    }
    next();
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";

.sharePage {
  background-color: #ffffff;
  padding-top: 46px;
  .van-cell {
    text-align: left;
  }
  .shopTitle {
    padding-bottom: 0;
    .van-cell__title {
      font-size: 15px;
    }
    .van-cell__label {
      font-size: 13px;
      line-height: 26px;
      color: @descColor;
    }
  }
  .shopPrice {
    padding-top: 0;
    .van-cell__title {
      color: @priceColor;
    }
    .van-cell__value {
      font-size: 14px;
      color: @descColor;
    }
    .van-cell-text {
      font-weight: 700;
      font-size: 16px;
      i {
        font-style: normal;
        font-size: 12px;
        margin-right: -2px;
      }
    }
  }
  .shop-msg {
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
  }
  .qrCode {
    position: absolute;
    right: 15px;
    top: 10px;
    img {
      width: 68px;
      height: 68px;
    }
  }
  .van-radio {
    padding-left: 15px;
    padding-top: 15px;
    color: @descColor;
    font-size: 12px;
    van-radio__input {
      font-size: 16px;
    }
  }
  .shareSite {
    text-align: center;
    background-color: #ffffff;
    padding: 20px 0;
    .shareIcon1 {
      p {
        font-size: 12px;
        margin: 0;
      }
      img {
        width: 50px;
        height: 50px;
      }
    }
    .shareIcon2 {
      p {
        margin: 0;
        font-size: 12px;
      }
      img {
        width: 50px;
        height: 50px;
      }
    }
  }
  .van-hairline--top-bottom::after {
    border-top-width: 0;
    border-bottom-width: 5px;
    border-bottom-style: dashed;
  }
  .van-popup {
    top: 0;
    left: auto;
    right: 0;
    background-color: transparent;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    width: 50%;
    img {
      width: 100%;
    }
  }
}
.van-swipe {
  .van-swipe-item {
    .van-image-preview__image {
      width: 60%;
    }
  }
}
</style>
