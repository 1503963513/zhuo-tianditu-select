"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      icon: null,
      point: {}
    };
  },
  onLoad() {
    const that = this;
    common_vendor.index.getImageInfo({
      src: "../../static/position.png",
      success(res) {
        that.icon = res.path;
      }
    });
  },
  mounted() {
  },
  methods: {
    onLoad() {
      console.log("天地图加载完成");
    },
    onSelect(value) {
      this.point = value;
    },
    selectMap() {
      this.$refs.tMap.open(104.397894, 31.126855);
    }
  }
};
if (!Array) {
  const _easycom_zhuo_tianditu_select2 = common_vendor.resolveComponent("zhuo-tianditu-select");
  _easycom_zhuo_tianditu_select2();
}
const _easycom_zhuo_tianditu_select = () => "../../uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.js";
if (!Math) {
  _easycom_zhuo_tianditu_select();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.selectMap && $options.selectMap(...args)),
    b: $data.point.address
  }, $data.point.address ? {
    c: common_vendor.t($data.point.address),
    d: common_vendor.t($data.point.location.lon),
    e: common_vendor.t($data.point.location.lat)
  } : {}, {
    f: common_vendor.sr("tMap", "1d8812f2-0"),
    g: common_vendor.o($options.onLoad),
    h: common_vendor.o($options.onSelect),
    i: common_vendor.p({
      icon: $data.icon,
      searchType: 0,
      ["api-key"]: "e122b0518f43b32dcc256edbae20a5d1"
    })
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
