"use strict";
const common_vendor = require("../../../../common/vendor.js");
const uni_modules_zhuoTiandituSelect_tools = require("../../tools.js");
const tiandituMap = () => "./tianditu-map.js";
const tiandituSearchVue = () => "./tianditu-search.js";
const _sfc_main = {
  name: "zhuozhuoTiandituPlugin",
  components: {
    tiandituMap,
    tiandituSearchVue
  },
  props: {
    apiKey: {
      type: String,
      require: true,
      default: ""
    },
    searchType: {
      type: Number,
      default: 0
    },
    icon: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      winWidth: 0,
      winHeight: 0,
      winTop: 0,
      visible: false,
      datalist: [],
      startY: 0,
      domMaxHeight: "50vh",
      domMinHeight: "0vh",
      selectItem: {}
    };
  },
  created() {
    var that = this;
    that.iStatusBarHeight = common_vendor.index.getSystemInfoSync().statusBarHeight;
    common_vendor.index.getSystemInfo({
      success: function(res) {
        that.winWidth = res.windowWidth;
        that.winHeight = res.windowHeight;
        that.winTop = res.windowTop;
      }
    });
  },
  mounted() {
    if (typeof window.T === "function") {
      console.warn("--------天地图已加载--------");
      this.initMaps();
    } else {
      if (this.apiKey) {
        const script = document.createElement("script");
        script.src = "http://api.tianditu.gov.cn/api?v=4.0&tk=" + this.apiKey;
        script.onload = this.initMaps.bind(this);
        document.head.appendChild(script);
      }
    }
  },
  methods: {
    open(lon, lat) {
      if (lon && lat) {
        this.visible = true;
        this.$nextTick(() => {
          this.$refs.tiandituMapRefs.initCharts(lon, lat);
        });
      } else {
        console.error("请传入lon, lat");
      }
    },
    close() {
      this.visible = false;
    },
    upDateLonLat(lon, lat) {
      if (lon && lat) {
        this.$refs.tiandituMapRefs.upDataCharts(lon, lat);
      } else {
        console.error("请传入lon, lat");
      }
    },
    onConfirm() {
      if (Object.keys(this.selectItem).length) {
        this.visible = false;
        this.$emit("onSelect", this.selectItem);
      } else {
        uni_modules_zhuoTiandituSelect_tools.tools.createMessage("请选择位置");
      }
    },
    tianidtuSearch(value) {
      if (value.city) {
        this.cityInfoSearch(value);
      } else {
        this.infoSearch(value);
      }
    },
    async infoSearch(value) {
      let params = {
        ds: {
          "keyWord": value.keyword
        },
        tk: this.apiKey
      };
      let resData = await uni_modules_zhuoTiandituSelect_tools.tools.createRequest("http://api.tianditu.gov.cn/geocoder", params, true);
      if (resData.status === "0") {
        const location = resData.location;
        const formateOne = uni_modules_zhuoTiandituSelect_tools.tools.formatterAdressLocation(resData, 3);
        this.datalist = [formateOne];
        this.selectItem = datalist;
        this.$refs.tiandituMapRefs.upDataCharts(location.lon, location.lat);
      }
    },
    async cityInfoSearch(value) {
      let params = {
        postStr: {
          "keyWord": value.keyword,
          "queryType": 12,
          "start": 0,
          "count": 10,
          "specify": value.city.value
        },
        type: "query",
        tk: this.apiKey
      };
      let resData = await uni_modules_zhuoTiandituSelect_tools.tools.createRequest("http://api.tianditu.gov.cn/v2/search", params, true);
      if (resData.status.infocode === 1e3) {
        const {
          pois: aPoints,
          count
        } = resData;
        if (count === "0" || !aPoints || !aPoints.length) {
          return uni_modules_zhuoTiandituSelect_tools.tools.createMessage("没有找到该地址");
        }
        const {
          pois,
          keyWord,
          lonlat
        } = aPoints[0];
        const formateData = aPoints.map((item) => uni_modules_zhuoTiandituSelect_tools.tools.formatterAdressLocation(item, 2));
        this.datalist = formateData;
        this.selectItem = formateData[0];
        const [lon, lat] = lonlat.split(",");
        this.$refs.tiandituMapRefs.upDataCharts(lon, lat);
      } else {
        uni_modules_zhuoTiandituSelect_tools.tools.createMessage("数据异常", 1e3, false, "error");
      }
    },
    selectListItem(item) {
      this.$refs.tiandituMapRefs.upDataCharts(item.location.lon, item.location.lat);
    },
    selectPoint(e) {
      this.domMinHeight = "0vh";
      this.datalist = [e];
      this.selectItem = e;
    },
    initMaps() {
      this.$emit("onLoad");
      console.warn("--------天地图加载完成--------");
    },
    start(e) {
      const clientY = e.changedTouches[0].clientY;
      this.startY = clientY;
    },
    end(e) {
      const transformY = e.changedTouches[0].clientY - this.startY;
      switch (true) {
        case transformY > 50:
          console.log("下划");
          this.domMaxHeight = "20vh";
          this.domMinHeight = "0vh";
          break;
        case transformY < -50:
          console.log("上划");
          this.domMaxHeight = "50vh";
          this.domMinHeight = "50vh";
          break;
      }
    },
    selectCard(item) {
      this.domMaxHeight = "20vh";
      this.domMinHeight = "0vh";
      this.selectItem = item;
      this.selectListItem(item);
    }
  }
};
if (!Array) {
  const _component_tiandituSearchVue = common_vendor.resolveComponent("tiandituSearchVue");
  const _component_tiandituMap = common_vendor.resolveComponent("tiandituMap");
  (_component_tiandituSearchVue + _component_tiandituMap)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.visible
  }, $data.visible ? {
    b: common_vendor.o($options.tianidtuSearch),
    c: common_vendor.o(($event) => $data.visible = false),
    d: common_vendor.o($options.onConfirm),
    e: common_vendor.p({
      searchType: $props.searchType
    }),
    f: common_vendor.sr("tiandituMapRefs", "23aaf04f-1"),
    g: common_vendor.o($options.selectPoint),
    h: common_vendor.p({
      apiKey: $props.apiKey,
      customIcon: $props.icon
    }),
    i: common_vendor.o((...args) => $options.start && $options.start(...args)),
    j: common_vendor.o((...args) => $options.end && $options.end(...args)),
    k: common_vendor.f($data.datalist, (item, index, i0) => {
      return common_vendor.e({
        a: "cards-" + i0,
        b: common_vendor.r("cards", {
          row: item,
          index: $data.selectItem
        }, i0)
      }, !_ctx.$slots.cards ? {
        c: common_vendor.t(item.address),
        d: common_vendor.t(item.name && `(${item.name})`),
        e: common_vendor.t(item.location.lon),
        f: common_vendor.t(item.location.lat),
        g: item.address === $data.selectItem.address ? "#f3f4f6" : "#FFFFFF"
      } : {}, {
        h: index,
        i: common_vendor.o(($event) => $options.selectCard(item), index)
      });
    }),
    l: !_ctx.$slots.cards,
    m: $data.domMinHeight,
    n: $data.domMaxHeight,
    o: $data.winHeight + "px",
    p: $data.winWidth + "px",
    q: $data.winTop + "px"
  } : {});
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.vue"]]);
wx.createComponent(Component);
