<template>
    <div class="myPhone">
        <div class="myPhone-logo">
            <img :src="phoneLogo" width="100%" alt="">
            <h5>乐康然</h5>
        </div>
        
        <van-cell-group class="input-group" v-if="myPhone == ''">
            <van-field
                v-model="phone"
                placeholder="请输入手机号"
                left-icon="contact"
                type="Number"
            />
            <van-field
                v-model="code"
                center
                clearable
                placeholder="请输入验证码"
                left-icon="contact"
            >
            <van-button slot="button" @click="getCode" size="small" v-show="is_dxyz">验证码</van-button>
            <van-button slot="button"  size="small" v-show="!is_dxyz">{{time}}</van-button>
            </van-field>
            
        </van-cell-group>

        <van-cell-group v-else class="havaPhone">
            <van-cell value="您已绑定手机号码" />
            <van-cell class="myNewPhone" :value="myPhone" />
        </van-cell-group>

        <div class="my-phone-sib">
            <van-button type="primary" v-if="myPhone == ''" size="large" @click="setBindPhone">绑定</van-button>      
            <van-button class="changeBtn" type="primary" v-else size="large" @click="changePhone">更换</van-button>      
        </div>
    </div>
</template>


<script>
import { Toast, Dialog } from "vant";

import phoneLogo from "_img_/my/my_phone_logo.png";
import userNameIcon from "_img_/my/my_phone_userName.png";
import userPasswordIcon from "_img_/my/my_phone_userPassword.png";

import { setBindPhone } from "@/api/my/myphone.js";
import { getMessageCode } from "@/api/my/userinfo.js";
import { getBindPhone } from "@/api/my/myphone.js";

export default {
  name: "myPhone",
  components: {},
  data() {
    return {
      phoneLogo: phoneLogo,
      code: "",
      phone: "",
      is_dxyz: true,
      time: 60,
      userNameIcon: userNameIcon,
      userPasswordIcon: userPasswordIcon,
      myPhone: ""
    };
  },
  methods: {
    setBindPhone() {
      var reg = 11 && /^((13|14|15|16|17|18)[0-9]{1}\d{8})$/;
      if (this.phone == "") {
        Toast("请输入手机号");
        return false;
      } else if (!reg.test(this.phone)) {
        Toast("手机格式不正确");
        return false;
      }
      if (this.code == "" || this.code.length != 6) {
        Toast("请输入正确验证码");
        return false;
      }
      getBindPhone(this.phone, this.phone, this.code)
        .then(res => {
          if (res.status == "1") {
            Toast("绑定成功");
            // this.$router.go(-1);
            this.$router.push({ name: "home" });
          } else if (res.status == "2") {
            Toast(res.info);
          } else {
            Toast(res.info);
          }
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    getCode() {
      var reg = 11 && /^((13|14|15|17|18)[0-9]{1}\d{8})$/;
      if (this.phone == "") {
        Toast("请输入手机号");
        return false;
      } else if (!reg.test(this.phone)) {
        Toast("手机格式不正确");
        return false;
      }
      this.dx_yzb();
      let codetype = "666";

      //获取验证码
      getMessageCode(this.phone, codetype)
        .then(res => {
          Toast(res.info);
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    dx_yzb() {
      this.is_dxyz = false;
      let dx_djs = setInterval(() => {
        this.time--;

        if (this.time <= 0) {
          this.time = 60;
          this.is_dxyz = true;
          clearInterval(dx_djs);
        }
      }, 1000);
    },
    changePhone() {
      this.myPhone = "";
      // this.$router.go(0);
    }
  },
  created() {
    if (this.$route.query.telephone) {
      this.myPhone = this.$route.query.telephone;
    }
  },
  mounted() {
    var bodyHeight = window.screen.height;
    var myPhone = document.getElementsByClassName("myPhone");
    myPhone[0].style.height = bodyHeight + "px";
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.myPhone {
  background-color: #ffffff;
  //   padding-bottom: 130px;
  padding-top: 46px;
  .myPhone-logo {
    width: 113px;
    margin: 0 auto;
    text-align: center;
    padding: 45px 0 45px 0;
    h5 {
      margin-top: 18px;
      font-size: 18px;
      text-align: center;
      font-weight: 400;
      position: relative;
      left: 8px;
      letter-spacing: 2px;
    }
  }
  .input-group {
    padding: 0 36px;
    margin-bottom: 58px;
    .van-cell__left-icon {
      margin-right: 12px;
    }
    .van-cell:last-child::after {
      border-bottom-width: 1px;
    }
    .van-field__button {
      .van-button {
        width: 90px;
        font-size: 14px;
        color: @descColor;
        border-color: @descColor;
      }
    }
    .van-field__control {
      font-size: 16px;
    }
  }
  .van-hairline--top-bottom::after {
    border-width: 0;
  }
  .my-phone-sib {
    padding: 0 15px;
    .van-button--large {
      //   border-color: @activeColor;
      //   background-color: @activeColor;
      height: 42px;
      line-height: 42px;
      margin-bottom: 25px;
    }
  }
  .changeBtn {
    margin-top: 30px;
  }
  .havaPhone {
    .van-cell__value {
      text-align: center;
      color: @descColor;
    }
    .van-cell:not(:last-child)::after {
      border-bottom: none;
    }
    .myNewPhone {
      padding-top: 0;
      .van-cell__value {
        color: @titleColor;
        font-size: 30px;
      }
    }
    .van-cell {
      line-height: 36px;
    }
  }
}
</style>
