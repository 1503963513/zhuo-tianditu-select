"use strict";
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      winWidth: 0,
      winHeight: 0,
      winTop: 0
    };
  },
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false
    }
  },
  created() {
    var that = this;
    common_vendor.index.getSystemInfo({
      success: function(res) {
        that.winWidth = res.windowWidth;
        that.winHeight = res.windowHeight;
        that.winTop = res.windowTop;
      }
    });
  },
  methods: {
    close(e) {
      this.$emit("onClose");
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.visible
  }, $props.visible ? {
    b: common_vendor.o((...args) => $options.close && $options.close(...args)),
    c: $data.winHeight + "px",
    d: $data.winWidth + "px",
    e: $data.winTop + "px"
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-9b478222"], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/tianditu-popup.vue"]]);
wx.createComponent(Component);
