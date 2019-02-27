<template>
	<div class="myOrderEvaluation">

		<!--评价打星星-->
		<van-list>
			<van-cell v-for="(item,index) in user_data" :key="index">
				<template slot="title">
					<div class="userInfo">
						<div class="userImg" :style="'background:url('+item.header_img+') center/cover no-repeat;'"></div>
						<div class="userName">{{item.name}}</div>
					</div>
					<van-rate v-model="star_num" /> 
				</template>
			</van-cell>
		</van-list>

		<!--评价框-->
		<div class="evaluationBox">
			<div class="topLine"></div>
			<div class="title">评价</div>
			<van-field v-model="message" type="textarea" placeholder="您对本次商品满意吗？说说您对本次服务的体验，帮助我们为您提供更好地服务~" rows="1" autosize />
			
			<van-row gutter="4">
				<van-col span="8" v-for='(imgSrc,index) in imgs_data' class="evaluationImg" :key='index'>
                    <img :src="imgSrc" alt="" width="100%" height="100%">
                </van-col>
				<van-col span="8" class="evaluationImg">
					<van-uploader :after-read="onRead" accept="image/*" multiple  style="width:110px;height:110px;">
						<van-icon :style="'width:110px;height:110px;background:url('+no_imgs+') center/cover no-repeat;'" />
					</van-uploader>
				</van-col>
			</van-row>

			<div class="btmLine"></div>
		</div>

		<!--匿名-->
		<div class="anonymous">
			<van-checkbox v-model="checked">匿名</van-checkbox>
			<div class="tip">你的评价能帮助其他小伙伴哦</div>
		</div>

        <!-- <van-toast mask message="加载中..." type="loading" v-model="msgLoading"></van-toast> -->

		<!--发表评价-->
		<div class="plusEvaluation" @click="SubmitComment">发表评价</div>
	</div>
</template>

<script>
import qrCode from "_img_/my/pingjia.png";
import { getOrderComment, getOrderDetails, subImg } from "@/api/order/index.js";
import { getUserInfo } from "@/api/my/userinfo.js";
import { List } from "vant";
import { Rate } from "vant";
import { Row, Col } from "vant";
import { Uploader } from "vant";
import { Checkbox, CheckboxGroup, Toast } from "vant";
export default {
  name: "myOrderEvaluation",
  components: {},
  data() {
    return {
      star_num: 0,
      message: "",
      leve: "未评价",
      leveNum: 0,
      checked: false,
      user_data: [],
      imgs_data: [],
      goodslist: [],
      no_imgs: qrCode,
      msgLoading: true,
      imgUrl: "",
      dwimg: [],
      files: []
    };
  },
  computed: {},
  methods: {
    SubmitComment() {
      if (this.leveNum <= 0) {
        Toast("请评价质量");
        return false;
      }
      if (this.message == "") {
        Toast("请输入评价内容");
        return false;
      }

      var goods_list = [];
      var is_name = this.checked == false ? 0 : 1; //是否匿名 1是 0 否
      var order_no = this.$route.query.order_no;

      this.$toast.loading({
        mask: true,
        message: "提交中" + "...",
        loadingType: "spinner",
        duration: 0
      });

      for (let item in this.goodslist) {
        goods_list.push({
          //商品评价信息数组
          order_goods_id: this.goodslist[item].order_goods_id, //订单商品id（tb_order_goods的主id）
          desc_star: this.leveNum, //描述相符的星星数量
          quality_star: this.leveNum, //商品质量的星星数量
          content: this.message, //评价内容
          slide_img: this.imgUrl //评价图片（数组、非必传）
        });
      }

      //   ;
      getOrderComment(order_no, "", "", is_name, goods_list)
        .then(res => {
          if (res.status == 1) {
            this.$toast.clear();
            Toast(res.info);
            let that = this;
            setTimeout(() => {
              that.$router.go(-1);
            }, 2000);
          } else {
            Toast(res.info);
            this.$router.go(0);
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
          this.$router.go(-1);
        });
    },
    ontpys(img) {
      let originWidth = img.width, // 压缩后的宽
        originHeight = img.height,
        maxWidth = 400,
        maxHeight = 400,
        quality = 0.8, // 压缩质量
        canvas = document.createElement("canvas"),
        drawer = canvas.getContext("2d");
      canvas.width = maxWidth;
      canvas.height = (originHeight / originWidth) * maxWidth;
      drawer.drawImage(img, 0, 0, canvas.width, canvas.height);
      let base64 = canvas.toDataURL("image/jpeg", quality); // 压缩后的base64图片
      let file = this.dataURLtoFile(base64, Date.parse(Date()) + ".jpg");
      file = { content: base64, file: file };
      this.files.push(file.content);
      // console.log(file);//压缩后的file
    },

    dataURLtoFile(dataurl, filename) {
      let arr = dataurl.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },
    onRead(file) {
      this.$toast.loading({
        mask: true,
        message: "图片上传中" + "...",
        loadingType: "spinner",
        duration: 0
      });
      //   console.log(file);//未压缩的file
      if (file instanceof Array) {
        this.files = [];
        let imgArr = [];
        file.forEach((el, index) => {
          this.imgs_data.push(el.content);

          let img = new Image();

          img.src = el.content;

          let that = this;

          img.onload = function() {
            that.ontpys(img);
            that.subImg();
          };
        });
      } else {
        this.imgs_data.push(file.content);
        let img = new Image();
        img.src = file.content;
        let that = this;
        img.onload = function() {
          that.ontpys(img);
          that.subImg();
        };
      }
      //   if (file instanceof Array) {
      //     file.forEach((el, index) => {
      //       this.imgs_data.push(el.content);
      //       filePath.push(el.content);
      //     });
      //   } else {
      //       this.base64ToBlob(file);
      //     filePath.push(file.content);
      //     this.imgs_data.push(filePath);
      //   }
      //   console.log(filePath[0] == filePath[1]);

      //   this.subImg(filePath);

      this.$nextTick(function() {
        var oEvaluationImg = document.getElementsByClassName("evaluationImg");
        var oEvaluationImgone = document.getElementsByClassName(
          "evaluationImg"
        )[0];
        var oEvaluationImg_num = document.getElementsByClassName(
          "evaluationImg"
        ).length;
        var imgWidth = oEvaluationImgone.offsetWidth;
        for (var i = 0; i < oEvaluationImg_num; i++) {
          oEvaluationImg[i].style.height = imgWidth + "px";
        }
      });
    },
    // oversize(file) {
    //     let imgSize = 0;
    //     if(file instanceof Array){
    //         file.forEach((el,index) => {
    //             imgSize += parseInt(el.file.size);
    //         });
    //     }else{
    //         imgSize += parseInt(file.file.size);
    //     }
    //     console.log(imgSize);
    //     Toast('图片上传失败,,图片太大，当前图片大小为：'+parseInt(imgSize/1024)+'Kb');
    // },
    subImg() {

      subImg(this.files)
        .then(res => {
          console.log(res);
          this.$toast.clear();
          if (res.status == 1) {
            this.imgUrl = res.pic;
            // this.imgs_data = res.pic_show;
            Toast("图片上传成功");
          } else {
            Toast("图片上传失败");
          }
        })
        .catch(err => {
          Toast("图片上传失败");
        });
    }
  },
  created() {},
  mounted() {
    //详情
    getOrderDetails(this.$route.query.order_no)
      .then(res => {
        if (res.status == 1) {
          this.goodslist = res.goods_list.list;
          for (let item in this.goodslist) {
            this.user_data.push({
              name: this.goodslist[item].goods_name,
              header_img: this.goodslist[item].goods_pic,
              star_num: 0
            });
          }
        } else {
          Toast(res.info);
          this.$router.go(-1);
        }
      })
      .catch(err => {
        Toast(err.info ? err.info : "获取数据失败");
        this.$router.go(-1);
      });

    this.$nextTick(function() {
      var oEvaluationImg = document.getElementsByClassName("evaluationImg");
      var oEvaluationImgone = document.getElementsByClassName(
        "evaluationImg"
      )[0];
      var oEvaluationImg_num = document.getElementsByClassName("evaluationImg")
        .length;
      var imgWidth = oEvaluationImgone.offsetWidth;
      for (var i = 0; i < oEvaluationImg_num; i++) {
        oEvaluationImg[i].style.height = imgWidth + "px";
      }
    });
  },
  watch: {
    star_num(val) {
      this.leveNum = val;
      switch (val) {
        case 1:
          this.leve = "极差";
          break;
        case 2:
          this.leve = "差";
          break;
        case 3:
          this.leve = "一般";
          break;
        case 4:
          this.leve = "好";
          break;
        case 5:
          this.leve = "很好";
          break;
      }
    }
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.myOrderEvaluation {
  padding-bottom: 50px;
  padding-top: 44px;
  background: #fff;
  min-height: calc(100vh - 44px);
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
        }
        /*星星*/
        .van-rate {
          .van-rate__item {
            padding: 2px 5px 0 0;
          }
        }
      }
    }
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
  }
  /*评价框*/
  .evaluationBox {
    .topLine {
      height: 10px;
      background: #f5f5f5;
    }
    .btmLine {
      height: 2px;
      background: #f5f5f5;
    }
    .title {
      padding: 15px;
      font-size: 15px;
      color: #333;
    }
    /*输入框*/
    .van-field {
      padding: 0px 15px;
    }
    /*图片列表*/
    .van-row {
      padding: 15px;
      .evaluationImg {
         max-height: 110px;
        margin-bottom: 4px;
        overflow: hidden;
        // margin: 1px;
        // width: calc(33.333% - 2px);
      }
    }
  }
  /*匿名*/
  .anonymous {
    padding: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .tip {
      font-size: 14px;
      color: #999;
    }
    .van-checkbox {
      .van-checkbox__icon--checked .van-icon {
        border-color: #fff;
        background-color: #fff;
        color: #999;
        border: 1px solid #aaa;
      }
    }
  }
  /*发表评价*/
  .plusEvaluation {
    position: fixed;
    bottom: 0;
    width: 100vw;
    background: #e55680;
    height: 41px;
    line-height: 41px;
    color: #fff;
    font-size: 17px;
    text-align: center;
  }
}
</style>