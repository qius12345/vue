<template>
    <div class="wx-share">
        
    </div>
</template>

<script>
export default {
  name: "wxShare",
  components: {},
  data() {
    return {};
  },
  methods: {
      getParmas() {
        var theRequest = {},
            strs;
        if (url.indexOf('?') != -1) {
            var str = url.split('?')[1];
            strs = str.split("&");
            for (var i = strs.length - 1; i >= 0; i--) {
                theRequest[strs[i].split("=")[0]] = strs[i].split("=")[1];
            }
        }
        return theRequest;
      }
  },
  created() {
    var parms = this.getParmas(window.location.href);
    window.location.href = decodeURIComponent(parms.redirect);
  },
  mounted() {}
};
</script>

<style lang="less">
</style>
