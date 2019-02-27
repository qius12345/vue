<template>
    <div class="introduce" >
        <div v-html="introduceDetail"></div>
    </div>
</template>


<script>
import { getIntroduce } from "@/api/home/index.js";
import { Toast, Loading } from "vant";
export default {
  name: "Home",
  components: {},
  data() {
    return {
      introduceDetail: ""
    };
  },
  methods: {
    getIntroduce() {
      getIntroduce(this.$route.query.bannerId)
        .then(res => {
          this.introduceDetail = res.detail;
          this.$toast.clear();
        })
        .catch(err => {});
    }
  },
  mounted() {},
  created() {
    this.getIntroduce();
    this.$toast.loading({
      mask: true,
      message: "加载中" + "...",
      loadingType: "spinner",
      duration: 0
    });
  }
};
</script>

<style lang="less">
@import "../../styles/color.less";
.introduce {
  background-color: #ffffff;
  padding: 0 15px;
  padding-bottom: 30px;
  padding-top: 46px;
  img {
    width: 100%;
  }
  p {
    margin: 10px 0;
    font-size: 14px;
    line-height: 23px;
    letter-spacing: 1px;
  }
}
</style>
