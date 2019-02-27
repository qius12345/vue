<template>
	<div class="myOrderDetail">
		


		

		<div class="SegmentingLine"></div>

		<!--商品信息-->
		<van-card class="shopInfo" :title="shopInfo.shopName" :desc="shopInfo.shopDesc" :num="shopInfo.shopNum" :price="shopInfo.shopPrice" :thumb="shopInfo.shopImg" />

		<div class="SegmentingLine"></div>

		<!--物流信息-->
		<van-cell-group class="logisticsInfo">
			<van-actionsheet
            v-model="show1"
                :actions="actions"
                cancel-text="取消"
                @select="onSelect"
                @cancel="onCancel"
            />
			<van-cell title="退款/退货原因" is-link :value="reason" @click="show1 = true">
				
			</van-cell>
			
			<van-cell title="退款金额" :value="'￥'+totalPrice"></van-cell>
		</van-cell-group>

		

		<van-cell-group class="logisticsInfo">
			
			<van-field
    v-model="desc"
    label="售后说明"
	placeholder="选填"
    
  />
			
		</van-cell-group>
		
		
		<div class="SegmentingLine"></div>
		
		
		<!--上传凭证-->
		<van-cell-group class="orderInfo">
			<van-cell title="上传凭证" class="title" />
			<van-row gutter="1">
			
				<van-col span="8" v-for='(imgSrc,index) in imgs_data' class="evaluationImg" :key='index' :style="'background:url('+imgSrc+') center/cover no-repeat;'"></van-col>
				<van-col span="8" class="evaluationImg">
					<van-uploader :after-read="onRead" accept="image/gif, image/jpeg" multiple  style="width:110px;height:110px;">
						<van-icon :style="'width:110px;height:110px;background:url('+no_imgs+') center/cover no-repeat;'" />
					</van-uploader>
				</van-col>

				
			</van-row>
			
		</van-cell-group>
		
		
		
		<van-button type="danger" style="width:100%; position:fixed;bottom:0px;" @click="submitSave()">提交</van-button>
		
	</div>


	
	



</template>

<script>
import qrCode from "_img_/my/pingjia.png";
import { Icon } from "vant";
import { Cell, CellGroup } from "vant";
import { List } from "vant";
import { Button } from "vant";
import { Card, Toast, Dialog } from "vant";
import {
  getOrderDetails,
  getCancleOrder,
  getConfirmOrder,
  getApply_aftersales
} from "@/api/order/index.js";

export default {
  name: "myOrderDetail",
  components: {},
  data() {
    return {
      order_no: "",
      reason: "请选择",
      desc: "",
      totalPrice: "0.00",

      shopInfo: {
        shopName: "",
        shopImg: "",
        shopPrice: "",
        shopNum: 1,
        shopDesc: ""
      },
      show1: false,
      actions: [
        {
          name: "请选择"
        },
        {
          name: "我不想要了"
        },
        {
          name: "商品描述与实物不符"
        },
        {
          name: "质量问题"
        },
        {
          name: "包装/商品损坏/污渍"
        },
        {
          name: "卖家发错货"
        }
      ],
      imgs_data: [],
      goodslist: [],
      no_imgs: qrCode
    };
  },
  methods: {
    onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.show1 = false;
      //Toast(item.name);
      this.reason = item.name;
    },
    onCancel() {
      //this.$toast('cancel');
    },
    submitSave() {
      if (this.reason == "" || this.reason == "请选择") {
        Toast("请选择退款原因");
        return;
      }
      var slide_img = this.imgs_data;

      getApply_aftersales(this.order_no, this.reason, this.desc, this.imgs_data)
        .then(res => {
          if (res.status == 1) {
            Toast(res.info);
            this.$router.go(-1);
          } else {
            Toast(res.info);
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : '获取数据失败');
        });
    },
    onRead(file) {
      var filePath = file.content;
      this.imgs_data.push(filePath);

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
    }
  },
  created() {},
  mounted() {
    this.order_no = this.$route.query.order_no;
    if (this.order_no == "") {
      Toast("异常错误");
      this.$router.go(-1);
      return;
    }
    getOrderDetails(this.order_no)
      .then(res => {
        console.log(res.order_info.order_status);

        if (res.status == 1) {
          //收货

          this.totalPrice = res.order_info.total_price;

          this.shopInfo = {
            shopName: res.goods_list.list[0].goods_name,
            shopImg: res.goods_list.list[0].goods_pic,
            shopPrice: res.goods_list.list[0].goods_price,
            shopNum: res.goods_list.list[0].goods_nums,
            shopDesc: res.goods_list.list[0].sku_info
          };
        } else {
          Toast(res.info);
          this.$roter.go(-1);
        }
      })
      .catch(err => {
        Toast(err.info ? err.info : '获取数据失败');
        this.$router.go(-1);
      });
  },
  computed: {}
};
</script>

<style lang="less">
@import "../../styles/color.less";
.myOrderDetail {
  padding-top: 44px;
  min-height: calc(100vh - 44px);
  background: #fff;
  /*灰色分割线*/
  .SegmentingLine {
    height: 10px;
    background: #f5f5f5;
  }
  /*订单状态*/
  .orderStateList {
    .van-cell {
      height: 55px;
      background: #e55680;
      padding: 0 15px;
      line-height: normal;
      font-size: 21px;
      align-items: center;
      .van-cell__title {
        color: #fff;
        line-height: 1;
        display: flex;
        align-items: center;
        .van-icon {
          margin-left: 10px;
          vertical-align: middle;
          font-size: 15px;
        }
      }
    }
  }
  /*按钮*/
  .btnList {
    padding: 15px;
    font-size: 0;
    .van-button {
      height: 34px;
      width: 102px;
      line-height: 34px;
      border: solid 1px #b1b1b1;
      font-size: 14px;
      color: #666666;
      margin-right: 15px;
    }
    .successTip {
      font-size: 14px;
      margin-bottom: 15px;
      color: #000;
    }
  }
  /*收件人信息*/
  .userInfoList {
    padding: 15px;
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
    .van-cell {
      padding: 0;
      /*收件人信息*/
      .van-cell__title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .name {
          font-size: 15px;
          color: #333;
        }
        .phone {
          font-size: 12px;
          color: #333;
        }
      }
    }
    .address {
      .van-cell__title {
        font-size: 14px;
        color: #333;
      }
    }
    .van-cell:first-child {
      padding: 0 0 5px 21px;
    }
  }
  /*商品信息*/
  .shopInfo {
    margin: 0;
    background: #fff;
    padding: 20px 15px 20px 105px;
    height: 78px;
    box-sizing: inherit;
    /*图片*/
    .van-card__thumb {
      width: 78px;
      height: 78px;
      top: 20px;
    }
    .van-card__content {
      .van-card__row {
        height: 39px;
        align-items: center;
      }
    }
  }
  /*物流信息*/
  .logisticsInfo {
    .title {
      .van-cell__title {
        span {
          font-size: 16px !important;
          color: #333 !important;
          font-weight: bold;
        }
      }
      .van-icon {
        color: #666666;
      }
    }
    .van-cell {
      .van-cell__title {
        font-size: 14px;
        color: #333;
        span {
          color: #999;
        }
      }
    }

    .van-cell:not(:last-child)::after {
      margin-right: 15px;
    }
  }

  /*订单信息*/
  .orderInfo {
    .title {
      .van-cell__title {
        span {
          font-size: 16px !important;
          color: #333 !important;
          font-weight: bold;
        }
      }
      .van-icon {
        color: #666666;
      }
    }
    .van-cell {
      .van-cell__title {
        font-size: 14px;
        color: #333;
        span {
          color: #999;
        }
      }
    }

    .van-cell:not(:last-child)::after {
      margin-right: 15px;
    }
  }

  /*商品总价及运费*/
  .shopInfoTwo {
    .title {
      .van-cell__title {
        span {
          font-size: 16px !important;
          color: #333 !important;
          font-weight: bold;
        }
      }
      .van-icon {
        color: #666666;
      }
    }
    .van-cell {
      .van-cell__title {
        .shopMoney,
        .freight {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #333;
          font-size: 14px;
        }

        .shopMoneyCount {
          color: #e55680;
          font-size: 16px;
          text-align: right;
          font-weight: bold;
        }
      }
    }

    .van-cell:not(:last-child)::after {
      margin-right: 15px;
    }
  }

  /*底部提示语句*/
  .footTip {
    font-size: 12px;
    text-align: center;
    padding: 15px 0;
    color: #666;
  }
}
</style>