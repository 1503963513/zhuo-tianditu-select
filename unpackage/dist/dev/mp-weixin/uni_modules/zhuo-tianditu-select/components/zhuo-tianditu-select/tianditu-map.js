"use strict";
const uni_modules_zhuoTiandituSelect_tools = require("../../tools.js");
const common_assets = require("../../../../common/assets.js");
const common_vendor = require("../../../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      Tmap: null
    };
  },
  props: {
    apiKey: {
      type: String,
      require: true,
      default: ""
    },
    customIcon: {
      type: String,
      default: ""
    }
  },
  destroyed() {
  },
  methods: {
    initCharts(lng, lat) {
      var that = this;
      this.Tmap = new T.Map("mapDiv", {
        projection: "EPSG:4326"
      });
      this.Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
      that.nextPoint({
        lng,
        lat
      });
      this.Tmap.addEventListener("click", (e) => {
        that.nextPoint(e.lnglat);
      });
    },
    upDataCharts(lng, lat) {
      this.setIcon(lng, lat, true);
      this.Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
    },
    setIcon(lng, lat, isClear) {
      if (isClear) {
        this.Tmap.clearOverLays();
      }
      const icon = new T.Icon({
        iconUrl: this.customIcon || common_assets.iconPath,
        iconSize: new T.Point(30, 30),
        iconAnchor: new T.Point(15, 30)
      });
      const marker = new T.Marker(new T.LngLat(lng, lat), {
        icon
      });
      this.Tmap.addOverLay(marker);
    },
    async nextPoint(lnglat) {
      var that = this;
      let params = {
        postStr: JSON.stringify({
          lon: lnglat.lng,
          lat: lnglat.lat,
          ver: 1
        }),
        type: "geocode",
        tk: that.apiKey
      };
      let resData = await uni_modules_zhuoTiandituSelect_tools.tools.createRequest("https://api.tianditu.gov.cn/geocoder", params, true);
      if (resData.status === "0") {
        this.setIcon(lnglat.lng, lnglat.lat, true);
        const info = uni_modules_zhuoTiandituSelect_tools.tools.formatterAdressLocation(resData.result, 1);
        this.$emit("onSelect", info);
      } else {
        uni_modules_zhuoTiandituSelect_tools.tools.createMessage("数据异常", 1e3, false, "error");
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {};
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a82b27f6"], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/tianditu-map.vue"]]);
wx.createComponent(Component);
