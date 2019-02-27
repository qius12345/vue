<template>
    <div class="address">
        <van-list @load="onLoad" v-if="listData.length > 0">
            <van-radio-group v-model="isDefaultChecked">
                <van-cell-group v-for="(item,index) in listData" :key="item.address_id" @click.native="backAddressId(item.address_id)">
                    <AddressItem 
                        :id="item.address_id"
                        :listkey="index" 
                        :title="item.consignee"
                        :tel="item.telephone"
                        :isdefault="item.is_default"
                        :address="item.province + item.city+item.district+item.address"
                        :checkName="item.address_id"
                        @getAddressListData="getAddressListData"
                        @AddressEdit="AddressEdit"
                        @click="onEdit(item.address_id)"
                        @changeRadio="setAddressDefault"
                    />
                </van-cell-group>
            </van-radio-group>
        </van-list>

        <div class="nullLocalhost" v-else>
            <img :src="nullLocalhost" alt="">
            <p>您还没有常用地址，快添加吧</p>
        </div>

        <van-row class="button-fixed-bottom">
            <van-button size="large" class="buttonAdd" @click="addSite()">
                <van-icon name="add-o" />
                <i>新增收货地址</i>
            </van-button>
        </van-row>

        <van-popup v-model="showAdd" position="right" class="popup" >
            <van-nav-bar
                title="添加地址"
                left-text=""
                left-arrow
                @click-left="onClickLeft"
            />
            <div style="padding-top:46px">
                <van-address-edit
                    :area-list="areaList"
                    show-set-default
                    show-search-result
                    :search-result="searchResult"
                    @save="onAddSave"
                    @change-detail="onChangeDetail"
                />
            </div>
        </van-popup>

        <!--编辑地址-->
        <van-popup v-model="showEdit" position="right" class="popup">
            <van-nav-bar
                title="编辑地址"
                left-text=""
                left-arrow
                @click-left="onClickLeft1"
            />
            <div style="padding-top:46px">
            <van-address-edit
                :area-list="areaList"
                :address-info="addressInfo"
                show-delete
                show-set-default
                show-search-result
                :search-result="searchResult"
                @save="onEditSave"
                @delete="onEditDelete"
            />
            </div>  
        </van-popup>
    </div>
    
    
</template>

<script>

import areaList from "@/common/js/area.js";

import { Dialog, Toast } from "vant";
import AddressItem from "@/components/address-item.vue";
import {
  getAddress_list,
  getAddress_Add,
  getAddress_Edit,
  getAddress_Del,
  getAddress_Deatil,
  setAddress_Default
} from "@/api/my/address.js";
import { getOrderList } from "@/api/order/index.js";

import nullLocalhost from "_img_/my/nullsite.png";

export default {
  name: "MyLocalhost",
  components: {
    AddressItem
  },
  data() {
    return {
      nullLocalhost:nullLocalhost,
      name: "",
      areaList,
      searchResult: [],
      showAdd: false,
      showEdit: false,
      radio: "1",
      loading: false,
      finished: false,
      isdefault: 0,
      isDefaultChecked: 0,
      result: [],
      addressInfo: {
        id: "1",
        name: "张三",
        tel: "13000000000",
        province: '',
        city: '',
        county: '',
        areaCode: '',
        postalCode: '',
        addressDetail: '',
      },
      chosenAddressId: "57",
      listData: [],
      address_Deatil: [
        {
          name: "abdd",
          address_id: 0,
          consignee: "",
          telephone: "",
          province: "",
          city: "",
          districe: "",
          address: "",
          is_default: 0
        }
      ]
    };
  },
  methods: {
    onLoad() {},
    onClickLeft() {
      this.showAdd = false;
    },
    onClickLeft1() {
      this.showEdit = false;
    },
    onAddSave(content) {
      let len = this.listData.length + 1;
      let addr = new Object();
      var is_default = 0;
      console.log(content)
      //判断是否选中默认
      if (content.isDefault) {
        is_default = 1;
      } else {
        is_default = 0;
      }

      addr = {
        id: len,
        name: content.name, //姓名
        tel: content.tel, //电话
        city: content.city, //城市
        county: content.county, //县区
        is_default: is_default, //默认
        postalCode: content.postalCode, //邮编
        province: content.province, //省
        address: content.addressDetail, //地址
        area_code: content.areaCode
      };

      getAddress_Add(
        0,
        addr.name,
        addr.tel,
        addr.province,
        addr.city,
        addr.county,
        addr.address,
        addr.is_default,
        addr.area_code,
      )
        .then(res => {
          if (res.status == "1") {
            Toast(res.info);
            //重新加载
            this.getAddressListData();
            this.showAdd = false;
          } else {
            Toast(res.info);
          }
        })
        .catch(err => {
            Toast(err.info ? err.info : '获取数据失败');
        });
    },
    onEditSave(content) {
      let editInfo = new Object();

      editInfo = {
        id: content.id,
        name: content.name, //姓名
        tel: content.tel, //电话
        city: content.city, //城市
        county: content.county, //县区
        is_default: content.isDefault ? 1 : 0, //默认
        province: content.province, //省
        address: content.addressDetail, //地址,
        area_code:content.areaCode
      };

      getAddress_Edit(
        editInfo.id,
        editInfo.name,
        editInfo.tel,
        editInfo.province,
        editInfo.city,
        editInfo.county,
        editInfo.address,
        editInfo.is_default,
        editInfo.area_code
      )
        .then(res => {
          if (res.status == "1") {
            Toast(res.info);

            //重新加载
            this.getAddressListData();
            this.showEdit = false;
          } else {
            Toast(res.info);
          }
        })
        .catch(err => {
            Toast(err.info);
        });
    },
    AddressEdit() {
      this.showEdit = true;
      if (sessionStorage.getItem("addressid") != "") {
        let keyIndex = sessionStorage.getItem("keyIndex");
        this.addressInfo = {
          id: sessionStorage.getItem("addressid"),
          name: this.listData[keyIndex].consignee,
          tel: this.listData[keyIndex].telephone,
          province: this.listData[keyIndex].province,
          city: this.listData[keyIndex].city,
          county: this.listData[keyIndex].district,
          addressDetail: this.listData[keyIndex].address,
          isDefault: this.listData[keyIndex].is_default == 0 ? false : true,
          areaCode: this.listData[keyIndex].area_code
        };
      } else {
        this.showEdit = false;
        Toast("地址参数错误");
      }
    },
    onEditDelete() {
      getAddress_Del(sessionStorage.getItem("addressid"))
        .then(rst => {
          if (rst.status == "1") {
            sessionStorage.setItem("addressid", "");
            Toast(rst.info);
            //重新加载
            this.getAddressListData();
            this.$router.go(0);
            this.showAdd = false;
          } else {
            Toast(rst.info);
          }
        })
        .catch(err => {
          Toast(err.info + "删除失败，请稍候再试");
        });
    },
    onChangeDetail(val) {},

    //获取地址列表
    getAddressListData() {
      getAddress_list()
        .then(res => {
          if (res.status == "1") {
            this.listData = res.list;

          }else{
            this.listData = []
          }
          this.$nextTick(function () {
            this.$toast.clear();
        })
        })
        .catch(err => {
          this.listData = [];
          Toast(err.info);
        });
    },
    onEdit(id) {
      console.log(id);
    },
    backAddressId(id) {
      if (this.$route.query.getRice) {
        console.log(1);
        // this.$router.push({name:'buy',query:id});
        this.$router.replace({
          name: "buy",
          query: { addressId: id, getRice: this.$route.query.getRice }
        });
      } else if (this.$route.query.goodsId) {
        console.log(2);
        // this.$router.push({name:'buy',query:id});
        this.$router.replace({
          name: "buy",
          query: {
            goodsId: this.$route.query.goodsId,
            sku_id: this.$route.query.sku_id,
            goods_nums: this.$route.query.goods_nums,
            addressId: id
          }
        });
      } else if (this.$route.query.cartIds) {
        console.log(3);
        this.$router.replace({
          name: "buy",
          query: { cartIds: this.$route.query.cartIds, addressId: id }
        });
        // this.$router.push({name:'buy',query:{cartIds:this.$route.query.cartIds,addressId:id}});
      }
    },
    setAddressDefault(checkId) {
      setAddress_Default(checkId)
        .then(res => {
          Toast(res.info);
          // this.$emit('getAddressListData');
          //   setTimeout(() => {
          //     this.$router.go(0);
          //   }, 1000);
          this.getAddressListData();
        })
        .catch(err => {
          Toast(err.info ? err.info : '获取数据失败');
        });
    },
    addSite() {
        this.showAdd = true;
        this.addressInfo =  {
            id: "1",
            name: "张三",
            tel: "13000000000",
            province: '浙江省',
            city: '杭州市',
            county: '西湖区',
            areaCode: '',
            postalCode: '',
            addressDetail: '',
        }
    }
  },
  created() {
    this.getAddressListData();
    this.$toast.loading({
        mask: true,
        message: "加载中" + "...",
        loadingType: "spinner",
        duration: 0
      });
  },
  mounted() {}
};
</script>
<style lang="less">
.address {
  padding-top: 46px;
  .popup {
    width: 100%;
    height: 100%;

    box-sizing: border-box;
  }
  .button-fixed-bottom {
    width: 94%;
    position: fixed;
    bottom: 15px;
    background: #669933;
    color: #ffffff;
    left: 3%;
    border-radius: 10px;
    border: none;
  }
  .button--large {
    background: #669933;
  }
  .button-fixed-bottom i {
    color: #ffffff;
  }
  .buttonAdd {
    background: #669933;
  }
  .van-button--danger {
    background: #669933;
    border-color: #669933;
  }
  .nullLocalhost{
      text-align: center;
      position: absolute;
        left: 50%;
        top: 50%;
        -ms-transform:translate(-50%,-50%); 	/* IE 9 */
        -moz-transform:translate(-50%,-50%); 	/* Firefox */
        -webkit-transform:translate(-50%,-50%); /* Safari 和 Chrome */
        transform:translate(-50%,-50%);
        color: #999999;
        img{
            width: 100px;
        }
        width: 80%;
  }
}
</style>

