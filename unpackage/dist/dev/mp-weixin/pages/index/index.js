"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      icon: null
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
      console.log(value);
    },
    selectMap() {
      this.$refs.tMap.open(104.397894, 31.126855);
    }
  }
};
if (!Array) {
  const _component_zhuo_tianditu_select = common_vendor.resolveComponent("zhuo-tianditu-select");
  _component_zhuo_tianditu_select();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.selectMap && $options.selectMap(...args)),
    b: common_vendor.sr("tMap", "1d8812f2-0"),
    c: common_vendor.o($options.onLoad),
    d: common_vendor.o($options.onSelect),
    e: common_vendor.p({
      icon: $data.icon,
      searchType: 0,
      ["api-key"]: "e122b0518f43b32dcc256edbae20a5d1"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
