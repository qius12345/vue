<template>
    <div class="address-list">
    <van-swipe-cell :right-width="65" >
        <!-- <span slot="left">编辑</span> -->
        <van-cell-group>
            <van-row class="radio-box" v-if="checkName" @click="onEdit(id)">
                <van-cell class="address-list-tel" :title="title" :value="tel" :border="false" />
                <van-cell class="address-list-text" :value="address" :border="false" />

                <van-radio-group v-model="radio" v-if="isdefault == 1" >
                    <van-radio name="1" class="radio" @click.native="changeRadio(checkName)">默认地址</van-radio>
                </van-radio-group>

                <van-radio class="radio" :name="checkName"  clickable @click="changeRadio(checkName)" v-if="isdefault != 1">设置为默认地址</van-radio>
                <span class="edit" @click="onEdit(id,listkey)">编辑</span>
            </van-row>

        </van-cell-group>
        
        <span slot="right" class="right del" @click="onDelete(id)">删除</span>
    </van-swipe-cell>
    </div>
</template>
<script>
import {
  getAddress_list,
  getAddress_Del,
  setAddress_Default
} from "@/api/my/address.js";
import { Toast, Dialog } from "vant";
export default {
  name: "address-list",
  props: {
    id: [String, Number],
    title: String,
    tel: String,
    address: String,
    listkey: [String, Number],
    checkName: [String, Number],
    isdefault: [String, Number]
  },
  data() {
    return {
      radio: "1"
    };
  },
  methods: {
    onDelete(idd) {
      Dialog.confirm({
        title: "确定删除吗?",
        message: ""
      })
        .then(() => {
          getAddress_Del(idd)
            .then(rst => {
              if (rst.status == "1") {
                this.$emit("getAddressListData");
                Toast(rst.info);
              } else {
                Toast(rst.info);
              }
            })
            .catch(err => {
              Toast(err + "删除失败，请稍候再试");
            });
        })
        .catch(err1 => {});
    },
    changeRadio(checkId) {
        this.$emit('changeRadio',checkId);
    },
    onEdit(idd, key) {
      sessionStorage.setItem("addressid", idd);
      sessionStorage.setItem("keyIndex", key);
      this.$emit("AddressEdit");
    }
  },
  created() {}
};
</script>

<style lang="less">
.address-list {
    .radio-box{
        position: relative;
        .edit{
            position: absolute;
            right: 15px;
            bottom: 10px;
        }
    }
  .address-list-text {
    margin-top: -10px;
  }

  .radio {
    padding-left: 10px;
    padding-bottom: 10px;
  }
  .right {
    color: #ffffff;
    font-size: 15px;
    width: 65px;
    height: 109px;
    display: inline-block;
    text-align: center;
    line-height: 109px;
    background-color: #f44;
  }
  .del {
    margin-left: 1px;
  }
}
</style>


