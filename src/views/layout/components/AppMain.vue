<template>
    <section class="app-main" style="min-height: 100%;">	
        <van-nav-bar v-if="title" :title="title" left-text="" :left-arrow="$route.name === 'cart' || $route.name === 'home' || $route.name === 'my'  ? false : true" @click-left="onClickLeft" />
        <keep-alive>
            <router-view v-if="$route.meta.keepAlive"  :style="{paddingBottom:tabActive !== null ? '50px' : ''}"></router-view>
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" :style="{paddingBottom:tabActive !== null ? '50px' : ''}"></router-view>

        <van-tabbar v-model="tabActive" v-if="tabActive !== null">
            <van-tabbar-item :to="{name: 'home'}" icon="wap-home">
                <span>首页</span>
                <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active ? homeActive : home"
                >
            </van-tabbar-item>
            <van-tabbar-item :to="{name: 'cart'}" icon="cart" :info="cartCount">
                <span>购物车</span>
                <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active ? cartActive : cart"
                >
            </van-tabbar-item>
            <van-tabbar-item :to="{name: 'my'}" icon="contact">
                <span>我的</span>
                <img
                    slot="icon"
                    slot-scope="props"
                    :src="props.active ? userActive : user"
                >
            </van-tabbar-item>
        </van-tabbar>
    </section>
</template>

<script>
import { mapGetters, mapActions, mapState } from "vuex";

import home from "../../../../static/images/common/home.png";
import homeActive from "../../../../static/images/common/home-active.png";
import cart from "../../../../static/images/common/cart.png";
import cartActive from "../../../../static/images/common/cart-active.png";
import user from "../../../../static/images/common/user.png";
import userActive from "../../../../static/images/common/user-active.png";
import { getUserInfo } from "@/api/my/userinfo.js";

export default {
  name: "AppMain",
  data() {
    return {
      tabBarList: ["home", "cart", "my"],
      tabActive: null,
      home,
      homeActive,
      cart,
      cartActive,
      user,
      userActive,
      cartCount: "",
      pid: ""
    };
  },
  computed: {
    title() {
      return this.$route.meta.title;
    }
    //  ...mapGetters(['cartNum']),
  },
  methods: {
    ...mapActions(["getUserInfo"]),
    getTabActive() {
      this.tabActive = null;
      for (let i in this.tabBarList) {
        if (this.tabBarList[i] === this.$route.name) {
            this.tabActive = Number(i);
            this.getCartNum();
            this.cartCount = this.cartNum;
          break;
        }
      }
    },
    onClickLeft() {
      if (this.$route.name === "shopDetails") {
        this.$router.push({ name: "home" });
      } else if (this.$route.name === "myOrder") {
        this.$router.push({ name: "my" });
      } else if (this.$route.name === "sharePage") {
        this.$router.push({ name: "shopDetails",query: {'shopId': this.$route.query.id}});
      } else if (this.$route.name === "myPhone") {
        this.$router.push({ name: "my"});
      } else {
        this.$router.go(-1);
      }
    },
    getCartNum() {
      getUserInfo()
        .then(res => {
          this.cartCount = res.cart_nums == 0 ? null : res.cart_nums;
        })
        .catch(err => {
          Toast(err.info ? err.info : "获取数据失败");
        });
    },
    getTokenUrl() {
        let sessionToken = sessionStorage.getItem("token");

        if(!sessionToken){
            let token = this.$route.query.token;
            let tel = this.$route.query.is_tel;
            if(token){
                sessionStorage.setItem("token", token);
                if(tel != '1'){
                    this.$router.replace({ name: "myPhone" });
                }
            } else {
                // var url =  window.location.host+window.location.pathname+'#'+this.$route.path;
                var url =  window.location.href;
                window.location.href = "https://www.lekangran.com/Api/BaseH5/H5/h5_url/" + window.btoa(url);
            }
        }
    }
  },

  created() {
    this.getTokenUrl();
    this.getTabActive();
    this.getUserInfo();
  },
  activated() {},
  watch: {
    $route() {
      this.getTabActive();
    },
  },
//   beforeRouteEnter(to, from, next) {
//     console.log(to)
//     next();
//   }
};
</script>

<style>
.van-nav-bar {
  z-index: 999;
}
</style>