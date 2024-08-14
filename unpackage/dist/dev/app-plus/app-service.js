if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  function resolveEasycom(component, easycom) {
    return typeof component === "string" ? easycom : component;
  }
  function createMessage(title, duration = 1500, mask = false, icon = "none") {
    uni.showToast({
      title,
      duration,
      mask,
      icon
    });
  }
  function createRequest(url, data = {}, loading = false, method = "GET", header = {}) {
    if (loading) {
      uni.showLoading({
        title: "请稍后",
        mask: true
      });
    }
    return new Promise((resolve, reject) => {
      uni.request({
        url,
        method,
        data,
        header,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data);
          } else {
            if (res.data.msg) {
              const str = typeof res.data.resolve === "string" ? "," + res.data.resolve : "";
              createMessage(res.data.msg + str);
            }
            reject(new Error("请求错误"));
          }
        },
        fail: (err) => {
          reject(err);
        },
        complete: () => {
          uni.hideLoading();
        }
      });
    });
  }
  function formatterAdressLocation(obj, type) {
    switch (type) {
      case 1:
        return {
          address: obj.formatted_address,
          name: "",
          location: obj.location,
          infomation: obj.addressComponent
        };
      case 2:
        const [lon, lat] = obj.lonlat.split(",");
        return {
          address: obj.address,
          name: obj.name,
          location: {
            lon,
            lat
          },
          infomation: obj
        };
      case 3:
        return {
          address: obj.location.keyWord,
          name: "",
          location: {
            lon: obj.location.lon,
            lat: obj.location.lat
          },
          infomation: obj.location
        };
    }
  }
  const tools = {
    createMessage,
    createRequest,
    formatterAdressLocation
  };
  const iconPath = "/uni_modules/zhuo-tianditu-select/static/point.png";
  const block0 = (Comp) => {
    (Comp.$renderjs || (Comp.$renderjs = [])).push("Trenderjs");
    (Comp.$renderjsModules || (Comp.$renderjsModules = {}))["Trenderjs"] = "3573ec8f";
  };
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$5 = {
    name: "TianDiTu-Map",
    data() {
      return {
        Tmap: null,
        option: {
          type: "",
          apikey: "",
          lng: "",
          lat: "",
          png: iconPath
        }
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
    methods: {
      compliteonLoadTianDiTu() {
        this.$emit("onLoadTianDiTu");
      },
      initCharts(lng, lat) {
        this.option = {
          apikey: this.apiKey,
          lng,
          lat,
          png: this.customIcon || this.option.png,
          type: "open"
        };
      },
      upDataCharts(lng, lat) {
        this.option = {
          ...this.option,
          type: "Icon",
          lng,
          lat,
          png: this.customIcon || this.option.png,
          type: "update"
        };
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
        let resData = await tools.createRequest("https://api.tianditu.gov.cn/geocoder", params, true);
        if (resData.status === "0") {
          const info = tools.formatterAdressLocation(resData.result, 1);
          this.option = {
            ...this.option,
            apikey: this.apiKey,
            lng: lnglat.lng,
            lat: lnglat.lat,
            png: this.customIcon || this.option.png,
            type: "update"
          };
          this.$emit("onSelect", info);
        } else {
          tools.createMessage("数据异常", 1e3, false, "error");
        }
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { style: { "width": "100%", "height": "100%" } }, [
      vue.createElementVNode("view", {
        id: "mapDiv",
        class: "mapDiv",
        apikey: $props.apiKey,
        prop: vue.wp($data.option),
        "change:prop": _ctx.Trenderjs.initTMap
      }, null, 8, ["apikey", "prop", "change:prop"])
    ]);
  }
  if (typeof block0 === "function")
    block0(_sfc_main$5);
  const tiandituMap = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$4], ["__scopeId", "data-v-a82b27f6"], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/tianditu-map.vue"]]);
  const _sfc_main$4 = {
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
      uni.getSystemInfo({
        success: function(res) {
          that.winWidth = res.windowWidth;
          that.winTop = res.windowTop;
          that.winHeight = res.windowHeight - res.statusBarHeight;
        }
      });
    },
    methods: {
      close(e) {
        this.$emit("onClose");
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return $props.visible ? (vue.openBlock(), vue.createElementBlock(
      "view",
      {
        key: 0,
        class: "tianditu-popop",
        style: vue.normalizeStyle({ height: $data.winHeight + "px", width: $data.winWidth + "px", top: $data.winTop + "px" })
      },
      [
        vue.createElementVNode("view", {
          class: "popup-header",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
        }, [
          vue.renderSlot(_ctx.$slots, "header", {}, void 0, true)
        ]),
        vue.createElementVNode("view", { class: "popup-content fadeInUp animated" }, [
          vue.renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ])
      ],
      4
      /* STYLE */
    )) : vue.createCommentVNode("v-if", true);
  }
  const tiandituPopupVue = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$3], ["__scopeId", "data-v-9b478222"], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/tianditu-popup.vue"]]);
  const dataCityList = [
    {
      label: "中国",
      value: "156000000"
    },
    {
      label: "云南省",
      value: "156530000"
    },
    {
      label: "四川省",
      value: "156510000"
    },
    {
      label: "西藏自治区",
      value: "156540000"
    },
    {
      label: "海南省",
      value: "156460000"
    },
    {
      label: "广西壮族自治区",
      value: "156450000"
    },
    {
      label: "广东省",
      value: "156440000"
    },
    {
      label: "台湾省",
      value: "156710000"
    },
    {
      label: "贵州省",
      value: "156520000"
    },
    {
      label: "湖南省",
      value: "156430000"
    },
    {
      label: "福建省",
      value: "156350000"
    },
    {
      label: "江西省",
      value: "156360000"
    },
    {
      label: "浙江省",
      value: "156330000"
    },
    {
      label: "湖北省",
      value: "156420000"
    },
    {
      label: "陕西省",
      value: "156610000"
    },
    {
      label: "安徽省",
      value: "156340000"
    },
    {
      label: "江苏省",
      value: "156320000"
    },
    {
      label: "河南省",
      value: "156410000"
    },
    {
      label: "甘肃省",
      value: "156620000"
    },
    {
      label: "青海省",
      value: "156630000"
    },
    {
      label: "新疆维吾尔自治区",
      value: "156650000"
    },
    {
      label: "山东省",
      value: "156370000"
    },
    {
      label: "山西省",
      value: "156140000"
    },
    {
      label: "宁夏回族自治区",
      value: "156640000"
    },
    {
      label: "河北省",
      value: "156130000"
    },
    {
      label: "辽宁省",
      value: "156210000"
    },
    {
      label: "内蒙古自治区",
      value: "156150000"
    },
    {
      label: "吉林省",
      value: "156220000"
    },
    {
      label: "黑龙江省",
      value: "156230000"
    },
    {
      label: "西双版纳傣族自治州",
      value: "156532800"
    },
    {
      label: "勐拉镇",
      value: "156532500"
    },
    {
      label: "普洱市",
      value: "156530800"
    },
    {
      label: "红河哈尼族彝族自治州",
      value: "156532500"
    },
    {
      label: "临沧市",
      value: "156530900"
    },
    {
      label: "玉溪市",
      value: "156530400"
    },
    {
      label: "德宏傣族景颇族自治州",
      value: "156533100"
    },
    {
      label: "昆明市",
      value: "156530100"
    },
    {
      label: "保山市",
      value: "156530500"
    },
    {
      label: "楚雄彝族自治州",
      value: "156532300"
    },
    {
      label: "曲靖市",
      value: "156530300"
    },
    {
      label: "泸水市",
      value: "156533301"
    },
    {
      label: "大理白族自治州",
      value: "156532900"
    },
    {
      label: "攀枝花市",
      value: "156510400"
    },
    {
      label: "怒江傈僳族自治州",
      value: "156533300"
    },
    {
      label: "丽江市",
      value: "156530700"
    },
    {
      label: "昭通市",
      value: "156530600"
    },
    {
      label: "迪庆藏族自治州",
      value: "156533400"
    },
    {
      label: "凉山彝族自治州",
      value: "156513400"
    },
    {
      label: "山南市",
      value: "156540500"
    },
    {
      label: "日喀则市",
      value: "156540200"
    },
    {
      label: "林芝市",
      value: "156540400"
    },
    {
      label: "乐山市",
      value: "156511100"
    },
    {
      label: "拉萨市",
      value: "156540100"
    },
    {
      label: "雅安市",
      value: "156511800"
    },
    {
      label: "眉山市",
      value: "156511400"
    },
    {
      label: "甘孜藏族自治州",
      value: "156513300"
    },
    {
      label: "成都市",
      value: "156510100"
    },
    {
      label: "德阳市",
      value: "156510600"
    },
    {
      label: "昌都市",
      value: "156540300"
    },
    {
      label: "阿坝藏族羌族自治州",
      value: "156513200"
    },
    {
      label: "那曲市",
      value: "156540600"
    },
    {
      label: "阿里地区",
      value: "156542500"
    },
    {
      label: "玉树藏族自治州",
      value: "156632700"
    },
    {
      label: "果洛藏族自治州",
      value: "156632600"
    },
    {
      label: "甘南藏族自治州",
      value: "156623000"
    },
    {
      label: "黄南藏族自治州",
      value: "156632300"
    },
    {
      label: "三沙市",
      value: "156460300"
    },
    {
      label: "三亚市",
      value: "156460200"
    },
    {
      label: "海口市",
      value: "156460100"
    },
    {
      label: "湛江市",
      value: "156440800"
    },
    {
      label: "北海市",
      value: "156450500"
    },
    {
      label: "茂名市",
      value: "156440900"
    },
    {
      label: "防城港市",
      value: "156450600"
    },
    {
      label: "阳江市",
      value: "156441700"
    },
    {
      label: "钦州市",
      value: "156450700"
    },
    {
      label: "澳门",
      value: "156820000"
    },
    {
      label: "珠海市",
      value: "156440400"
    },
    {
      label: "香港",
      value: "156810000"
    },
    {
      label: "崇左市",
      value: "156451400"
    },
    {
      label: "中山市",
      value: "156442000"
    },
    {
      label: "深圳市",
      value: "156440300"
    },
    {
      label: "江门市",
      value: "156440700"
    },
    {
      label: "玉林市",
      value: "156450900"
    },
    {
      label: "高雄市",
      value: "156711000"
    },
    {
      label: "汕尾市",
      value: "156441500"
    },
    {
      label: "南宁市",
      value: "156450100"
    },
    {
      label: "云浮市",
      value: "156445300"
    },
    {
      label: "台南市",
      value: "156710014"
    },
    {
      label: "东莞市",
      value: "156441900"
    },
    {
      label: "佛山市",
      value: "156440600"
    },
    {
      label: "肇庆市",
      value: "156441200"
    },
    {
      label: "惠州市",
      value: "156441300"
    },
    {
      label: "贵港市",
      value: "156450800"
    },
    {
      label: "广州市",
      value: "156440100"
    },
    {
      label: "汕头市",
      value: "156440500"
    },
    {
      label: "梧州市",
      value: "156450400"
    },
    {
      label: "揭阳市",
      value: "156445200"
    },
    {
      label: "潮州市",
      value: "156445100"
    },
    {
      label: "清远市",
      value: "156441800"
    },
    {
      label: "文山壮族苗族自治州",
      value: "156532600"
    },
    {
      label: "河源市",
      value: "156441600"
    },
    {
      label: "来宾市",
      value: "156451300"
    },
    {
      label: "百色市",
      value: "156451000"
    },
    {
      label: "梅州市",
      value: "156441400"
    },
    {
      label: "柳州市",
      value: "156450200"
    },
    {
      label: "贺州市",
      value: "156451100"
    },
    {
      label: "厦门市",
      value: "156350200"
    },
    {
      label: "漳州市",
      value: "156350600"
    },
    {
      label: "河池市",
      value: "156451200"
    },
    {
      label: "韶关市",
      value: "156440200"
    },
    {
      label: "泉州市",
      value: "156350500"
    },
    {
      label: "龙岩市",
      value: "156350800"
    },
    {
      label: "桂林市",
      value: "156450300"
    },
    {
      label: "黔西南布依族苗族自治州",
      value: "156522300"
    },
    {
      label: "莆田市",
      value: "156350300"
    },
    {
      label: "台中市",
      value: "156710016"
    },
    {
      label: "桃园市",
      value: "156710018"
    },
    {
      label: "新北市",
      value: "156710012"
    },
    {
      label: "台北市",
      value: "156719000"
    },
    {
      label: "黔南布依族苗族自治州",
      value: "156522700"
    },
    {
      label: "安顺市",
      value: "156520400"
    },
    {
      label: "永州市",
      value: "156431100"
    },
    {
      label: "黔东南苗族侗族自治州",
      value: "156522600"
    },
    {
      label: "六盘水市",
      value: "156520200"
    },
    {
      label: "贵阳市",
      value: "156520100"
    },
    {
      label: "中寨镇",
      value: "156520500"
    },
    {
      label: "邵阳市",
      value: "156430500"
    },
    {
      label: "毕节市",
      value: "156520500"
    },
    {
      label: "怀化市",
      value: "156431200"
    },
    {
      label: "娄底市",
      value: "156431300"
    },
    {
      label: "遵义市",
      value: "156520300"
    },
    {
      label: "铜仁市",
      value: "156520600"
    },
    {
      label: "益阳市",
      value: "156430900"
    },
    {
      label: "湘西土家族苗族自治州",
      value: "156433100"
    },
    {
      label: "宜宾市",
      value: "156511500"
    },
    {
      label: "泸州市",
      value: "156510500"
    },
    {
      label: "常德市",
      value: "156430700"
    },
    {
      label: "张家界市",
      value: "156430800"
    },
    {
      label: "自贡市",
      value: "156510300"
    },
    {
      label: "重庆市",
      value: "156500000"
    },
    {
      label: "内江市",
      value: "156511000"
    },
    {
      label: "资阳市",
      value: "156512000"
    },
    {
      label: "恩施土家族苗族自治州",
      value: "156422800"
    },
    {
      label: "荆州市",
      value: "156421000"
    },
    {
      label: "郴州市",
      value: "156431000"
    },
    {
      label: "赣州市",
      value: "156360700"
    },
    {
      label: "福州市",
      value: "156350100"
    },
    {
      label: "三明市",
      value: "156350400"
    },
    {
      label: "南平市",
      value: "156350700"
    },
    {
      label: "宁德市",
      value: "156350900"
    },
    {
      label: "衡阳市",
      value: "156430400"
    },
    {
      label: "吉安市",
      value: "156360800"
    },
    {
      label: "萍乡市",
      value: "156360300"
    },
    {
      label: "宜春市",
      value: "156360900"
    },
    {
      label: "新余市",
      value: "156360500"
    },
    {
      label: "株洲市",
      value: "156430200"
    },
    {
      label: "湘潭市",
      value: "156430300"
    },
    {
      label: "抚州市",
      value: "156361000"
    },
    {
      label: "长沙市",
      value: "156430100"
    },
    {
      label: "鹰潭市",
      value: "156360600"
    },
    {
      label: "上饶市",
      value: "156361100"
    },
    {
      label: "丽水市",
      value: "156331100"
    },
    {
      label: "南昌市",
      value: "156360100"
    },
    {
      label: "衢州市",
      value: "156330800"
    },
    {
      label: "金华市",
      value: "156330700"
    },
    {
      label: "景德镇市",
      value: "156360200"
    },
    {
      label: "岳阳市",
      value: "156430600"
    },
    {
      label: "九江市",
      value: "156360400"
    },
    {
      label: "黄山市",
      value: "156341000"
    },
    {
      label: "咸宁市",
      value: "156421200"
    },
    {
      label: "黄石市",
      value: "156420200"
    },
    {
      label: "杭州市",
      value: "156330100"
    },
    {
      label: "广安市",
      value: "156511600"
    },
    {
      label: "遂宁市",
      value: "156510900"
    },
    {
      label: "宜昌市",
      value: "156420500"
    },
    {
      label: "南充市",
      value: "156511300"
    },
    {
      label: "荆门市",
      value: "156420800"
    },
    {
      label: "达州市",
      value: "156511700"
    },
    {
      label: "绵阳市",
      value: "156510700"
    },
    {
      label: "巴中市",
      value: "156511900"
    },
    {
      label: "襄阳市",
      value: "156420600"
    },
    {
      label: "广元市",
      value: "156510800"
    },
    {
      label: "十堰市",
      value: "156420300"
    },
    {
      label: "安康市",
      value: "156610900"
    },
    {
      label: "汉中市",
      value: "156610700"
    },
    {
      label: "陇南市",
      value: "156621200"
    },
    {
      label: "商洛市",
      value: "156611000"
    },
    {
      label: "西安市",
      value: "156610100"
    },
    {
      label: "咸阳市",
      value: "156610400"
    },
    {
      label: "宝鸡市",
      value: "156610300"
    },
    {
      label: "渭南市",
      value: "156610500"
    },
    {
      label: "天水市",
      value: "156620500"
    },
    {
      label: "洛阳市",
      value: "156410300"
    },
    {
      label: "三门峡市",
      value: "156411200"
    },
    {
      label: "铜川市",
      value: "156610200"
    },
    {
      label: "运城市",
      value: "156140800"
    },
    {
      label: "鄂州市",
      value: "156420700"
    },
    {
      label: "黄冈市",
      value: "156421100"
    },
    {
      label: "安庆市",
      value: "156340800"
    },
    {
      label: "武汉市",
      value: "156420100"
    },
    {
      label: "池州市",
      value: "156341700"
    },
    {
      label: "湖州市",
      value: "156330500"
    },
    {
      label: "孝感市",
      value: "156420900"
    },
    {
      label: "宣城市",
      value: "156341800"
    },
    {
      label: "芜湖市",
      value: "156340200"
    },
    {
      label: "无锡市",
      value: "156320200"
    },
    {
      label: "马鞍山市",
      value: "156340500"
    },
    {
      label: "随州市",
      value: "156421300"
    },
    {
      label: "六安市",
      value: "156341500"
    },
    {
      label: "常州市",
      value: "156320400"
    },
    {
      label: "合肥市",
      value: "156340100"
    },
    {
      label: "铜陵市",
      value: "156340700"
    },
    {
      label: "南京市",
      value: "156320100"
    },
    {
      label: "信阳市",
      value: "156411500"
    },
    {
      label: "镇江市",
      value: "156321100"
    },
    {
      label: "滁州市",
      value: "156341100"
    },
    {
      label: "扬州市",
      value: "156321000"
    },
    {
      label: "泰州市",
      value: "156321200"
    },
    {
      label: "淮南市",
      value: "156340400"
    },
    {
      label: "阜阳市",
      value: "156341200"
    },
    {
      label: "蚌埠市",
      value: "156340300"
    },
    {
      label: "南阳市",
      value: "156411300"
    },
    {
      label: "驻马店市",
      value: "156411700"
    },
    {
      label: "盐城市",
      value: "156320900"
    },
    {
      label: "漯河市",
      value: "156411100"
    },
    {
      label: "淮安市",
      value: "156320800"
    },
    {
      label: "周口市",
      value: "156411600"
    },
    {
      label: "宿州市",
      value: "156341300"
    },
    {
      label: "平顶山市",
      value: "156410400"
    },
    {
      label: "亳州市",
      value: "156341600"
    },
    {
      label: "淮北市",
      value: "156340600"
    },
    {
      label: "宿迁市",
      value: "156321300"
    },
    {
      label: "许昌市",
      value: "156411000"
    },
    {
      label: "徐州市",
      value: "156320300"
    },
    {
      label: "商丘市",
      value: "156411400"
    },
    {
      label: "连云港市",
      value: "156320700"
    },
    {
      label: "郑州市",
      value: "156410100"
    },
    {
      label: "开封市",
      value: "156410200"
    },
    {
      label: "枣庄市",
      value: "156370400"
    },
    {
      label: "临沂市",
      value: "156371300"
    },
    {
      label: "温州市",
      value: "156330300"
    },
    {
      label: "台州市",
      value: "156331000"
    },
    {
      label: "宁波市",
      value: "156330200"
    },
    {
      label: "舟山市",
      value: "156330900"
    },
    {
      label: "绍兴市",
      value: "156330600"
    },
    {
      label: "嘉兴市",
      value: "156330400"
    },
    {
      label: "上海市",
      value: "156310000"
    },
    {
      label: "苏州市",
      value: "156320500"
    },
    {
      label: "南通市",
      value: "156320600"
    },
    {
      label: "临夏回族自治州",
      value: "156622900"
    },
    {
      label: "海南藏族自治州",
      value: "156632500"
    },
    {
      label: "兰州市",
      value: "156620100"
    },
    {
      label: "海东市",
      value: "156630200"
    },
    {
      label: "白银市",
      value: "156620400"
    },
    {
      label: "西宁市",
      value: "156630100"
    },
    {
      label: "海西蒙古族藏族自治州",
      value: "156632800"
    },
    {
      label: "和田地区",
      value: "156653200"
    },
    {
      label: "海北藏族自治州",
      value: "156632200"
    },
    {
      label: "武威市",
      value: "156620600"
    },
    {
      label: "喀什地区",
      value: "156653100"
    },
    {
      label: "金昌市",
      value: "156620300"
    },
    {
      label: "张掖市",
      value: "156620700"
    },
    {
      label: "克孜勒苏柯尔克孜自治州",
      value: "156653000"
    },
    {
      label: "酒泉市",
      value: "156620900"
    },
    {
      label: "嘉峪关市",
      value: "156620200"
    },
    {
      label: "巴音郭楞蒙古自治州",
      value: "156652800"
    },
    {
      label: "阿克苏地区",
      value: "156652900"
    },
    {
      label: "吐鲁番市",
      value: "156650400"
    },
    {
      label: "哈密市",
      value: "156650500"
    },
    {
      label: "伊犁哈萨克自治州",
      value: "156654000"
    },
    {
      label: "乌鲁木齐市",
      value: "156650100"
    },
    {
      label: "昌吉回族自治州",
      value: "156652300"
    },
    {
      label: "博尔塔拉蒙古自治州",
      value: "156652700"
    },
    {
      label: "克拉玛依市",
      value: "156650200"
    },
    {
      label: "塔城地区",
      value: "156654200"
    },
    {
      label: "阿勒泰地区",
      value: "156654300"
    },
    {
      label: "茫崖市",
      value: "156632803"
    },
    {
      label: "焦作市",
      value: "156410800"
    },
    {
      label: "菏泽市",
      value: "156371700"
    },
    {
      label: "新乡市",
      value: "156410700"
    },
    {
      label: "济宁市",
      value: "156370800"
    },
    {
      label: "日照市",
      value: "156371100"
    },
    {
      label: "晋城市",
      value: "156140500"
    },
    {
      label: "平凉市",
      value: "156620800"
    },
    {
      label: "定西市",
      value: "156621100"
    },
    {
      label: "庆阳市",
      value: "156621000"
    },
    {
      label: "鹤壁市",
      value: "156410600"
    },
    {
      label: "濮阳市",
      value: "156410900"
    },
    {
      label: "固原市",
      value: "156640400"
    },
    {
      label: "青岛市",
      value: "156370200"
    },
    {
      label: "临汾市",
      value: "156141000"
    },
    {
      label: "安阳市",
      value: "156410500"
    },
    {
      label: "长治市",
      value: "156140400"
    },
    {
      label: "泰安市",
      value: "156370900"
    },
    {
      label: "聊城市",
      value: "156371500"
    },
    {
      label: "延安市",
      value: "156610600"
    },
    {
      label: "邯郸市",
      value: "156130400"
    },
    {
      label: "济南市",
      value: "156370100"
    },
    {
      label: "潍坊市",
      value: "156370700"
    },
    {
      label: "淄博市",
      value: "156370300"
    },
    {
      label: "邢台市",
      value: "156130500"
    },
    {
      label: "滨州市",
      value: "156371600"
    },
    {
      label: "东营市",
      value: "156370500"
    },
    {
      label: "德州市",
      value: "156371400"
    },
    {
      label: "烟台市",
      value: "156370600"
    },
    {
      label: "中卫市",
      value: "156640500"
    },
    {
      label: "威海市",
      value: "156371000"
    },
    {
      label: "吕梁市",
      value: "156141100"
    },
    {
      label: "晋中市",
      value: "156140700"
    },
    {
      label: "衡水市",
      value: "156131100"
    },
    {
      label: "阳泉市",
      value: "156140300"
    },
    {
      label: "太原市",
      value: "156140100"
    },
    {
      label: "吴忠市",
      value: "156640300"
    },
    {
      label: "石家庄市",
      value: "156130100"
    },
    {
      label: "榆林市",
      value: "156610800"
    },
    {
      label: "沧州市",
      value: "156130900"
    },
    {
      label: "忻州市",
      value: "156140900"
    },
    {
      label: "银川市",
      value: "156640100"
    },
    {
      label: "保定市",
      value: "156130600"
    },
    {
      label: "大连市",
      value: "156210200"
    },
    {
      label: "阿拉善盟",
      value: "156152900"
    },
    {
      label: "石嘴山市",
      value: "156640200"
    },
    {
      label: "天津市",
      value: "156120000"
    },
    {
      label: "朔州市",
      value: "156140600"
    },
    {
      label: "廊坊市",
      value: "156131000"
    },
    {
      label: "鄂尔多斯市",
      value: "156150600"
    },
    {
      label: "唐山市",
      value: "156130200"
    },
    {
      label: "乌海市",
      value: "156150300"
    },
    {
      label: "北京市",
      value: "156110000"
    },
    {
      label: "秦皇岛市",
      value: "156130300"
    },
    {
      label: "大同市",
      value: "156140200"
    },
    {
      label: "丹东市",
      value: "156210600"
    },
    {
      label: "包头市",
      value: "156150200"
    },
    {
      label: "营口市",
      value: "156210800"
    },
    {
      label: "葫芦岛市",
      value: "156211400"
    },
    {
      label: "巴彦淖尔市",
      value: "156150800"
    },
    {
      label: "张家口市",
      value: "156130700"
    },
    {
      label: "呼和浩特市",
      value: "156150100"
    },
    {
      label: "承德市",
      value: "156130800"
    },
    {
      label: "乌兰察布市",
      value: "156150900"
    },
    {
      label: "锦州市",
      value: "156210700"
    },
    {
      label: "鞍山市",
      value: "156210300"
    },
    {
      label: "盘锦市",
      value: "156211100"
    },
    {
      label: "辽阳市",
      value: "156211000"
    },
    {
      label: "本溪市",
      value: "156210500"
    },
    {
      label: "朝阳市",
      value: "156211300"
    },
    {
      label: "通化市",
      value: "156220500"
    },
    {
      label: "沈阳市",
      value: "156210100"
    },
    {
      label: "抚顺市",
      value: "156210400"
    },
    {
      label: "白山市",
      value: "156220600"
    },
    {
      label: "阜新市",
      value: "156210900"
    },
    {
      label: "铁岭市",
      value: "156211200"
    },
    {
      label: "赤峰市",
      value: "156150400"
    },
    {
      label: "辽源市",
      value: "156220400"
    },
    {
      label: "延边朝鲜族自治州",
      value: "156222400"
    },
    {
      label: "四平市",
      value: "156220300"
    },
    {
      label: "通辽市",
      value: "156150500"
    },
    {
      label: "长春市",
      value: "156220100"
    },
    {
      label: "锡林郭勒盟",
      value: "156152500"
    },
    {
      label: "吉林市",
      value: "156220200"
    },
    {
      label: "牡丹江市",
      value: "156231000"
    },
    {
      label: "松原市",
      value: "156220700"
    },
    {
      label: "鸡西市",
      value: "156230300"
    },
    {
      label: "白城市",
      value: "156220800"
    },
    {
      label: "七台河市",
      value: "156230900"
    },
    {
      label: "哈尔滨市",
      value: "156230100"
    },
    {
      label: "兴安盟",
      value: "156152200"
    },
    {
      label: "大庆市",
      value: "156230600"
    },
    {
      label: "双鸭山市",
      value: "156230500"
    },
    {
      label: "绥化市",
      value: "156231200"
    },
    {
      label: "佳木斯市",
      value: "156230800"
    },
    {
      label: "鹤岗市",
      value: "156230400"
    },
    {
      label: "齐齐哈尔市",
      value: "156230200"
    },
    {
      label: "伊春市",
      value: "156230700"
    },
    {
      label: "呼伦贝尔市",
      value: "156150700"
    },
    {
      label: "黑河市",
      value: "156231100"
    },
    {
      label: "大兴安岭地区",
      value: "156232700"
    },
    {
      label: "勐腊县",
      value: "156532823"
    },
    {
      label: "勐海县",
      value: "156532822"
    },
    {
      label: "景洪市",
      value: "156532801"
    },
    {
      label: "孟连傣族拉祜族佤族自治县",
      value: "156530827"
    },
    {
      label: "河口瑶族自治县",
      value: "156532532"
    },
    {
      label: "澜沧拉祜族自治县",
      value: "156530828"
    },
    {
      label: "江城哈尼族彝族自治县",
      value: "156530826"
    },
    {
      label: "西盟佤族自治县",
      value: "156530829"
    },
    {
      label: "金平苗族瑶族傣族自治县",
      value: "156532530"
    },
    {
      label: "思茅区",
      value: "156530802"
    },
    {
      label: "屏边苗族自治县",
      value: "156532523"
    },
    {
      label: "绿春县",
      value: "156532531"
    },
    {
      label: "马关县",
      value: "156532625"
    },
    {
      label: "宁洱哈尼族彝族自治县",
      value: "156530821"
    },
    {
      label: "沧源佤族自治县",
      value: "156530927"
    },
    {
      label: "元阳县",
      value: "156532528"
    },
    {
      label: "个旧市",
      value: "156532501"
    },
    {
      label: "红河县",
      value: "156532529"
    },
    {
      label: "文山市",
      value: "156532601"
    },
    {
      label: "蒙自市",
      value: "156532503"
    },
    {
      label: "墨江哈尼族自治县",
      value: "156530822"
    },
    {
      label: "双江拉祜族佤族布朗族傣族自治县",
      value: "156530925"
    },
    {
      label: "景谷傣族彝族自治县",
      value: "156530824"
    },
    {
      label: "耿马傣族佤族自治县",
      value: "156530926"
    },
    {
      label: "元江哈尼族彝族傣族自治县",
      value: "156530428"
    },
    {
      label: "砚山县",
      value: "156532622"
    },
    {
      label: "建水县",
      value: "156532524"
    },
    {
      label: "石屏县",
      value: "156532525"
    },
    {
      label: "开远市",
      value: "156532502"
    },
    {
      label: "镇康县",
      value: "156530924"
    },
    {
      label: "临翔区",
      value: "156530902"
    },
    {
      label: "镇沅彝族哈尼族拉祜族自治县",
      value: "156530825"
    },
    {
      label: "瑞丽市",
      value: "156533102"
    },
    {
      label: "永德县",
      value: "156530923"
    },
    {
      label: "丘北县",
      value: "156532626"
    },
    {
      label: "新平彝族傣族自治县",
      value: "156530427"
    },
    {
      label: "通海县",
      value: "156530423"
    },
    {
      label: "峨山彝族自治县",
      value: "156530426"
    },
    {
      label: "陇川县",
      value: "156533124"
    },
    {
      label: "华宁县",
      value: "156530424"
    },
    {
      label: "江川区",
      value: "156530403"
    },
    {
      label: "红塔区",
      value: "156530402"
    },
    {
      label: "弥勒市",
      value: "156532504"
    },
    {
      label: "芒市",
      value: "156533103"
    },
    {
      label: "云县",
      value: "156530922"
    },
    {
      label: "景东彝族自治县",
      value: "156530823"
    },
    {
      label: "泸西县",
      value: "156532527"
    },
    {
      label: "凤庆县",
      value: "156530921"
    },
    {
      label: "龙陵县",
      value: "156530523"
    },
    {
      label: "晋宁区",
      value: "156530115"
    },
    {
      label: "易门县",
      value: "156530425"
    },
    {
      label: "澄江市",
      value: "156530481"
    },
    {
      label: "双柏县",
      value: "156532322"
    },
    {
      label: "盈江县",
      value: "156533123"
    },
    {
      label: "施甸县",
      value: "156530521"
    },
    {
      label: "石林彝族自治县",
      value: "156530126"
    },
    {
      label: "梁河县",
      value: "156533122"
    },
    {
      label: "昌宁县",
      value: "156530524"
    },
    {
      label: "师宗县",
      value: "156530323"
    },
    {
      label: "罗平县",
      value: "156530324"
    },
    {
      label: "呈贡区",
      value: "156530114"
    },
    {
      label: "安宁市",
      value: "156530181"
    },
    {
      label: "宜良县",
      value: "156530125"
    },
    {
      label: "官渡区",
      value: "156530111"
    },
    {
      label: "腾冲市",
      value: "156530581"
    },
    {
      label: "陆良县",
      value: "156530322"
    },
    {
      label: "楚雄市",
      value: "156532301"
    },
    {
      label: "西山区",
      value: "156530112"
    },
    {
      label: "南涧彝族自治县",
      value: "156532926"
    },
    {
      label: "五华区",
      value: "156530102"
    },
    {
      label: "盘龙区",
      value: "156530103"
    },
    {
      label: "隆阳区",
      value: "156530502"
    },
    {
      label: "禄丰县",
      value: "156532331"
    },
    {
      label: "南华县",
      value: "156532324"
    },
    {
      label: "富民县",
      value: "156530124"
    },
    {
      label: "巍山彝族回族自治县",
      value: "156532927"
    },
    {
      label: "牟定县",
      value: "156532323"
    },
    {
      label: "嵩明县",
      value: "156530127"
    },
    {
      label: "弥渡县",
      value: "156532925"
    },
    {
      label: "马龙区",
      value: "156530304"
    },
    {
      label: "永平县",
      value: "156532928"
    },
    {
      label: "祥云县",
      value: "156532923"
    },
    {
      label: "麒麟区",
      value: "156530302"
    },
    {
      label: "姚安县",
      value: "156532325"
    },
    {
      label: "武定县",
      value: "156532329"
    },
    {
      label: "禄劝彝族苗族自治县",
      value: "156530128"
    },
    {
      label: "寻甸回族彝族自治县",
      value: "156530129"
    },
    {
      label: "大理市",
      value: "156532901"
    },
    {
      label: "沾益区",
      value: "156530303"
    },
    {
      label: "漾濞彝族自治县",
      value: "156532922"
    },
    {
      label: "富源县",
      value: "156530325"
    },
    {
      label: "元谋县",
      value: "156532328"
    },
    {
      label: "盘州市",
      value: "156520281"
    },
    {
      label: "大姚县",
      value: "156532326"
    },
    {
      label: "宾川县",
      value: "156532924"
    },
    {
      label: "云龙县",
      value: "156532929"
    },
    {
      label: "永仁县",
      value: "156532327"
    },
    {
      label: "东川区",
      value: "156530113"
    },
    {
      label: "洱源县",
      value: "156532930"
    },
    {
      label: "宣威市",
      value: "156530381"
    },
    {
      label: "会泽县",
      value: "156530326"
    },
    {
      label: "兰坪白族普米族自治县",
      value: "156533325"
    },
    {
      label: "仁和区",
      value: "156510411"
    },
    {
      label: "剑川县",
      value: "156532931"
    },
    {
      label: "东区",
      value: "156510402"
    },
    {
      label: "鹤庆县",
      value: "156532932"
    },
    {
      label: "西区",
      value: "156510403"
    },
    {
      label: "华坪县",
      value: "156530723"
    },
    {
      label: "会东县",
      value: "156513426"
    },
    {
      label: "会理县",
      value: "156513425"
    },
    {
      label: "盐边县",
      value: "156510422"
    },
    {
      label: "永胜县",
      value: "156530722"
    },
    {
      label: "玉龙纳西族自治县",
      value: "156530721"
    },
    {
      label: "威宁彝族回族苗族自治县",
      value: "156520526"
    },
    {
      label: "古城区",
      value: "156530702"
    },
    {
      label: "米易县",
      value: "156510421"
    },
    {
      label: "福贡县",
      value: "156533323"
    },
    {
      label: "巧家县",
      value: "156530622"
    },
    {
      label: "宁南县",
      value: "156513427"
    },
    {
      label: "维西傈僳族自治县",
      value: "156533423"
    },
    {
      label: "鲁甸县",
      value: "156530621"
    },
    {
      label: "宁蒗彝族自治县",
      value: "156530724"
    },
    {
      label: "昭阳区",
      value: "156530602"
    },
    {
      label: "普格县",
      value: "156513428"
    },
    {
      label: "德昌县",
      value: "156513424"
    },
    {
      label: "盐源县",
      value: "156513423"
    },
    {
      label: "亚东县",
      value: "156540233"
    },
    {
      label: "彝良县",
      value: "156530628"
    },
    {
      label: "金阳县",
      value: "156513430"
    },
    {
      label: "布拖县",
      value: "156513429"
    },
    {
      label: "贡山独龙族怒族自治县",
      value: "156533324"
    },
    {
      label: "大关县",
      value: "156530624"
    },
    {
      label: "香格里拉市",
      value: "156533401"
    },
    {
      label: "西昌市",
      value: "156513401"
    },
    {
      label: "木里藏族自治县",
      value: "156513422"
    },
    {
      label: "错那县",
      value: "156540530"
    },
    {
      label: "昭觉县",
      value: "156513431"
    },
    {
      label: "盐津县",
      value: "156530623"
    },
    {
      label: "聂拉木县",
      value: "156540235"
    },
    {
      label: "筠连县",
      value: "156511527"
    },
    {
      label: "永善县",
      value: "156530625"
    },
    {
      label: "雷波县",
      value: "156513437"
    },
    {
      label: "岗巴县",
      value: "156540237"
    },
    {
      label: "喜德县",
      value: "156513432"
    },
    {
      label: "美姑县",
      value: "156513436"
    },
    {
      label: "定结县",
      value: "156540231"
    },
    {
      label: "洛扎县",
      value: "156540527"
    },
    {
      label: "隆子县",
      value: "156540529"
    },
    {
      label: "高县",
      value: "156511525"
    },
    {
      label: "措美县",
      value: "156540526"
    },
    {
      label: "德钦县",
      value: "156533422"
    },
    {
      label: "冕宁县",
      value: "156513433"
    },
    {
      label: "康马县",
      value: "156540230"
    },
    {
      label: "绥江县",
      value: "156530626"
    },
    {
      label: "水富市",
      value: "156530681"
    },
    {
      label: "越西县",
      value: "156513434"
    },
    {
      label: "屏山县",
      value: "156511529"
    },
    {
      label: "定日县",
      value: "156540223"
    },
    {
      label: "察隅县",
      value: "156540425"
    },
    {
      label: "叙州区",
      value: "156511504"
    },
    {
      label: "得荣县",
      value: "156513338"
    },
    {
      label: "马边彝族自治县",
      value: "156511133"
    },
    {
      label: "吉隆县",
      value: "156540234"
    },
    {
      label: "萨迦县",
      value: "156540224"
    },
    {
      label: "江孜县",
      value: "156540222"
    },
    {
      label: "乡城县",
      value: "156513336"
    },
    {
      label: "沐川县",
      value: "156511129"
    },
    {
      label: "甘洛县",
      value: "156513435"
    },
    {
      label: "浪卡子县",
      value: "156540531"
    },
    {
      label: "九龙县",
      value: "156513324"
    },
    {
      label: "琼结县",
      value: "156540524"
    },
    {
      label: "稻城县",
      value: "156513337"
    },
    {
      label: "朗县",
      value: "156540426"
    },
    {
      label: "曲松县",
      value: "156540525"
    },
    {
      label: "拉孜县",
      value: "156540225"
    },
    {
      label: "白朗县",
      value: "156540228"
    },
    {
      label: "加查县",
      value: "156540528"
    },
    {
      label: "犍为县",
      value: "156511123"
    },
    {
      label: "米林县",
      value: "156540422"
    },
    {
      label: "乃东区",
      value: "156540502"
    },
    {
      label: "石棉县",
      value: "156511824"
    },
    {
      label: "峨边彝族自治县",
      value: "156511132"
    },
    {
      label: "仁布县",
      value: "156540229"
    },
    {
      label: "金口河区",
      value: "156511113"
    },
    {
      label: "扎囊县",
      value: "156540521"
    },
    {
      label: "桑日县",
      value: "156540523"
    },
    {
      label: "桑珠孜区",
      value: "156540202"
    },
    {
      label: "贡嘎县",
      value: "156540522"
    },
    {
      label: "昂仁县",
      value: "156540226"
    },
    {
      label: "墨脱县",
      value: "156540423"
    },
    {
      label: "萨嘎县",
      value: "156540236"
    },
    {
      label: "汉源县",
      value: "156511823"
    },
    {
      label: "曲水县",
      value: "156540124"
    },
    {
      label: "五通桥区",
      value: "156511112"
    },
    {
      label: "沙湾区",
      value: "156511111"
    },
    {
      label: "尼木县",
      value: "156540123"
    },
    {
      label: "谢通门县",
      value: "156540227"
    },
    {
      label: "荣县",
      value: "156510321"
    },
    {
      label: "市中区",
      value: "156511102"
    },
    {
      label: "峨眉山市",
      value: "156511181"
    },
    {
      label: "巴宜区",
      value: "156540402"
    },
    {
      label: "堆龙德庆区",
      value: "156540103"
    },
    {
      label: "井研县",
      value: "156511124"
    },
    {
      label: "城关区",
      value: "156540102"
    },
    {
      label: "达孜区",
      value: "156540104"
    },
    {
      label: "左贡县",
      value: "156540327"
    },
    {
      label: "芒康县",
      value: "156540328"
    },
    {
      label: "南木林县",
      value: "156540221"
    },
    {
      label: "夹江县",
      value: "156511126"
    },
    {
      label: "仲巴县",
      value: "156540232"
    },
    {
      label: "荥经县",
      value: "156511822"
    },
    {
      label: "青神县",
      value: "156511425"
    },
    {
      label: "墨竹工卡县",
      value: "156540127"
    },
    {
      label: "波密县",
      value: "156540424"
    },
    {
      label: "工布江达县",
      value: "156540421"
    },
    {
      label: "林周县",
      value: "156540121"
    },
    {
      label: "洪雅县",
      value: "156511423"
    },
    {
      label: "泸定县",
      value: "156513322"
    },
    {
      label: "仁寿县",
      value: "156511421"
    },
    {
      label: "理塘县",
      value: "156513334"
    },
    {
      label: "康定市",
      value: "156513301"
    },
    {
      label: "巴塘县",
      value: "156513335"
    },
    {
      label: "雨城区",
      value: "156511802"
    },
    {
      label: "丹棱县",
      value: "156511424"
    },
    {
      label: "雅江县",
      value: "156513325"
    },
    {
      label: "东坡区",
      value: "156511402"
    },
    {
      label: "八宿县",
      value: "156540326"
    },
    {
      label: "天全县",
      value: "156511825"
    },
    {
      label: "名山区",
      value: "156511803"
    },
    {
      label: "芦山县",
      value: "156511826"
    },
    {
      label: "彭山区",
      value: "156511403"
    },
    {
      label: "蒲江县",
      value: "156510131"
    },
    {
      label: "普兰县",
      value: "156542521"
    },
    {
      label: "宝兴县",
      value: "156511827"
    },
    {
      label: "新津区",
      value: "156510118"
    },
    {
      label: "邛崃市",
      value: "156510183"
    },
    {
      label: "当雄县",
      value: "156540122"
    },
    {
      label: "龙泉驿区",
      value: "156510112"
    },
    {
      label: "双流区",
      value: "156510116"
    },
    {
      label: "大邑县",
      value: "156510129"
    },
    {
      label: "崇州市",
      value: "156510184"
    },
    {
      label: "嘉黎县",
      value: "156540621"
    },
    {
      label: "武侯区",
      value: "156510107"
    },
    {
      label: "察雅县",
      value: "156540325"
    },
    {
      label: "锦江区",
      value: "156510104"
    },
    {
      label: "成华区",
      value: "156510108"
    },
    {
      label: "青羊区",
      value: "156510105"
    },
    {
      label: "温江区",
      value: "156510115"
    },
    {
      label: "金牛区",
      value: "156510106"
    },
    {
      label: "洛隆县",
      value: "156540329"
    },
    {
      label: "郫都区",
      value: "156510117"
    },
    {
      label: "新都区",
      value: "156510114"
    },
    {
      label: "贡觉县",
      value: "156540322"
    },
    {
      label: "金堂县",
      value: "156510121"
    },
    {
      label: "青白江区",
      value: "156510113"
    },
    {
      label: "丹巴县",
      value: "156513323"
    },
    {
      label: "申扎县",
      value: "156540625"
    },
    {
      label: "边坝县",
      value: "156540330"
    },
    {
      label: "新龙县",
      value: "156513329"
    },
    {
      label: "广汉市",
      value: "156510681"
    },
    {
      label: "道孚县",
      value: "156513326"
    },
    {
      label: "都江堰市",
      value: "156510181"
    },
    {
      label: "彭州市",
      value: "156510182"
    },
    {
      label: "小金县",
      value: "156513227"
    },
    {
      label: "措勤县",
      value: "156542527"
    },
    {
      label: "什邡市",
      value: "156510682"
    },
    {
      label: "卡若区",
      value: "156540302"
    },
    {
      label: "旌阳区",
      value: "156510603"
    },
    {
      label: "白玉县",
      value: "156513331"
    },
    {
      label: "类乌齐县",
      value: "156540323"
    },
    {
      label: "罗江区",
      value: "156510604"
    },
    {
      label: "绵竹市",
      value: "156510683"
    },
    {
      label: "炉霍县",
      value: "156513327"
    },
    {
      label: "班戈县",
      value: "156540627"
    },
    {
      label: "丁青县",
      value: "156540324"
    },
    {
      label: "理县",
      value: "156513222"
    },
    {
      label: "色尼区",
      value: "156540602"
    },
    {
      label: "金川县",
      value: "156513226"
    },
    {
      label: "汶川县",
      value: "156513221"
    },
    {
      label: "比如县",
      value: "156540622"
    },
    {
      label: "札达县",
      value: "156542522"
    },
    {
      label: "江达县",
      value: "156540321"
    },
    {
      label: "甘孜县",
      value: "156513328"
    },
    {
      label: "北川羌族自治县",
      value: "156510726"
    },
    {
      label: "茂县",
      value: "156513223"
    },
    {
      label: "尼玛县",
      value: "156540629"
    },
    {
      label: "德格县",
      value: "156513330"
    },
    {
      label: "索县",
      value: "156540626"
    },
    {
      label: "马尔康市",
      value: "156513201"
    },
    {
      label: "巴青县",
      value: "156540628"
    },
    {
      label: "黑水县",
      value: "156513228"
    },
    {
      label: "聂荣县",
      value: "156540623"
    },
    {
      label: "囊谦县",
      value: "156632725"
    },
    {
      label: "安多县",
      value: "156540624"
    },
    {
      label: "壤塘县",
      value: "156513230"
    },
    {
      label: "色达县",
      value: "156513333"
    },
    {
      label: "改则县",
      value: "156542526"
    },
    {
      label: "革吉县",
      value: "156542525"
    },
    {
      label: "平武县",
      value: "156510727"
    },
    {
      label: "双湖县",
      value: "156540630"
    },
    {
      label: "噶尔县",
      value: "156542523"
    },
    {
      label: "松潘县",
      value: "156513224"
    },
    {
      label: "红原县",
      value: "156513233"
    },
    {
      label: "杂多县",
      value: "156632722"
    },
    {
      label: "阿坝县",
      value: "156513231"
    },
    {
      label: "班玛县",
      value: "156632622"
    },
    {
      label: "石渠县",
      value: "156513332"
    },
    {
      label: "玉树市",
      value: "156632701"
    },
    {
      label: "九寨沟县",
      value: "156513225"
    },
    {
      label: "称多县",
      value: "156632723"
    },
    {
      label: "日土县",
      value: "156542524"
    },
    {
      label: "久治县",
      value: "156632625"
    },
    {
      label: "若尔盖县",
      value: "156513232"
    },
    {
      label: "达日县",
      value: "156632624"
    },
    {
      label: "舟曲县",
      value: "156623023"
    },
    {
      label: "治多县",
      value: "156632724"
    },
    {
      label: "甘德县",
      value: "156632623"
    },
    {
      label: "玛曲县",
      value: "156623025"
    },
    {
      label: "宕昌县",
      value: "156621223"
    },
    {
      label: "迭部县",
      value: "156623024"
    },
    {
      label: "曲麻莱县",
      value: "156632726"
    },
    {
      label: "岷县",
      value: "156621126"
    },
    {
      label: "玛沁县",
      value: "156632621"
    },
    {
      label: "卓尼县",
      value: "156623022"
    },
    {
      label: "碌曲县",
      value: "156623026"
    },
    {
      label: "临潭县",
      value: "156623021"
    },
    {
      label: "河南蒙古族自治县",
      value: "156632324"
    },
    {
      label: "漳县",
      value: "156621125"
    },
    {
      label: "玛多县",
      value: "156632626"
    },
    {
      label: "合作市",
      value: "156623001"
    },
    {
      label: "泽库县",
      value: "156632323"
    },
    {
      label: "渭源县",
      value: "156621123"
    },
    {
      label: "吉阳区",
      value: "156460203"
    },
    {
      label: "海棠区",
      value: "156460202"
    },
    {
      label: "天涯区",
      value: "156460204"
    },
    {
      label: "崖州区",
      value: "156460205"
    },
    {
      label: "陵水黎族自治县",
      value: "156469028"
    },
    {
      label: "保亭黎族苗族自治县",
      value: "156469029"
    },
    {
      label: "乐东黎族自治县",
      value: "156469027"
    },
    {
      label: "五指山市",
      value: "156469001"
    },
    {
      label: "万宁市",
      value: "156469006"
    },
    {
      label: "琼中黎族苗族自治县",
      value: "156469030"
    },
    {
      label: "东方市",
      value: "156469007"
    },
    {
      label: "白沙黎族自治县",
      value: "156469025"
    },
    {
      label: "琼海市",
      value: "156469002"
    },
    {
      label: "昌江黎族自治县",
      value: "156469026"
    },
    {
      label: "屯昌县",
      value: "156469022"
    },
    {
      label: "儋州市",
      value: "156460400"
    },
    {
      label: "文昌市",
      value: "156469005"
    },
    {
      label: "定安县",
      value: "156469021"
    },
    {
      label: "澄迈县",
      value: "156469023"
    },
    {
      label: "临高县",
      value: "156469024"
    },
    {
      label: "琼山区",
      value: "156460107"
    },
    {
      label: "秀英区",
      value: "156460105"
    },
    {
      label: "美兰区",
      value: "156460108"
    },
    {
      label: "龙华区",
      value: "156460106"
    },
    {
      label: "徐闻县",
      value: "156440825"
    },
    {
      label: "雷州市",
      value: "156440882"
    },
    {
      label: "霞山区",
      value: "156440803"
    },
    {
      label: "坡头区",
      value: "156440804"
    },
    {
      label: "麻章区",
      value: "156440811"
    },
    {
      label: "赤坎区",
      value: "156440802"
    },
    {
      label: "遂溪县",
      value: "156440823"
    },
    {
      label: "吴川市",
      value: "156440883"
    },
    {
      label: "银海区",
      value: "156450503"
    },
    {
      label: "海城区",
      value: "156450502"
    },
    {
      label: "电白区",
      value: "156440904"
    },
    {
      label: "铁山港区",
      value: "156450512"
    },
    {
      label: "东兴市",
      value: "156450681"
    },
    {
      label: "廉江市",
      value: "156440881"
    },
    {
      label: "茂南区",
      value: "156440902"
    },
    {
      label: "港口区",
      value: "156450602"
    },
    {
      label: "合浦县",
      value: "156450521"
    },
    {
      label: "化州市",
      value: "156440982"
    },
    {
      label: "阳西县",
      value: "156441721"
    },
    {
      label: "防城区",
      value: "156450603"
    },
    {
      label: "江城区",
      value: "156441702"
    },
    {
      label: "阳东区",
      value: "156441704"
    },
    {
      label: "高州市",
      value: "156440981"
    },
    {
      label: "钦南区",
      value: "156450702"
    },
    {
      label: "钦北区",
      value: "156450702"
    },
    {
      label: "凭祥市",
      value: "156451481"
    },
    {
      label: "宁明县",
      value: "156451422"
    },
    {
      label: "金湾区",
      value: "156440404"
    },
    {
      label: "上思县",
      value: "156450621"
    },
    {
      label: "阳春市",
      value: "156441781"
    },
    {
      label: "恩平市",
      value: "156440785"
    },
    {
      label: "斗门区",
      value: "156440403"
    },
    {
      label: "南区",
      value: "156810105"
    },
    {
      label: "台山市",
      value: "156440781"
    },
    {
      label: "离岛区",
      value: "156810110"
    },
    {
      label: "香洲区",
      value: "156440402"
    },
    {
      label: "浦北县",
      value: "156450722"
    },
    {
      label: "博白县",
      value: "156450923"
    },
    {
      label: "湾仔区",
      value: "156810107"
    },
    {
      label: "中西区",
      value: "156810101"
    },
    {
      label: "东区",
      value: "156810102"
    },
    {
      label: "油尖旺区",
      value: "156810109"
    },
    {
      label: "观塘区",
      value: "156810104"
    },
    {
      label: "九龙城区",
      value: "156810103"
    },
    {
      label: "陆川县",
      value: "156450922"
    },
    {
      label: "深水埗区",
      value: "156810106"
    },
    {
      label: "黄大仙区",
      value: "156810108"
    },
    {
      label: "龙州县",
      value: "156451423"
    },
    {
      label: "葵青区",
      value: "156810111"
    },
    {
      label: "信宜市",
      value: "156440983"
    },
    {
      label: "开平市",
      value: "156440783"
    },
    {
      label: "荃湾区",
      value: "156810117"
    },
    {
      label: "西贡区",
      value: "156810113"
    },
    {
      label: "沙田区",
      value: "156810114"
    },
    {
      label: "屯门区",
      value: "156810115"
    },
    {
      label: "江州区",
      value: "156451402"
    },
    {
      label: "灵山县",
      value: "156450721"
    },
    {
      label: "元朗区",
      value: "156810118"
    },
    {
      label: "大埔区",
      value: "156810116"
    },
    {
      label: "新会区",
      value: "156440705"
    },
    {
      label: "北区",
      value: "156810112"
    },
    {
      label: "福田区",
      value: "156440304"
    },
    {
      label: "南山区",
      value: "156440305"
    },
    {
      label: "福绵区",
      value: "156450903"
    },
    {
      label: "罗湖区",
      value: "156440303"
    },
    {
      label: "宝安区",
      value: "156440306"
    },
    {
      label: "盐田区",
      value: "156440308"
    },
    {
      label: "江海区",
      value: "156440704"
    },
    {
      label: "蓬江区",
      value: "156440703"
    },
    {
      label: "玉州区",
      value: "156450902"
    },
    {
      label: "扶绥县",
      value: "156451421"
    },
    {
      label: "横县",
      value: "156450127"
    },
    {
      label: "屏东县",
      value: "156710011"
    },
    {
      label: "新兴县",
      value: "156445321"
    },
    {
      label: "北流市",
      value: "156450981"
    },
    {
      label: "龙岗区",
      value: "156440307"
    },
    {
      label: "兴业县",
      value: "156450924"
    },
    {
      label: "良庆区",
      value: "156450108"
    },
    {
      label: "邕宁区",
      value: "156450109"
    },
    {
      label: "鹤山市",
      value: "156440784"
    },
    {
      label: "罗定市",
      value: "156445381"
    },
    {
      label: "城区",
      value: "156441502"
    },
    {
      label: "江南区",
      value: "156450105"
    },
    {
      label: "青秀区",
      value: "156450103"
    },
    {
      label: "惠阳区",
      value: "156441303"
    },
    {
      label: "南沙区",
      value: "156440115"
    },
    {
      label: "顺德区",
      value: "156440606"
    },
    {
      label: "大新县",
      value: "156451424"
    },
    {
      label: "西乡塘区",
      value: "156450107"
    },
    {
      label: "兴宁区",
      value: "156450102"
    },
    {
      label: "容县",
      value: "156450921"
    },
    {
      label: "高明区",
      value: "156440608"
    },
    {
      label: "陆丰市",
      value: "156441581"
    },
    {
      label: "岑溪市",
      value: "156450481"
    },
    {
      label: "云城区",
      value: "156445302"
    },
    {
      label: "番禺区",
      value: "156440113"
    },
    {
      label: "海丰县",
      value: "156441521"
    },
    {
      label: "惠东县",
      value: "156441323"
    },
    {
      label: "禅城区",
      value: "156440604"
    },
    {
      label: "高要区",
      value: "156441204"
    },
    {
      label: "南海区",
      value: "156440605"
    },
    {
      label: "惠来县",
      value: "156445224"
    },
    {
      label: "端州区",
      value: "156441202"
    },
    {
      label: "云安区",
      value: "156445303"
    },
    {
      label: "港南区",
      value: "156450803"
    },
    {
      label: "天等县",
      value: "156451425"
    },
    {
      label: "海珠区",
      value: "156440105"
    },
    {
      label: "惠城区",
      value: "156441302"
    },
    {
      label: "黄埔区",
      value: "156440112"
    },
    {
      label: "港北区",
      value: "156450802"
    },
    {
      label: "天河区",
      value: "156440106"
    },
    {
      label: "麻栗坡县",
      value: "156532624"
    },
    {
      label: "荔湾区",
      value: "156440103"
    },
    {
      label: "覃塘区",
      value: "156450804"
    },
    {
      label: "越秀区",
      value: "156440104"
    },
    {
      label: "靖西市",
      value: "156451081"
    },
    {
      label: "德庆县",
      value: "156441226"
    },
    {
      label: "三水区",
      value: "156440607"
    },
    {
      label: "白云区",
      value: "156440111"
    },
    {
      label: "鼎湖区",
      value: "156441203"
    },
    {
      label: "武鸣区",
      value: "156450110"
    },
    {
      label: "隆安县",
      value: "156450123"
    },
    {
      label: "博罗县",
      value: "156441322"
    },
    {
      label: "宾阳县",
      value: "156450126"
    },
    {
      label: "郁南县",
      value: "156445322"
    },
    {
      label: "潮南区",
      value: "156440514"
    },
    {
      label: "增城区",
      value: "156440118"
    },
    {
      label: "潮阳区",
      value: "156440513"
    },
    {
      label: "濠江区",
      value: "156440512"
    },
    {
      label: "普宁市",
      value: "156445281"
    },
    {
      label: "陆河县",
      value: "156441523"
    },
    {
      label: "德保县",
      value: "156451024"
    },
    {
      label: "四会市",
      value: "156441284"
    },
    {
      label: "平果市",
      value: "156451082"
    },
    {
      label: "金平区",
      value: "156440511"
    },
    {
      label: "龙湖区",
      value: "156440507"
    },
    {
      label: "藤县",
      value: "156450422"
    },
    {
      label: "那坡县",
      value: "156451026"
    },
    {
      label: "桂平市",
      value: "156450881"
    },
    {
      label: "花都区",
      value: "156440114"
    },
    {
      label: "龙圩区",
      value: "156450406"
    },
    {
      label: "南澳县",
      value: "156440523"
    },
    {
      label: "封开县",
      value: "156441225"
    },
    {
      label: "揭西县",
      value: "156445222"
    },
    {
      label: "上林县",
      value: "156450125"
    },
    {
      label: "西畴县",
      value: "156532623"
    },
    {
      label: "嘉义县",
      value: "156716000"
    },
    {
      label: "潮安区",
      value: "156445103"
    },
    {
      label: "澄海区",
      value: "156440515"
    },
    {
      label: "万秀区",
      value: "156450403"
    },
    {
      label: "嘉义市",
      value: "156715000"
    },
    {
      label: "长洲区",
      value: "156450405"
    },
    {
      label: "榕城区",
      value: "156445202"
    },
    {
      label: "平南县",
      value: "156450821"
    },
    {
      label: "从化区",
      value: "156440117"
    },
    {
      label: "揭东区",
      value: "156445203"
    },
    {
      label: "澎湖县",
      value: "156710010"
    },
    {
      label: "武宣县",
      value: "156451323"
    },
    {
      label: "田东县",
      value: "156451022"
    },
    {
      label: "富宁县",
      value: "156532628"
    },
    {
      label: "广宁县",
      value: "156441223"
    },
    {
      label: "紫金县",
      value: "156441621"
    },
    {
      label: "饶平县",
      value: "156445122"
    },
    {
      label: "湘桥区",
      value: "156445102"
    },
    {
      label: "清城区",
      value: "156441802"
    },
    {
      label: "东山县",
      value: "156350626"
    },
    {
      label: "马山县",
      value: "156450124"
    },
    {
      label: "诏安县",
      value: "156350624"
    },
    {
      label: "兴宾区",
      value: "156451302"
    },
    {
      label: "龙门县",
      value: "156441324"
    },
    {
      label: "源城区",
      value: "156441602"
    },
    {
      label: "清新区",
      value: "156441803"
    },
    {
      label: "田阳区",
      value: "156451003"
    },
    {
      label: "大化瑶族自治县",
      value: "156451229"
    },
    {
      label: "丰顺县",
      value: "156441423"
    },
    {
      label: "东源县",
      value: "156441625"
    },
    {
      label: "合山市",
      value: "156451381"
    },
    {
      label: "佛冈县",
      value: "156441821"
    },
    {
      label: "右江区",
      value: "156451002"
    },
    {
      label: "怀集县",
      value: "156441224"
    },
    {
      label: "都安瑶族自治县",
      value: "156451228"
    },
    {
      label: "五华县",
      value: "156441424"
    },
    {
      label: "云霄县",
      value: "156350622"
    },
    {
      label: "象州县",
      value: "156451322"
    },
    {
      label: "广南县",
      value: "156532627"
    },
    {
      label: "新丰县",
      value: "156440233"
    },
    {
      label: "忻城县",
      value: "156451321"
    },
    {
      label: "龙川县",
      value: "156441622"
    },
    {
      label: "漳浦县",
      value: "156350623"
    },
    {
      label: "兴宁市",
      value: "156441481"
    },
    {
      label: "金秀瑶族自治县",
      value: "156451324"
    },
    {
      label: "巴马瑶族自治县",
      value: "156451227"
    },
    {
      label: "昭平县",
      value: "156451121"
    },
    {
      label: "英德市",
      value: "156441881"
    },
    {
      label: "蒙山县",
      value: "156450423"
    },
    {
      label: "柳江区",
      value: "156450206"
    },
    {
      label: "梅县区",
      value: "156441403"
    },
    {
      label: "田林县",
      value: "156451029"
    },
    {
      label: "梅江区",
      value: "156441402"
    },
    {
      label: "城中区",
      value: "156450202"
    },
    {
      label: "鱼峰区",
      value: "156450203"
    },
    {
      label: "柳南区",
      value: "156450204"
    },
    {
      label: "凌云县",
      value: "156451027"
    },
    {
      label: "大埔县",
      value: "156441422"
    },
    {
      label: "翁源县",
      value: "156440229"
    },
    {
      label: "柳北区",
      value: "156450205"
    },
    {
      label: "平和县",
      value: "156350628"
    },
    {
      label: "连平县",
      value: "156441623"
    },
    {
      label: "八步区",
      value: "156451102"
    },
    {
      label: "金门县",
      value: "156350527"
    },
    {
      label: "和平县",
      value: "156441624"
    },
    {
      label: "思明区",
      value: "156350203"
    },
    {
      label: "龙海市",
      value: "156350681"
    },
    {
      label: "阳山县",
      value: "156441823"
    },
    {
      label: "鹿寨县",
      value: "156450223"
    },
    {
      label: "海沧区",
      value: "156350205"
    },
    {
      label: "宜州区",
      value: "156451203"
    },
    {
      label: "荔浦市",
      value: "156450381"
    },
    {
      label: "西林县",
      value: "156451030"
    },
    {
      label: "龙文区",
      value: "156350603"
    },
    {
      label: "东兰县",
      value: "156451224"
    },
    {
      label: "芗城区",
      value: "156350602"
    },
    {
      label: "湖里区",
      value: "156350206"
    },
    {
      label: "南靖县",
      value: "156350627"
    },
    {
      label: "钟山县",
      value: "156451122"
    },
    {
      label: "凤山县",
      value: "156451223"
    },
    {
      label: "平远县",
      value: "156441426"
    },
    {
      label: "连山壮族瑶族自治县",
      value: "156441825"
    },
    {
      label: "集美区",
      value: "156350211"
    },
    {
      label: "翔安区",
      value: "156350213"
    },
    {
      label: "长泰县",
      value: "156350625"
    },
    {
      label: "平乐县",
      value: "156450330"
    },
    {
      label: "柳城县",
      value: "156450222"
    },
    {
      label: "蕉岭县",
      value: "156441427"
    },
    {
      label: "曲江区",
      value: "156440205"
    },
    {
      label: "金城江区",
      value: "156451202"
    },
    {
      label: "同安区",
      value: "156350212"
    },
    {
      label: "永定区",
      value: "156350803"
    },
    {
      label: "连南瑶族自治县",
      value: "156441826"
    },
    {
      label: "石狮市",
      value: "156350581"
    },
    {
      label: "全南县",
      value: "156360729"
    },
    {
      label: "隆林各族自治县",
      value: "156451031"
    },
    {
      label: "乳源瑶族自治县",
      value: "156440232"
    },
    {
      label: "罗城仫佬族自治县",
      value: "156451225"
    },
    {
      label: "阳朔县",
      value: "156450321"
    },
    {
      label: "连州市",
      value: "156441882"
    },
    {
      label: "晋江市",
      value: "156350582"
    },
    {
      label: "定南县",
      value: "156360728"
    },
    {
      label: "乐业县",
      value: "156451028"
    },
    {
      label: "武江区",
      value: "156440203"
    },
    {
      label: "浈江区",
      value: "156440204"
    },
    {
      label: "富川瑶族自治县",
      value: "156451123"
    },
    {
      label: "环江毛南族自治县",
      value: "156451226"
    },
    {
      label: "恭城瑶族自治县",
      value: "156450332"
    },
    {
      label: "鲤城区",
      value: "156350502"
    },
    {
      label: "丰泽区",
      value: "156350503"
    },
    {
      label: "龙南市",
      value: "156360783"
    },
    {
      label: "洛江区",
      value: "156350504"
    },
    {
      label: "始兴县",
      value: "156440222"
    },
    {
      label: "南安市",
      value: "156350583"
    },
    {
      label: "寻乌县",
      value: "156360734"
    },
    {
      label: "南丹县",
      value: "156451221"
    },
    {
      label: "永福县",
      value: "156450326"
    },
    {
      label: "册亨县",
      value: "156522327"
    },
    {
      label: "天峨县",
      value: "156451222"
    },
    {
      label: "华安县",
      value: "156350629"
    },
    {
      label: "惠安县",
      value: "156350521"
    },
    {
      label: "上杭县",
      value: "156350823"
    },
    {
      label: "安溪县",
      value: "156350524"
    },
    {
      label: "融水苗族自治县",
      value: "156450225"
    },
    {
      label: "仁化县",
      value: "156440224"
    },
    {
      label: "兴义市",
      value: "156522301"
    },
    {
      label: "武平县",
      value: "156350824"
    },
    {
      label: "新罗区",
      value: "156350802"
    },
    {
      label: "安龙县",
      value: "156522328"
    },
    {
      label: "雁山区",
      value: "156450311"
    },
    {
      label: "南雄市",
      value: "156440282"
    },
    {
      label: "乐昌市",
      value: "156440281"
    },
    {
      label: "泉港区",
      value: "156350505"
    },
    {
      label: "安远县",
      value: "156360726"
    },
    {
      label: "望谟县",
      value: "156522326"
    },
    {
      label: "江华瑶族自治县",
      value: "156431129"
    },
    {
      label: "融安县",
      value: "156450224"
    },
    {
      label: "临桂区",
      value: "156450312"
    },
    {
      label: "七星区",
      value: "156450305"
    },
    {
      label: "象山区",
      value: "156450304"
    },
    {
      label: "秀峰区",
      value: "156450302"
    },
    {
      label: "江永县",
      value: "156431125"
    },
    {
      label: "临武县",
      value: "156431025"
    },
    {
      label: "漳平市",
      value: "156350881"
    },
    {
      label: "叠彩区",
      value: "156450303"
    },
    {
      label: "秀屿区",
      value: "156350305"
    },
    {
      label: "永春县",
      value: "156350525"
    },
    {
      label: "仙游县",
      value: "156350322"
    },
    {
      label: "蓝山县",
      value: "156431127"
    },
    {
      label: "信丰县",
      value: "156360722"
    },
    {
      label: "贞丰县",
      value: "156522325"
    },
    {
      label: "宜章县",
      value: "156431022"
    },
    {
      label: "大余县",
      value: "156360723"
    },
    {
      label: "灵川县",
      value: "156450323"
    },
    {
      label: "荔波县",
      value: "156522722"
    },
    {
      label: "城厢区",
      value: "156350302"
    },
    {
      label: "罗甸县",
      value: "156522728"
    },
    {
      label: "荔城区",
      value: "156350304"
    },
    {
      label: "兴仁市",
      value: "156522302"
    },
    {
      label: "涵江区",
      value: "156350303"
    },
    {
      label: "灌阳县",
      value: "156450327"
    },
    {
      label: "德化县",
      value: "156350526"
    },
    {
      label: "平潭县",
      value: "156350128"
    },
    {
      label: "道县",
      value: "156431124"
    },
    {
      label: "台东县",
      value: "156710013"
    },
    {
      label: "云林县",
      value: "156710022"
    },
    {
      label: "南投县",
      value: "156718000"
    },
    {
      label: "花莲县",
      value: "156713000"
    },
    {
      label: "彰化县",
      value: "156710023"
    },
    {
      label: "苗栗县",
      value: "156717000"
    },
    {
      label: "宜兰县",
      value: "156710021"
    },
    {
      label: "新竹市",
      value: "156710019"
    },
    {
      label: "新竹县",
      value: "156710020"
    },
    {
      label: "基隆市",
      value: "156714000"
    },
    {
      label: "宁远县",
      value: "156431126"
    },
    {
      label: "嘉禾县",
      value: "156431024"
    },
    {
      label: "兴安县",
      value: "156450325"
    },
    {
      label: "紫云苗族布依族自治县",
      value: "156520425"
    },
    {
      label: "从江县",
      value: "156522633"
    },
    {
      label: "三江侗族自治县",
      value: "156450226"
    },
    {
      label: "普安县",
      value: "156522323"
    },
    {
      label: "龙胜各族自治县",
      value: "156450328"
    },
    {
      label: "独山县",
      value: "156522726"
    },
    {
      label: "平塘县",
      value: "156522727"
    },
    {
      label: "晴隆县",
      value: "156522324"
    },
    {
      label: "新田县",
      value: "156431128"
    },
    {
      label: "全州县",
      value: "156450324"
    },
    {
      label: "榕江县",
      value: "156522632"
    },
    {
      label: "关岭布依族苗族自治县",
      value: "156520424"
    },
    {
      label: "双牌县",
      value: "156431123"
    },
    {
      label: "三都水族自治县",
      value: "156522732"
    },
    {
      label: "长顺县",
      value: "156522729"
    },
    {
      label: "资源县",
      value: "156450329"
    },
    {
      label: "镇宁布依族苗族自治县",
      value: "156520423"
    },
    {
      label: "惠水县",
      value: "156522731"
    },
    {
      label: "通道侗族自治县",
      value: "156431230"
    },
    {
      label: "丹寨县",
      value: "156522636"
    },
    {
      label: "六枝特区",
      value: "156520203"
    },
    {
      label: "零陵区",
      value: "156431102"
    },
    {
      label: "黎平县",
      value: "156522631"
    },
    {
      label: "西秀区",
      value: "156520402"
    },
    {
      label: "都匀市",
      value: "156522701"
    },
    {
      label: "普定县",
      value: "156520422"
    },
    {
      label: "雷山县",
      value: "156522634"
    },
    {
      label: "城步苗族自治县",
      value: "156430529"
    },
    {
      label: "东安县",
      value: "156431122"
    },
    {
      label: "平坝区",
      value: "156520403"
    },
    {
      label: "花溪区",
      value: "156520111"
    },
    {
      label: "常宁市",
      value: "156430482"
    },
    {
      label: "新宁县",
      value: "156430528"
    },
    {
      label: "龙里县",
      value: "156522730"
    },
    {
      label: "冷水滩区",
      value: "156431103"
    },
    {
      label: "麻江县",
      value: "156522635"
    },
    {
      label: "水城区",
      value: "156520221"
    },
    {
      label: "清镇市",
      value: "156520181"
    },
    {
      label: "凯里市",
      value: "156522601"
    },
    {
      label: "南明区",
      value: "156520102"
    },
    {
      label: "钟山区",
      value: "156520201"
    },
    {
      label: "靖州苗族侗族自治县",
      value: "156431229"
    },
    {
      label: "祁阳县",
      value: "156431121"
    },
    {
      label: "绥宁县",
      value: "156430527"
    },
    {
      label: "贵定县",
      value: "156522723"
    },
    {
      label: "云岩区",
      value: "156520103"
    },
    {
      label: "乌当区",
      value: "156520112"
    },
    {
      label: "织金县",
      value: "156520524"
    },
    {
      label: "台江县",
      value: "156522630"
    },
    {
      label: "锦屏县",
      value: "156522628"
    },
    {
      label: "白云区",
      value: "156520113"
    },
    {
      label: "福泉市",
      value: "156522702"
    },
    {
      label: "武冈市",
      value: "156430581"
    },
    {
      label: "剑河县",
      value: "156522629"
    },
    {
      label: "纳雍县",
      value: "156520525"
    },
    {
      label: "祁东县",
      value: "156430426"
    },
    {
      label: "修文县",
      value: "156520123"
    },
    {
      label: "会同县",
      value: "156431225"
    },
    {
      label: "黄平县",
      value: "156522622"
    },
    {
      label: "天柱县",
      value: "156522627"
    },
    {
      label: "三穗县",
      value: "156522624"
    },
    {
      label: "衡阳县",
      value: "156430421"
    },
    {
      label: "邵阳县",
      value: "156430523"
    },
    {
      label: "黔西县",
      value: "156520522"
    },
    {
      label: "施秉县",
      value: "156522623"
    },
    {
      label: "镇远县",
      value: "156522625"
    },
    {
      label: "开阳县",
      value: "156520121"
    },
    {
      label: "洞口县",
      value: "156430525"
    },
    {
      label: "瓮安县",
      value: "156522725"
    },
    {
      label: "息烽县",
      value: "156520122"
    },
    {
      label: "隆回县",
      value: "156430524"
    },
    {
      label: "赫章县",
      value: "156520527"
    },
    {
      label: "大方县",
      value: "156520521"
    },
    {
      label: "岑巩县",
      value: "156522626"
    },
    {
      label: "洪江市",
      value: "156431281"
    },
    {
      label: "余庆县",
      value: "156520329"
    },
    {
      label: "大祥区",
      value: "156430503"
    },
    {
      label: "双清区",
      value: "156430502"
    },
    {
      label: "玉屏侗族自治县",
      value: "156520622"
    },
    {
      label: "北塔区",
      value: "156430511"
    },
    {
      label: "邵东市",
      value: "156430582"
    },
    {
      label: "七星关区",
      value: "156520502"
    },
    {
      label: "新邵县",
      value: "156430522"
    },
    {
      label: "新晃侗族自治县",
      value: "156431227"
    },
    {
      label: "中方县",
      value: "156431221"
    },
    {
      label: "镇雄县",
      value: "156530627"
    },
    {
      label: "芷江侗族自治县",
      value: "156431228"
    },
    {
      label: "双峰县",
      value: "156431321"
    },
    {
      label: "金沙县",
      value: "156520523"
    },
    {
      label: "石阡县",
      value: "156520623"
    },
    {
      label: "万山区",
      value: "156520603"
    },
    {
      label: "播州区",
      value: "156520304"
    },
    {
      label: "鹤城区",
      value: "156431202"
    },
    {
      label: "红花岗区",
      value: "156520302"
    },
    {
      label: "冷水江市",
      value: "156431381"
    },
    {
      label: "碧江区",
      value: "156520603"
    },
    {
      label: "涟源市",
      value: "156431382"
    },
    {
      label: "江口县",
      value: "156520621"
    },
    {
      label: "新化县",
      value: "156431322"
    },
    {
      label: "娄星区",
      value: "156431302"
    },
    {
      label: "湄潭县",
      value: "156520328"
    },
    {
      label: "汇川区",
      value: "156520303"
    },
    {
      label: "仁怀市",
      value: "156520382"
    },
    {
      label: "威信县",
      value: "156530629"
    },
    {
      label: "麻阳苗族自治县",
      value: "156431226"
    },
    {
      label: "溆浦县",
      value: "156431224"
    },
    {
      label: "韶山市",
      value: "156430382"
    },
    {
      label: "思南县",
      value: "156520624"
    },
    {
      label: "绥阳县",
      value: "156520323"
    },
    {
      label: "凤凰县",
      value: "156433123"
    },
    {
      label: "凤冈县",
      value: "156520327"
    },
    {
      label: "印江土家族苗族自治县",
      value: "156520625"
    },
    {
      label: "辰溪县",
      value: "156431223"
    },
    {
      label: "古蔺县",
      value: "156510525"
    },
    {
      label: "桐梓县",
      value: "156520322"
    },
    {
      label: "松桃苗族自治县",
      value: "156520628"
    },
    {
      label: "叙永县",
      value: "156510524"
    },
    {
      label: "泸溪县",
      value: "156433122"
    },
    {
      label: "吉首市",
      value: "156433101"
    },
    {
      label: "德江县",
      value: "156520626"
    },
    {
      label: "兴文县",
      value: "156511528"
    },
    {
      label: "习水县",
      value: "156520330"
    },
    {
      label: "安化县",
      value: "156430923"
    },
    {
      label: "珙县",
      value: "156511526"
    },
    {
      label: "秀山土家族苗族自治县",
      value: "156500241"
    },
    {
      label: "沅陵县",
      value: "156431222"
    },
    {
      label: "桃江县",
      value: "156430922"
    },
    {
      label: "正安县",
      value: "156520324"
    },
    {
      label: "务川仡佬族苗族自治县",
      value: "156520326"
    },
    {
      label: "沿河土家族自治县",
      value: "156520627"
    },
    {
      label: "花垣县",
      value: "156433124"
    },
    {
      label: "赫山区",
      value: "156430903"
    },
    {
      label: "长宁县",
      value: "156511524"
    },
    {
      label: "赤水市",
      value: "156520381"
    },
    {
      label: "资阳区",
      value: "156430902"
    },
    {
      label: "古丈县",
      value: "156433126"
    },
    {
      label: "保靖县",
      value: "156433125"
    },
    {
      label: "江安县",
      value: "156511523"
    },
    {
      label: "翠屏区",
      value: "156511502"
    },
    {
      label: "纳溪区",
      value: "156510503"
    },
    {
      label: "合江县",
      value: "156510522"
    },
    {
      label: "酉阳土家族苗族自治县",
      value: "156500242"
    },
    {
      label: "沅江市",
      value: "156430981"
    },
    {
      label: "南溪区",
      value: "156511503"
    },
    {
      label: "道真仡佬族苗族自治县",
      value: "156520325"
    },
    {
      label: "江阳区",
      value: "156510502"
    },
    {
      label: "桃源县",
      value: "156430725"
    },
    {
      label: "汉寿县",
      value: "156430722"
    },
    {
      label: "龙马潭区",
      value: "156510504"
    },
    {
      label: "永顺县",
      value: "156433127"
    },
    {
      label: "鼎城区",
      value: "156430703"
    },
    {
      label: "綦江区",
      value: "156500110"
    },
    {
      label: "武陵区",
      value: "156430702"
    },
    {
      label: "永定区",
      value: "156430802"
    },
    {
      label: "泸县",
      value: "156510521"
    },
    {
      label: "南川区",
      value: "156500119"
    },
    {
      label: "富顺县",
      value: "156510322"
    },
    {
      label: "沿滩区",
      value: "156510311"
    },
    {
      label: "江津区",
      value: "156500116"
    },
    {
      label: "彭水苗族土家族自治县",
      value: "156500243"
    },
    {
      label: "武隆县",
      value: "156500156"
    },
    {
      label: "自流井区",
      value: "156510302"
    },
    {
      label: "隆昌市",
      value: "156511083"
    },
    {
      label: "贡井区",
      value: "156510303"
    },
    {
      label: "武陵源区",
      value: "156430811"
    },
    {
      label: "永川区",
      value: "156500118"
    },
    {
      label: "南县",
      value: "156430921"
    },
    {
      label: "大安区",
      value: "156510304"
    },
    {
      label: "桑植县",
      value: "156430822"
    },
    {
      label: "巴南区",
      value: "156500113"
    },
    {
      label: "荣昌区",
      value: "156500153"
    },
    {
      label: "安乡县",
      value: "156430721"
    },
    {
      label: "慈利县",
      value: "156430821"
    },
    {
      label: "临澧县",
      value: "156430724"
    },
    {
      label: "龙山县",
      value: "156433130"
    },
    {
      label: "大渡口区",
      value: "156500104"
    },
    {
      label: "来凤县",
      value: "156422827"
    },
    {
      label: "九龙坡区",
      value: "156500107"
    },
    {
      label: "南岸区",
      value: "156500108"
    },
    {
      label: "威远县",
      value: "156511024"
    },
    {
      label: "黔江区",
      value: "156500114"
    },
    {
      label: "沙坪坝区",
      value: "156500106"
    },
    {
      label: "渝中区",
      value: "156500103"
    },
    {
      label: "石门县",
      value: "156430726"
    },
    {
      label: "市中区",
      value: "156511002"
    },
    {
      label: "璧山区",
      value: "156500120"
    },
    {
      label: "东兴区",
      value: "156511011"
    },
    {
      label: "津市市",
      value: "156430781"
    },
    {
      label: "江北区",
      value: "156500105"
    },
    {
      label: "澧县",
      value: "156430723"
    },
    {
      label: "咸丰县",
      value: "156422826"
    },
    {
      label: "涪陵区",
      value: "156500102"
    },
    {
      label: "大足区",
      value: "156500111"
    },
    {
      label: "渝北区",
      value: "156500112"
    },
    {
      label: "石首市",
      value: "156421081"
    },
    {
      label: "资中县",
      value: "156511025"
    },
    {
      label: "北碚区",
      value: "156500109"
    },
    {
      label: "铜梁区",
      value: "156500151"
    },
    {
      label: "长寿区",
      value: "156500115"
    },
    {
      label: "丰都县",
      value: "156500230"
    },
    {
      label: "鹤峰县",
      value: "156422828"
    },
    {
      label: "合川区",
      value: "156500117"
    },
    {
      label: "宣恩县",
      value: "156422825"
    },
    {
      label: "石柱土家族自治县",
      value: "156500240"
    },
    {
      label: "江陵县",
      value: "156421024"
    },
    {
      label: "公安县",
      value: "156421022"
    },
    {
      label: "安岳县",
      value: "156512021"
    },
    {
      label: "雁江区",
      value: "156512002"
    },
    {
      label: "松滋市",
      value: "156421087"
    },
    {
      label: "潼南区",
      value: "156500152"
    },
    {
      label: "五峰土家族自治县",
      value: "156420529"
    },
    {
      label: "乐至县",
      value: "156512022"
    },
    {
      label: "利川市",
      value: "156422802"
    },
    {
      label: "恩施市",
      value: "156422801"
    },
    {
      label: "忠县",
      value: "156500233"
    },
    {
      label: "沙市区",
      value: "156421002"
    },
    {
      label: "垫江县",
      value: "156500231"
    },
    {
      label: "邻水县",
      value: "156511623"
    },
    {
      label: "汝城县",
      value: "156431026"
    },
    {
      label: "会昌县",
      value: "156360733"
    },
    {
      label: "南康区",
      value: "156360703"
    },
    {
      label: "崇义县",
      value: "156360725"
    },
    {
      label: "大田县",
      value: "156350425"
    },
    {
      label: "连城县",
      value: "156350825"
    },
    {
      label: "福清市",
      value: "156350181"
    },
    {
      label: "桂阳县",
      value: "156431021"
    },
    {
      label: "北湖区",
      value: "156431002"
    },
    {
      label: "上犹县",
      value: "156360724"
    },
    {
      label: "苏仙区",
      value: "156431003"
    },
    {
      label: "章贡区",
      value: "156360702"
    },
    {
      label: "长汀县",
      value: "156350821"
    },
    {
      label: "永泰县",
      value: "156350125"
    },
    {
      label: "瑞金市",
      value: "156360781"
    },
    {
      label: "永安市",
      value: "156350481"
    },
    {
      label: "于都县",
      value: "156360731"
    },
    {
      label: "赣县区",
      value: "156360704"
    },
    {
      label: "长乐区",
      value: "156350112"
    },
    {
      label: "资兴市",
      value: "156431081"
    },
    {
      label: "马尾区",
      value: "156350105"
    },
    {
      label: "仓山区",
      value: "156350104"
    },
    {
      label: "台江区",
      value: "156350103"
    },
    {
      label: "桂东县",
      value: "156431027"
    },
    {
      label: "晋安区",
      value: "156350111"
    },
    {
      label: "鼓楼区",
      value: "156350102"
    },
    {
      label: "永兴县",
      value: "156431023"
    },
    {
      label: "闽侯县",
      value: "156350121"
    },
    {
      label: "尤溪县",
      value: "156350426"
    },
    {
      label: "清流县",
      value: "156350423"
    },
    {
      label: "连江县",
      value: "156350122"
    },
    {
      label: "闽清县",
      value: "156350124"
    },
    {
      label: "三元区",
      value: "156350403"
    },
    {
      label: "宁化县",
      value: "156350424"
    },
    {
      label: "梅列区",
      value: "156350402"
    },
    {
      label: "遂川县",
      value: "156360827"
    },
    {
      label: "石城县",
      value: "156360735"
    },
    {
      label: "兴国县",
      value: "156360732"
    },
    {
      label: "明溪县",
      value: "156350421"
    },
    {
      label: "沙县",
      value: "156350427"
    },
    {
      label: "耒阳市",
      value: "156430481"
    },
    {
      label: "万安县",
      value: "156360828"
    },
    {
      label: "宁都县",
      value: "156360730"
    },
    {
      label: "罗源县",
      value: "156350123"
    },
    {
      label: "炎陵县",
      value: "156430225"
    },
    {
      label: "古田县",
      value: "156350922"
    },
    {
      label: "延平区",
      value: "156350702"
    },
    {
      label: "蕉城区",
      value: "156350902"
    },
    {
      label: "安仁县",
      value: "156431028"
    },
    {
      label: "将乐县",
      value: "156350428"
    },
    {
      label: "衡南县",
      value: "156430422"
    },
    {
      label: "井冈山市",
      value: "156360881"
    },
    {
      label: "茶陵县",
      value: "156430224"
    },
    {
      label: "泰和县",
      value: "156360826"
    },
    {
      label: "顺昌县",
      value: "156350721"
    },
    {
      label: "建宁县",
      value: "156350430"
    },
    {
      label: "广昌县",
      value: "156361030"
    },
    {
      label: "霞浦县",
      value: "156350921"
    },
    {
      label: "雁峰区",
      value: "156430406"
    },
    {
      label: "珠晖区",
      value: "156430405"
    },
    {
      label: "泰宁县",
      value: "156350429"
    },
    {
      label: "屏南县",
      value: "156350923"
    },
    {
      label: "蒸湘区",
      value: "156430408"
    },
    {
      label: "石鼓区",
      value: "156430407"
    },
    {
      label: "永新县",
      value: "156360830"
    },
    {
      label: "攸县",
      value: "156430223"
    },
    {
      label: "建瓯市",
      value: "156350783"
    },
    {
      label: "吉安县",
      value: "156360821"
    },
    {
      label: "衡东县",
      value: "156430424"
    },
    {
      label: "青原区",
      value: "156360803"
    },
    {
      label: "福安市",
      value: "156350981"
    },
    {
      label: "周宁县",
      value: "156350925"
    },
    {
      label: "吉州区",
      value: "156360802"
    },
    {
      label: "莲花县",
      value: "156360321"
    },
    {
      label: "南丰县",
      value: "156361023"
    },
    {
      label: "吉水县",
      value: "156360822"
    },
    {
      label: "衡山县",
      value: "156430423"
    },
    {
      label: "南岳区",
      value: "156430412"
    },
    {
      label: "柘荣县",
      value: "156350926"
    },
    {
      label: "黎川县",
      value: "156361022"
    },
    {
      label: "永丰县",
      value: "156360825"
    },
    {
      label: "福鼎市",
      value: "156350982"
    },
    {
      label: "建阳区",
      value: "156350703"
    },
    {
      label: "邵武市",
      value: "156350781"
    },
    {
      label: "政和县",
      value: "156350725"
    },
    {
      label: "安福县",
      value: "156360829"
    },
    {
      label: "乐安县",
      value: "156361025"
    },
    {
      label: "寿宁县",
      value: "156350924"
    },
    {
      label: "苍南县",
      value: "156330327"
    },
    {
      label: "松溪县",
      value: "156350724"
    },
    {
      label: "光泽县",
      value: "156350723"
    },
    {
      label: "宜黄县",
      value: "156361026"
    },
    {
      label: "泰顺县",
      value: "156330329"
    },
    {
      label: "南城县",
      value: "156361021"
    },
    {
      label: "峡江县",
      value: "156360823"
    },
    {
      label: "安源区",
      value: "156360302"
    },
    {
      label: "庆元县",
      value: "156331126"
    },
    {
      label: "芦溪县",
      value: "156360323"
    },
    {
      label: "湘东区",
      value: "156360313"
    },
    {
      label: "醴陵市",
      value: "156430281"
    },
    {
      label: "渌口区",
      value: "156430212"
    },
    {
      label: "资溪县",
      value: "156361028"
    },
    {
      label: "湘乡市",
      value: "156430381"
    },
    {
      label: "新干县",
      value: "156360824"
    },
    {
      label: "武夷山市",
      value: "156350782"
    },
    {
      label: "崇仁县",
      value: "156361024"
    },
    {
      label: "湘潭县",
      value: "156430321"
    },
    {
      label: "芦淞区",
      value: "156430203"
    },
    {
      label: "文成县",
      value: "156330328"
    },
    {
      label: "袁州区",
      value: "156360902"
    },
    {
      label: "渝水区",
      value: "156360502"
    },
    {
      label: "分宜县",
      value: "156360521"
    },
    {
      label: "天元区",
      value: "156430211"
    },
    {
      label: "荷塘区",
      value: "156430202"
    },
    {
      label: "雨湖区",
      value: "156430302"
    },
    {
      label: "岳塘区",
      value: "156430304"
    },
    {
      label: "石峰区",
      value: "156430204"
    },
    {
      label: "上栗县",
      value: "156360322"
    },
    {
      label: "浦城县",
      value: "156350722"
    },
    {
      label: "金溪县",
      value: "156361027"
    },
    {
      label: "临川区",
      value: "156361002"
    },
    {
      label: "景宁畲族自治县",
      value: "156331127"
    },
    {
      label: "樟树市",
      value: "156360982"
    },
    {
      label: "龙泉市",
      value: "156331181"
    },
    {
      label: "万载县",
      value: "156360922"
    },
    {
      label: "天心区",
      value: "156430103"
    },
    {
      label: "云和县",
      value: "156331125"
    },
    {
      label: "雨花区",
      value: "156430111"
    },
    {
      label: "青田县",
      value: "156331121"
    },
    {
      label: "丰城市",
      value: "156360981"
    },
    {
      label: "浏阳市",
      value: "156430181"
    },
    {
      label: "芙蓉区",
      value: "156430102"
    },
    {
      label: "余江区",
      value: "156360603"
    },
    {
      label: "上高县",
      value: "156360923"
    },
    {
      label: "岳麓区",
      value: "156430104"
    },
    {
      label: "月湖区",
      value: "156360602"
    },
    {
      label: "长沙县",
      value: "156430121"
    },
    {
      label: "东乡区",
      value: "156361003"
    },
    {
      label: "开福区",
      value: "156430105"
    },
    {
      label: "宁乡市",
      value: "156430182"
    },
    {
      label: "贵溪市",
      value: "156360681"
    },
    {
      label: "铅山县",
      value: "156361124"
    },
    {
      label: "望城区",
      value: "156430112"
    },
    {
      label: "进贤县",
      value: "156360124"
    },
    {
      label: "弋阳县",
      value: "156361126"
    },
    {
      label: "宜丰县",
      value: "156360924"
    },
    {
      label: "横峰县",
      value: "156361125"
    },
    {
      label: "高安市",
      value: "156360983"
    },
    {
      label: "信州区",
      value: "156361102"
    },
    {
      label: "广丰区",
      value: "156361103"
    },
    {
      label: "莲都区",
      value: "156331102"
    },
    {
      label: "广信区",
      value: "156361104"
    },
    {
      label: "松阳县",
      value: "156331124"
    },
    {
      label: "铜鼓县",
      value: "156360926"
    },
    {
      label: "南昌县",
      value: "156360121"
    },
    {
      label: "遂昌县",
      value: "156331123"
    },
    {
      label: "青云谱区",
      value: "156360104"
    },
    {
      label: "西湖区",
      value: "156360103"
    },
    {
      label: "缙云县",
      value: "156331122"
    },
    {
      label: "玉山县",
      value: "156361123"
    },
    {
      label: "青山湖区",
      value: "156360111"
    },
    {
      label: "东湖区",
      value: "156360102"
    },
    {
      label: "奉新县",
      value: "156360921"
    },
    {
      label: "湘阴县",
      value: "156430624"
    },
    {
      label: "新建区",
      value: "156360112"
    },
    {
      label: "万年县",
      value: "156361129"
    },
    {
      label: "余干县",
      value: "156361127"
    },
    {
      label: "平江县",
      value: "156430626"
    },
    {
      label: "江山市",
      value: "156330881"
    },
    {
      label: "汨罗市",
      value: "156430681"
    },
    {
      label: "安义县",
      value: "156360123"
    },
    {
      label: "靖安县",
      value: "156360925"
    },
    {
      label: "永康市",
      value: "156330784"
    },
    {
      label: "武义县",
      value: "156330723"
    },
    {
      label: "常山县",
      value: "156330822"
    },
    {
      label: "德兴市",
      value: "156361181"
    },
    {
      label: "柯城区",
      value: "156330802"
    },
    {
      label: "乐平市",
      value: "156360281"
    },
    {
      label: "衢江区",
      value: "156330803"
    },
    {
      label: "鄱阳县",
      value: "156361128"
    },
    {
      label: "永修县",
      value: "156360425"
    },
    {
      label: "修水县",
      value: "156360424"
    },
    {
      label: "龙游县",
      value: "156330825"
    },
    {
      label: "磐安县",
      value: "156330727"
    },
    {
      label: "婺城区",
      value: "156330702"
    },
    {
      label: "金东区",
      value: "156330703"
    },
    {
      label: "开化县",
      value: "156330824"
    },
    {
      label: "岳阳县",
      value: "156430621"
    },
    {
      label: "兰溪市",
      value: "156330781"
    },
    {
      label: "通城县",
      value: "156421222"
    },
    {
      label: "婺源县",
      value: "156361130"
    },
    {
      label: "共青城市",
      value: "156360482"
    },
    {
      label: "武宁县",
      value: "156360423"
    },
    {
      label: "昌江区",
      value: "156360202"
    },
    {
      label: "都昌县",
      value: "156360428"
    },
    {
      label: "东阳市",
      value: "156330783"
    },
    {
      label: "珠山区",
      value: "156360203"
    },
    {
      label: "义乌市",
      value: "156330782"
    },
    {
      label: "德安县",
      value: "156360426"
    },
    {
      label: "浮梁县",
      value: "156360222"
    },
    {
      label: "岳阳楼区",
      value: "156430602"
    },
    {
      label: "庐山市",
      value: "156360427"
    },
    {
      label: "浦江县",
      value: "156330726"
    },
    {
      label: "君山区",
      value: "156430611"
    },
    {
      label: "云溪区",
      value: "156430603"
    },
    {
      label: "建德市",
      value: "156330182"
    },
    {
      label: "临湘市",
      value: "156430682"
    },
    {
      label: "华容县",
      value: "156430623"
    },
    {
      label: "崇阳县",
      value: "156421223"
    },
    {
      label: "通山县",
      value: "156421224"
    },
    {
      label: "淳安县",
      value: "156330127"
    },
    {
      label: "柴桑区",
      value: "156360404"
    },
    {
      label: "濂溪区",
      value: "156360402"
    },
    {
      label: "瑞昌市",
      value: "156360481"
    },
    {
      label: "屯溪区",
      value: "156341002"
    },
    {
      label: "诸暨市",
      value: "156330681"
    },
    {
      label: "赤壁市",
      value: "156421281"
    },
    {
      label: "浔阳区",
      value: "156360403"
    },
    {
      label: "湖口县",
      value: "156360429"
    },
    {
      label: "休宁县",
      value: "156341022"
    },
    {
      label: "桐庐县",
      value: "156330122"
    },
    {
      label: "洪湖市",
      value: "156421083"
    },
    {
      label: "徽州区",
      value: "156341004"
    },
    {
      label: "阳新县",
      value: "156420222"
    },
    {
      label: "监利市",
      value: "156421023"
    },
    {
      label: "武穴市",
      value: "156421182"
    },
    {
      label: "咸安区",
      value: "156421202"
    },
    {
      label: "祁门县",
      value: "156341024"
    },
    {
      label: "歙县",
      value: "156341021"
    },
    {
      label: "彭泽县",
      value: "156360430"
    },
    {
      label: "黟县",
      value: "156341023"
    },
    {
      label: "嘉鱼县",
      value: "156421221"
    },
    {
      label: "富阳区",
      value: "156330111"
    },
    {
      label: "绩溪县",
      value: "156341824"
    },
    {
      label: "黄梅县",
      value: "156421127"
    },
    {
      label: "柯桥区",
      value: "156330603"
    },
    {
      label: "大冶市",
      value: "156420281"
    },
    {
      label: "东至县",
      value: "156341721"
    },
    {
      label: "梁子湖区",
      value: "156420702"
    },
    {
      label: "望江县",
      value: "156340827"
    },
    {
      label: "宿松县",
      value: "156340826"
    },
    {
      label: "下陆区",
      value: "156420204"
    },
    {
      label: "萧山区",
      value: "156330109"
    },
    {
      label: "铁山区",
      value: "156420205"
    },
    {
      label: "西塞山区",
      value: "156420203"
    },
    {
      label: "滨江区",
      value: "156330108"
    },
    {
      label: "石台县",
      value: "156341722"
    },
    {
      label: "黄石港区",
      value: "156420202"
    },
    {
      label: "蕲春县",
      value: "156421126"
    },
    {
      label: "临安区",
      value: "156330112"
    },
    {
      label: "上城区",
      value: "156330102"
    },
    {
      label: "江干区",
      value: "156330104"
    },
    {
      label: "西湖区",
      value: "156330106"
    },
    {
      label: "黄山区",
      value: "156341003"
    },
    {
      label: "下城区",
      value: "156330103"
    },
    {
      label: "旌德县",
      value: "156341825"
    },
    {
      label: "汉南区",
      value: "156420113"
    },
    {
      label: "拱墅区",
      value: "156330105"
    },
    {
      label: "武胜县",
      value: "156511622"
    },
    {
      label: "荆州区",
      value: "156421003"
    },
    {
      label: "安居区",
      value: "156510904"
    },
    {
      label: "宜都市",
      value: "156420581"
    },
    {
      label: "华蓥市",
      value: "156511681"
    },
    {
      label: "简阳市",
      value: "156510185"
    },
    {
      label: "枝江市",
      value: "156420583"
    },
    {
      label: "长阳土家族自治县",
      value: "156420528"
    },
    {
      label: "广安区",
      value: "156511602"
    },
    {
      label: "船山区",
      value: "156510903"
    },
    {
      label: "猇亭区",
      value: "156420505"
    },
    {
      label: "岳池县",
      value: "156511621"
    },
    {
      label: "大英县",
      value: "156510923"
    },
    {
      label: "建始县",
      value: "156422822"
    },
    {
      label: "伍家岗区",
      value: "156420503"
    },
    {
      label: "梁平区",
      value: "156500155"
    },
    {
      label: "点军区",
      value: "156420504"
    },
    {
      label: "西陵区",
      value: "156420502"
    },
    {
      label: "大竹县",
      value: "156511724"
    },
    {
      label: "蓬溪县",
      value: "156510921"
    },
    {
      label: "嘉陵区",
      value: "156511304"
    },
    {
      label: "夷陵区",
      value: "156420506"
    },
    {
      label: "高坪区",
      value: "156511303"
    },
    {
      label: "顺庆区",
      value: "156511302"
    },
    {
      label: "万州区",
      value: "156500101"
    },
    {
      label: "当阳市",
      value: "156420582"
    },
    {
      label: "秭归县",
      value: "156420527"
    },
    {
      label: "渠县",
      value: "156511725"
    },
    {
      label: "射洪市",
      value: "156510981"
    },
    {
      label: "云阳县",
      value: "156500235"
    },
    {
      label: "掇刀区",
      value: "156420804"
    },
    {
      label: "西充县",
      value: "156511325"
    },
    {
      label: "奉节县",
      value: "156500236"
    },
    {
      label: "蓬安县",
      value: "156511323"
    },
    {
      label: "中江县",
      value: "156510623"
    },
    {
      label: "巴东县",
      value: "156422823"
    },
    {
      label: "东宝区",
      value: "156420802"
    },
    {
      label: "远安县",
      value: "156420525"
    },
    {
      label: "巫山县",
      value: "156500237"
    },
    {
      label: "营山县",
      value: "156511322"
    },
    {
      label: "开江县",
      value: "156511723"
    },
    {
      label: "三台县",
      value: "156510722"
    },
    {
      label: "开州区",
      value: "156500154"
    },
    {
      label: "达川区",
      value: "156511703"
    },
    {
      label: "盐亭县",
      value: "156510723"
    },
    {
      label: "通川区",
      value: "156511702"
    },
    {
      label: "仪陇县",
      value: "156511324"
    },
    {
      label: "兴山县",
      value: "156420526"
    },
    {
      label: "南部县",
      value: "156511321"
    },
    {
      label: "宣汉县",
      value: "156511722"
    },
    {
      label: "巫溪县",
      value: "156500238"
    },
    {
      label: "涪城区",
      value: "156510703"
    },
    {
      label: "游仙区",
      value: "156510704"
    },
    {
      label: "安州区",
      value: "156510705"
    },
    {
      label: "阆中市",
      value: "156511381"
    },
    {
      label: "平昌县",
      value: "156511923"
    },
    {
      label: "梓潼县",
      value: "156510725"
    },
    {
      label: "宜城市",
      value: "156420684"
    },
    {
      label: "苍溪县",
      value: "156510824"
    },
    {
      label: "神农架林区",
      value: "156429021"
    },
    {
      label: "江油市",
      value: "156510781"
    },
    {
      label: "南漳县",
      value: "156420624"
    },
    {
      label: "恩阳区",
      value: "156511903"
    },
    {
      label: "巴州区",
      value: "156511902"
    },
    {
      label: "保康县",
      value: "156420626"
    },
    {
      label: "镇坪县",
      value: "156610927"
    },
    {
      label: "通江县",
      value: "156511921"
    },
    {
      label: "城口县",
      value: "156500229"
    },
    {
      label: "襄城区",
      value: "156420602"
    },
    {
      label: "樊城区",
      value: "156420606"
    },
    {
      label: "房县",
      value: "156420325"
    },
    {
      label: "万源市",
      value: "156511781"
    },
    {
      label: "襄州区",
      value: "156420607"
    },
    {
      label: "竹山县",
      value: "156420323"
    },
    {
      label: "旺苍县",
      value: "156510821"
    },
    {
      label: "谷城县",
      value: "156420625"
    },
    {
      label: "剑阁县",
      value: "156510823"
    },
    {
      label: "岚皋县",
      value: "156610925"
    },
    {
      label: "竹溪县",
      value: "156420324"
    },
    {
      label: "昭化区",
      value: "156510811"
    },
    {
      label: "南江县",
      value: "156511922"
    },
    {
      label: "老河口市",
      value: "156420682"
    },
    {
      label: "平利县",
      value: "156610926"
    },
    {
      label: "利州区",
      value: "156510802"
    },
    {
      label: "紫阳县",
      value: "156610924"
    },
    {
      label: "新野县",
      value: "156411329"
    },
    {
      label: "镇巴县",
      value: "156610728"
    },
    {
      label: "丹江口市",
      value: "156420381"
    },
    {
      label: "青川县",
      value: "156510822"
    },
    {
      label: "茅箭区",
      value: "156420302"
    },
    {
      label: "朝天区",
      value: "156510812"
    },
    {
      label: "张湾区",
      value: "156420303"
    },
    {
      label: "邓州市",
      value: "156411381"
    },
    {
      label: "汉滨区",
      value: "156610902"
    },
    {
      label: "白河县",
      value: "156610929"
    },
    {
      label: "宁强县",
      value: "156610726"
    },
    {
      label: "旬阳县",
      value: "156610928"
    },
    {
      label: "郧阳区",
      value: "156420304"
    },
    {
      label: "汉阴县",
      value: "156610921"
    },
    {
      label: "文县",
      value: "156621222"
    },
    {
      label: "西乡县",
      value: "156610724"
    },
    {
      label: "郧西县",
      value: "156420322"
    },
    {
      label: "南郑区",
      value: "156610703"
    },
    {
      label: "镇平县",
      value: "156411324"
    },
    {
      label: "石泉县",
      value: "156610922"
    },
    {
      label: "内乡县",
      value: "156411325"
    },
    {
      label: "汉台区",
      value: "156610702"
    },
    {
      label: "淅川县",
      value: "156411326"
    },
    {
      label: "勉县",
      value: "156610725"
    },
    {
      label: "城固县",
      value: "156610722"
    },
    {
      label: "洋县",
      value: "156610723"
    },
    {
      label: "西峡县",
      value: "156411323"
    },
    {
      label: "宁陕县",
      value: "156610923"
    },
    {
      label: "略阳县",
      value: "156610727"
    },
    {
      label: "康县",
      value: "156621224"
    },
    {
      label: "武都区",
      value: "156621202"
    },
    {
      label: "镇安县",
      value: "156611025"
    },
    {
      label: "南召县",
      value: "156411321"
    },
    {
      label: "佛坪县",
      value: "156610730"
    },
    {
      label: "商南县",
      value: "156611023"
    },
    {
      label: "山阳县",
      value: "156611024"
    },
    {
      label: "留坝县",
      value: "156610729"
    },
    {
      label: "柞水县",
      value: "156611026"
    },
    {
      label: "丹凤县",
      value: "156611022"
    },
    {
      label: "成县",
      value: "156621221"
    },
    {
      label: "徽县",
      value: "156621227"
    },
    {
      label: "栾川县",
      value: "156410324"
    },
    {
      label: "商州区",
      value: "156611002"
    },
    {
      label: "两当县",
      value: "156621228"
    },
    {
      label: "凤县",
      value: "156610330"
    },
    {
      label: "西和县",
      value: "156621225"
    },
    {
      label: "卢氏县",
      value: "156411224"
    },
    {
      label: "太白县",
      value: "156610331"
    },
    {
      label: "洛南县",
      value: "156611021"
    },
    {
      label: "鄠邑区",
      value: "156610118"
    },
    {
      label: "嵩县",
      value: "156410325"
    },
    {
      label: "蓝田县",
      value: "156610122"
    },
    {
      label: "汝阳县",
      value: "156410326"
    },
    {
      label: "长安区",
      value: "156610116"
    },
    {
      label: "周至县",
      value: "156610124"
    },
    {
      label: "礼县",
      value: "156621226"
    },
    {
      label: "雁塔区",
      value: "156610113"
    },
    {
      label: "碑林区",
      value: "156610103"
    },
    {
      label: "武功县",
      value: "156610431"
    },
    {
      label: "新城区",
      value: "156610102"
    },
    {
      label: "莲湖区",
      value: "156610104"
    },
    {
      label: "杨陵区",
      value: "156610403"
    },
    {
      label: "灞桥区",
      value: "156610111"
    },
    {
      label: "眉县",
      value: "156610326"
    },
    {
      label: "未央区",
      value: "156610112"
    },
    {
      label: "兴平市",
      value: "156610481"
    },
    {
      label: "秦都区",
      value: "156610402"
    },
    {
      label: "陈仓区",
      value: "156610304"
    },
    {
      label: "渭城区",
      value: "156610404"
    },
    {
      label: "临潼区",
      value: "156610115"
    },
    {
      label: "渭滨区",
      value: "156610302"
    },
    {
      label: "扶风县",
      value: "156610324"
    },
    {
      label: "金台区",
      value: "156610303"
    },
    {
      label: "洛宁县",
      value: "156410328"
    },
    {
      label: "伊川县",
      value: "156410329"
    },
    {
      label: "岐山县",
      value: "156610323"
    },
    {
      label: "礼泉县",
      value: "156610425"
    },
    {
      label: "临渭区",
      value: "156610502"
    },
    {
      label: "宜阳县",
      value: "156410327"
    },
    {
      label: "灵宝市",
      value: "156411282"
    },
    {
      label: "凤翔县",
      value: "156610322"
    },
    {
      label: "泾阳县",
      value: "156610423"
    },
    {
      label: "乾县",
      value: "156610424"
    },
    {
      label: "高陵区",
      value: "156610117"
    },
    {
      label: "潼关县",
      value: "156610522"
    },
    {
      label: "华阴市",
      value: "156610582"
    },
    {
      label: "麦积区",
      value: "156620503"
    },
    {
      label: "秦州区",
      value: "156620502"
    },
    {
      label: "三原县",
      value: "156610422"
    },
    {
      label: "洛龙区",
      value: "156410311"
    },
    {
      label: "千阳县",
      value: "156610328"
    },
    {
      label: "涧西区",
      value: "156410305"
    },
    {
      label: "西工区",
      value: "156410303"
    },
    {
      label: "阎良区",
      value: "156610114"
    },
    {
      label: "麟游县",
      value: "156610329"
    },
    {
      label: "瀍河回族区",
      value: "156410304"
    },
    {
      label: "老城区",
      value: "156410302"
    },
    {
      label: "永寿县",
      value: "156610426"
    },
    {
      label: "芮城县",
      value: "156140830"
    },
    {
      label: "陕州区",
      value: "156411203"
    },
    {
      label: "武山县",
      value: "156620524"
    },
    {
      label: "新安县",
      value: "156410323"
    },
    {
      label: "甘谷县",
      value: "156620523"
    },
    {
      label: "义马市",
      value: "156411281"
    },
    {
      label: "清水县",
      value: "156620521"
    },
    {
      label: "富平县",
      value: "156610528"
    },
    {
      label: "渑池县",
      value: "156411221"
    },
    {
      label: "湖滨区",
      value: "156411202"
    },
    {
      label: "大荔县",
      value: "156610523"
    },
    {
      label: "淳化县",
      value: "156610430"
    },
    {
      label: "孟津县",
      value: "156410322"
    },
    {
      label: "平陆县",
      value: "156140829"
    },
    {
      label: "秦安县",
      value: "156620522"
    },
    {
      label: "永济市",
      value: "156140881"
    },
    {
      label: "陇县",
      value: "156610327"
    },
    {
      label: "耀州区",
      value: "156610204"
    },
    {
      label: "蒲城县",
      value: "156610526"
    },
    {
      label: "张家川回族自治县",
      value: "156620525"
    },
    {
      label: "陇西县",
      value: "156621122"
    },
    {
      label: "盐湖区",
      value: "156140802"
    },
    {
      label: "彬州市",
      value: "156610482"
    },
    {
      label: "灵台县",
      value: "156620822"
    },
    {
      label: "王益区",
      value: "156610202"
    },
    {
      label: "旬邑县",
      value: "156610429"
    },
    {
      label: "夏县",
      value: "156140828"
    },
    {
      label: "临猗县",
      value: "156140821"
    },
    {
      label: "仙桃市",
      value: "156429004"
    },
    {
      label: "江夏区",
      value: "156420115"
    },
    {
      label: "鄂城区",
      value: "156420704"
    },
    {
      label: "潜江市",
      value: "156429005"
    },
    {
      label: "余杭区",
      value: "156330110"
    },
    {
      label: "黄州区",
      value: "156421102"
    },
    {
      label: "浠水县",
      value: "156421125"
    },
    {
      label: "太湖县",
      value: "156340825"
    },
    {
      label: "洪山区",
      value: "156420111"
    },
    {
      label: "迎江区",
      value: "156340802"
    },
    {
      label: "大观区",
      value: "156340803"
    },
    {
      label: "华容区",
      value: "156420703"
    },
    {
      label: "德清县",
      value: "156330521"
    },
    {
      label: "武昌区",
      value: "156420106"
    },
    {
      label: "汉阳区",
      value: "156420105"
    },
    {
      label: "蔡甸区",
      value: "156420114"
    },
    {
      label: "硚口区",
      value: "156420104"
    },
    {
      label: "江岸区",
      value: "156420102"
    },
    {
      label: "江汉区",
      value: "156420103"
    },
    {
      label: "宜秀区",
      value: "156340811"
    },
    {
      label: "东西湖区",
      value: "156420112"
    },
    {
      label: "潜山市",
      value: "156340882"
    },
    {
      label: "宁国市",
      value: "156341881"
    },
    {
      label: "安吉县",
      value: "156330523"
    },
    {
      label: "青阳县",
      value: "156341723"
    },
    {
      label: "青山区",
      value: "156420107"
    },
    {
      label: "团风县",
      value: "156421121"
    },
    {
      label: "汉川市",
      value: "156420984"
    },
    {
      label: "天门市",
      value: "156429006"
    },
    {
      label: "泾县",
      value: "156341823"
    },
    {
      label: "贵池区",
      value: "156341702"
    },
    {
      label: "枞阳县",
      value: "156340722"
    },
    {
      label: "沙洋县",
      value: "156420822"
    },
    {
      label: "怀宁县",
      value: "156340822"
    },
    {
      label: "英山县",
      value: "156421124"
    },
    {
      label: "罗田县",
      value: "156421123"
    },
    {
      label: "新洲区",
      value: "156420117"
    },
    {
      label: "岳西县",
      value: "156340828"
    },
    {
      label: "南浔区",
      value: "156330503"
    },
    {
      label: "吴兴区",
      value: "156330502"
    },
    {
      label: "黄陂区",
      value: "156420116"
    },
    {
      label: "广德市",
      value: "156341882"
    },
    {
      label: "南陵县",
      value: "156340223"
    },
    {
      label: "孝南区",
      value: "156420902"
    },
    {
      label: "郊区",
      value: "156340711"
    },
    {
      label: "应城市",
      value: "156420981"
    },
    {
      label: "铜官区",
      value: "156340705"
    },
    {
      label: "宣州区",
      value: "156341802"
    },
    {
      label: "义安区",
      value: "156340706"
    },
    {
      label: "京山市",
      value: "156420882"
    },
    {
      label: "云梦县",
      value: "156420923"
    },
    {
      label: "长兴县",
      value: "156330522"
    },
    {
      label: "桐城市",
      value: "156340881"
    },
    {
      label: "繁昌区",
      value: "156340222"
    },
    {
      label: "郎溪县",
      value: "156341821"
    },
    {
      label: "湾沚区",
      value: "156340221"
    },
    {
      label: "钟祥市",
      value: "156420881"
    },
    {
      label: "麻城市",
      value: "156421181"
    },
    {
      label: "安陆市",
      value: "156420982"
    },
    {
      label: "庐江县",
      value: "156340124"
    },
    {
      label: "孝昌县",
      value: "156420921"
    },
    {
      label: "红安县",
      value: "156421122"
    },
    {
      label: "无为市",
      value: "156340281"
    },
    {
      label: "弋江区",
      value: "156340203"
    },
    {
      label: "高淳区",
      value: "156320118"
    },
    {
      label: "虎丘区",
      value: "156320505"
    },
    {
      label: "镜湖区",
      value: "156340202"
    },
    {
      label: "宜兴市",
      value: "156320282"
    },
    {
      label: "鸠江区",
      value: "156340207"
    },
    {
      label: "霍山县",
      value: "156341525"
    },
    {
      label: "溧阳市",
      value: "156320481"
    },
    {
      label: "舒城县",
      value: "156341523"
    },
    {
      label: "滨湖区",
      value: "156320211"
    },
    {
      label: "大悟县",
      value: "156420922"
    },
    {
      label: "梁溪区",
      value: "156320213"
    },
    {
      label: "当涂县",
      value: "156340521"
    },
    {
      label: "博望区",
      value: "156340506"
    },
    {
      label: "锡山区",
      value: "156320205"
    },
    {
      label: "广水市",
      value: "156421381"
    },
    {
      label: "巢湖市",
      value: "156340181"
    },
    {
      label: "新县",
      value: "156411523"
    },
    {
      label: "溧水区",
      value: "156320117"
    },
    {
      label: "惠山区",
      value: "156320206"
    },
    {
      label: "雨山区",
      value: "156340504"
    },
    {
      label: "花山区",
      value: "156340503"
    },
    {
      label: "武进区",
      value: "156320412"
    },
    {
      label: "肥西县",
      value: "156340123"
    },
    {
      label: "曾都区",
      value: "156421303"
    },
    {
      label: "金坛区",
      value: "156320413"
    },
    {
      label: "金寨县",
      value: "156341524"
    },
    {
      label: "含山县",
      value: "156340522"
    },
    {
      label: "裕安区",
      value: "156341503"
    },
    {
      label: "和县",
      value: "156340523"
    },
    {
      label: "金安区",
      value: "156341502"
    },
    {
      label: "天宁区",
      value: "156320402"
    },
    {
      label: "包河区",
      value: "156340111"
    },
    {
      label: "商城县",
      value: "156411524"
    },
    {
      label: "钟楼区",
      value: "156320404"
    },
    {
      label: "新北区",
      value: "156320411"
    },
    {
      label: "蜀山区",
      value: "156340104"
    },
    {
      label: "瑶海区",
      value: "156340102"
    },
    {
      label: "庐阳区",
      value: "156340103"
    },
    {
      label: "肥东县",
      value: "156340122"
    },
    {
      label: "江阴市",
      value: "156320281"
    },
    {
      label: "句容市",
      value: "156321183"
    },
    {
      label: "江宁区",
      value: "156320115"
    },
    {
      label: "靖江市",
      value: "156321282"
    },
    {
      label: "雨花台区",
      value: "156320114"
    },
    {
      label: "光山县",
      value: "156411522"
    },
    {
      label: "丹阳市",
      value: "156321181"
    },
    {
      label: "建邺区",
      value: "156320105"
    },
    {
      label: "秦淮区",
      value: "156320104"
    },
    {
      label: "玄武区",
      value: "156320102"
    },
    {
      label: "浦口区",
      value: "156320111"
    },
    {
      label: "鼓楼区",
      value: "156320106"
    },
    {
      label: "全椒县",
      value: "156341124"
    },
    {
      label: "栖霞区",
      value: "156320113"
    },
    {
      label: "平桥区",
      value: "156411503"
    },
    {
      label: "浉河区",
      value: "156411502"
    },
    {
      label: "枣阳市",
      value: "156420683"
    },
    {
      label: "潢川县",
      value: "156411526"
    },
    {
      label: "丹徒区",
      value: "156321112"
    },
    {
      label: "固始县",
      value: "156411525"
    },
    {
      label: "泰兴市",
      value: "156321283"
    },
    {
      label: "润州区",
      value: "156321111"
    },
    {
      label: "京口区",
      value: "156321102"
    },
    {
      label: "罗山县",
      value: "156411521"
    },
    {
      label: "扬中市",
      value: "156321182"
    },
    {
      label: "仪征市",
      value: "156321081"
    },
    {
      label: "琅琊区",
      value: "156341102"
    },
    {
      label: "南谯区",
      value: "156341102"
    },
    {
      label: "高港区",
      value: "156321203"
    },
    {
      label: "六合区",
      value: "156320116"
    },
    {
      label: "息县",
      value: "156411528"
    },
    {
      label: "霍邱县",
      value: "156341522"
    },
    {
      label: "邗江区",
      value: "156321003"
    },
    {
      label: "桐柏县",
      value: "156411330"
    },
    {
      label: "广陵区",
      value: "156321002"
    },
    {
      label: "江都区",
      value: "156321012"
    },
    {
      label: "来安县",
      value: "156341122"
    },
    {
      label: "淮滨县",
      value: "156411527"
    },
    {
      label: "长丰县",
      value: "156340121"
    },
    {
      label: "海陵区",
      value: "156321202"
    },
    {
      label: "姜堰区",
      value: "156321204"
    },
    {
      label: "定远县",
      value: "156341125"
    },
    {
      label: "海安市",
      value: "156320685"
    },
    {
      label: "寿县",
      value: "156340422"
    },
    {
      label: "谢家集区",
      value: "156340404"
    },
    {
      label: "正阳县",
      value: "156411724"
    },
    {
      label: "颍上县",
      value: "156341226"
    },
    {
      label: "大通区",
      value: "156340402"
    },
    {
      label: "八公山区",
      value: "156340405"
    },
    {
      label: "田家庵区",
      value: "156340403"
    },
    {
      label: "阜南县",
      value: "156341225"
    },
    {
      label: "唐河县",
      value: "156411328"
    },
    {
      label: "天长市",
      value: "156341181"
    },
    {
      label: "凤台县",
      value: "156340421"
    },
    {
      label: "泌阳县",
      value: "156411726"
    },
    {
      label: "新蔡县",
      value: "156411729"
    },
    {
      label: "潘集区",
      value: "156340406"
    },
    {
      label: "明光市",
      value: "156341182"
    },
    {
      label: "高邮市",
      value: "156321084"
    },
    {
      label: "确山县",
      value: "156411725"
    },
    {
      label: "凤阳县",
      value: "156341126"
    },
    {
      label: "东台市",
      value: "156320981"
    },
    {
      label: "颍州区",
      value: "156341202"
    },
    {
      label: "兴化市",
      value: "156321281"
    },
    {
      label: "颍东区",
      value: "156341203"
    },
    {
      label: "颍泉区",
      value: "156341204"
    },
    {
      label: "禹会区",
      value: "156340304"
    },
    {
      label: "龙子湖区",
      value: "156340302"
    },
    {
      label: "蚌山区",
      value: "156340303"
    },
    {
      label: "平舆县",
      value: "156411723"
    },
    {
      label: "淮上区",
      value: "156340311"
    },
    {
      label: "怀远县",
      value: "156340321"
    },
    {
      label: "驿城区",
      value: "156411702"
    },
    {
      label: "卧龙区",
      value: "156411303"
    },
    {
      label: "宛城区",
      value: "156411302"
    },
    {
      label: "汝南县",
      value: "156411727"
    },
    {
      label: "盱眙县",
      value: "156320830"
    },
    {
      label: "金湖县",
      value: "156320831"
    },
    {
      label: "社旗县",
      value: "156411327"
    },
    {
      label: "临泉县",
      value: "156341221"
    },
    {
      label: "利辛县",
      value: "156341623"
    },
    {
      label: "五河县",
      value: "156340322"
    },
    {
      label: "遂平县",
      value: "156411728"
    },
    {
      label: "太和县",
      value: "156341222"
    },
    {
      label: "大丰区",
      value: "156320904"
    },
    {
      label: "宝应县",
      value: "156321023"
    },
    {
      label: "方城县",
      value: "156411322"
    },
    {
      label: "界首市",
      value: "156341282"
    },
    {
      label: "上蔡县",
      value: "156411722"
    },
    {
      label: "蒙城县",
      value: "156341622"
    },
    {
      label: "舞钢市",
      value: "156410481"
    },
    {
      label: "洪泽区",
      value: "156320813"
    },
    {
      label: "固镇县",
      value: "156340323"
    },
    {
      label: "盐都区",
      value: "156320903"
    },
    {
      label: "西平县",
      value: "156411721"
    },
    {
      label: "亭湖区",
      value: "156320902"
    },
    {
      label: "沈丘县",
      value: "156411624"
    },
    {
      label: "舞阳县",
      value: "156411121"
    },
    {
      label: "泗洪县",
      value: "156321324"
    },
    {
      label: "建湖县",
      value: "156320925"
    },
    {
      label: "项城市",
      value: "156411681"
    },
    {
      label: "泗县",
      value: "156341324"
    },
    {
      label: "涡阳县",
      value: "156341621"
    },
    {
      label: "淮安区",
      value: "156320803"
    },
    {
      label: "灵璧县",
      value: "156341323"
    },
    {
      label: "商水县",
      value: "156411623"
    },
    {
      label: "清江浦区",
      value: "156320812"
    },
    {
      label: "源汇区",
      value: "156411102"
    },
    {
      label: "召陵区",
      value: "156411104"
    },
    {
      label: "郾城区",
      value: "156411103"
    },
    {
      label: "叶县",
      value: "156410422"
    },
    {
      label: "淮阴区",
      value: "156320804"
    },
    {
      label: "埇桥区",
      value: "156341302"
    },
    {
      label: "郸城县",
      value: "156411625"
    },
    {
      label: "川汇区",
      value: "156411602"
    },
    {
      label: "泗阳县",
      value: "156321323"
    },
    {
      label: "淮阳区",
      value: "156411603"
    },
    {
      label: "卫东区",
      value: "156410403"
    },
    {
      label: "湛河区",
      value: "156410402"
    },
    {
      label: "新华区",
      value: "156410402"
    },
    {
      label: "鲁山县",
      value: "156410423"
    },
    {
      label: "射阳县",
      value: "156320924"
    },
    {
      label: "阜宁县",
      value: "156320923"
    },
    {
      label: "西华县",
      value: "156411622"
    },
    {
      label: "涟水县",
      value: "156320826"
    },
    {
      label: "临颍县",
      value: "156411122"
    },
    {
      label: "襄城县",
      value: "156411025"
    },
    {
      label: "鹿邑县",
      value: "156411628"
    },
    {
      label: "宝丰县",
      value: "156410421"
    },
    {
      label: "谯城区",
      value: "156341602"
    },
    {
      label: "烈山区",
      value: "156340604"
    },
    {
      label: "石龙区",
      value: "156410404"
    },
    {
      label: "睢宁县",
      value: "156320324"
    },
    {
      label: "濉溪县",
      value: "156340621"
    },
    {
      label: "永城市",
      value: "156411481"
    },
    {
      label: "宿豫区",
      value: "156321311"
    },
    {
      label: "相山区",
      value: "156340603"
    },
    {
      label: "宿城区",
      value: "156321302"
    },
    {
      label: "郏县",
      value: "156410425"
    },
    {
      label: "滨海县",
      value: "156320922"
    },
    {
      label: "杜集区",
      value: "156340602"
    },
    {
      label: "魏都区",
      value: "156411002"
    },
    {
      label: "扶沟县",
      value: "156411621"
    },
    {
      label: "太康县",
      value: "156411627"
    },
    {
      label: "灌南县",
      value: "156320724"
    },
    {
      label: "柘城县",
      value: "156411424"
    },
    {
      label: "鄢陵县",
      value: "156411024"
    },
    {
      label: "沭阳县",
      value: "156321322"
    },
    {
      label: "建安区",
      value: "156411003"
    },
    {
      label: "禹州市",
      value: "156411081"
    },
    {
      label: "汝州市",
      value: "156410482"
    },
    {
      label: "铜山区",
      value: "156320312"
    },
    {
      label: "萧县",
      value: "156341322"
    },
    {
      label: "响水县",
      value: "156320921"
    },
    {
      label: "长葛市",
      value: "156411082"
    },
    {
      label: "夏邑县",
      value: "156411426"
    },
    {
      label: "泉山区",
      value: "156320311"
    },
    {
      label: "云龙区",
      value: "156320303"
    },
    {
      label: "灌云县",
      value: "156320723"
    },
    {
      label: "鼓楼区",
      value: "156320302"
    },
    {
      label: "邳州市",
      value: "156320382"
    },
    {
      label: "新沂市",
      value: "156320381"
    },
    {
      label: "睢阳区",
      value: "156411403"
    },
    {
      label: "新郑市",
      value: "156410184"
    },
    {
      label: "虞城县",
      value: "156411425"
    },
    {
      label: "尉氏县",
      value: "156410223"
    },
    {
      label: "砀山县",
      value: "156341321"
    },
    {
      label: "贾汪区",
      value: "156320305"
    },
    {
      label: "梁园区",
      value: "156411402"
    },
    {
      label: "睢县",
      value: "156411422"
    },
    {
      label: "登封市",
      value: "156410185"
    },
    {
      label: "宁陵县",
      value: "156411423"
    },
    {
      label: "通许县",
      value: "156410222"
    },
    {
      label: "新密市",
      value: "156410183"
    },
    {
      label: "东海县",
      value: "156320722"
    },
    {
      label: "杞县",
      value: "156410221"
    },
    {
      label: "台儿庄区",
      value: "156370405"
    },
    {
      label: "海州区",
      value: "156320706"
    },
    {
      label: "郯城县",
      value: "156371322"
    },
    {
      label: "民权县",
      value: "156411421"
    },
    {
      label: "丰县",
      value: "156320321"
    },
    {
      label: "中牟县",
      value: "156410122"
    },
    {
      label: "沛县",
      value: "156320322"
    },
    {
      label: "二七区",
      value: "156410103"
    },
    {
      label: "偃师市",
      value: "156410381"
    },
    {
      label: "巩义市",
      value: "156410181"
    },
    {
      label: "中原区",
      value: "156410102"
    },
    {
      label: "管城回族区",
      value: "156410104"
    },
    {
      label: "祥符区",
      value: "156410212"
    },
    {
      label: "连云区",
      value: "156320703"
    },
    {
      label: "峄城区",
      value: "156370404"
    },
    {
      label: "禹王台区",
      value: "156410205"
    },
    {
      label: "荥阳市",
      value: "156410182"
    },
    {
      label: "鼓楼区",
      value: "156410204"
    },
    {
      label: "单县",
      value: "156371722"
    },
    {
      label: "薛城区",
      value: "156370403"
    },
    {
      label: "顺河回族区",
      value: "156410203"
    },
    {
      label: "金水区",
      value: "156410105"
    },
    {
      label: "上街区",
      value: "156410106"
    },
    {
      label: "微山县",
      value: "156370826"
    },
    {
      label: "龙亭区",
      value: "156410202"
    },
    {
      label: "兰考县",
      value: "156410225"
    },
    {
      label: "曹县",
      value: "156371721"
    },
    {
      label: "赣榆区",
      value: "156320707"
    },
    {
      label: "兰陵县",
      value: "156371324"
    },
    {
      label: "市中区",
      value: "156370402"
    },
    {
      label: "惠济区",
      value: "156410108"
    },
    {
      label: "吉利区",
      value: "156410306"
    },
    {
      label: "孟州市",
      value: "156410883"
    },
    {
      label: "临沭县",
      value: "156371329"
    },
    {
      label: "温县",
      value: "156410825"
    },
    {
      label: "成武县",
      value: "156371723"
    },
    {
      label: "罗庄区",
      value: "156371311"
    },
    {
      label: "鱼台县",
      value: "156370827"
    },
    {
      label: "封丘县",
      value: "156410727"
    },
    {
      label: "兰山区",
      value: "156371302"
    },
    {
      label: "原阳县",
      value: "156410725"
    },
    {
      label: "金乡县",
      value: "156370828"
    },
    {
      label: "济源市",
      value: "156419001"
    },
    {
      label: "定陶区",
      value: "156371703"
    },
    {
      label: "河东区",
      value: "156371312"
    },
    {
      label: "沁阳市",
      value: "156410882"
    },
    {
      label: "武陟县",
      value: "156410823"
    },
    {
      label: "山亭区",
      value: "156370406"
    },
    {
      label: "滕州市",
      value: "156370481"
    },
    {
      label: "岚山区",
      value: "156371103"
    },
    {
      label: "延津县",
      value: "156410726"
    },
    {
      label: "平阳县",
      value: "156330326"
    },
    {
      label: "瑞安市",
      value: "156330381"
    },
    {
      label: "洞头区",
      value: "156330305"
    },
    {
      label: "龙湾区",
      value: "156330303"
    },
    {
      label: "瓯海区",
      value: "156330304"
    },
    {
      label: "鹿城区",
      value: "156330302"
    },
    {
      label: "乐清市",
      value: "156330382"
    },
    {
      label: "玉环市",
      value: "156331083"
    },
    {
      label: "永嘉县",
      value: "156330324"
    },
    {
      label: "温岭市",
      value: "156331081"
    },
    {
      label: "路桥区",
      value: "156331004"
    },
    {
      label: "黄岩区",
      value: "156331003"
    },
    {
      label: "椒江区",
      value: "156331002"
    },
    {
      label: "仙居县",
      value: "156331024"
    },
    {
      label: "临海市",
      value: "156331082"
    },
    {
      label: "三门县",
      value: "156331022"
    },
    {
      label: "天台县",
      value: "156331023"
    },
    {
      label: "宁海县",
      value: "156330226"
    },
    {
      label: "象山县",
      value: "156330225"
    },
    {
      label: "新昌县",
      value: "156330624"
    },
    {
      label: "嵊州市",
      value: "156330683"
    },
    {
      label: "奉化区",
      value: "156330213"
    },
    {
      label: "鄞州区",
      value: "156330212"
    },
    {
      label: "海曙区",
      value: "156330203"
    },
    {
      label: "江北区",
      value: "156330205"
    },
    {
      label: "北仑区",
      value: "156330206"
    },
    {
      label: "镇海区",
      value: "156330211"
    },
    {
      label: "普陀区",
      value: "156330903"
    },
    {
      label: "越城区",
      value: "156330602"
    },
    {
      label: "定海区",
      value: "156330902"
    },
    {
      label: "上虞区",
      value: "156330604"
    },
    {
      label: "余姚市",
      value: "156330281"
    },
    {
      label: "慈溪市",
      value: "156330282"
    },
    {
      label: "岱山县",
      value: "156330921"
    },
    {
      label: "海宁市",
      value: "156330481"
    },
    {
      label: "海盐县",
      value: "156330424"
    },
    {
      label: "桐乡市",
      value: "156330483"
    },
    {
      label: "平湖市",
      value: "156330482"
    },
    {
      label: "嵊泗县",
      value: "156330922"
    },
    {
      label: "金山区",
      value: "156310116"
    },
    {
      label: "南湖区",
      value: "156330402"
    },
    {
      label: "秀洲区",
      value: "156330411"
    },
    {
      label: "嘉善县",
      value: "156330421"
    },
    {
      label: "奉贤区",
      value: "156310120"
    },
    {
      label: "松江区",
      value: "156310117"
    },
    {
      label: "闵行区",
      value: "156310112"
    },
    {
      label: "吴江区",
      value: "156320509"
    },
    {
      label: "青浦区",
      value: "156310118"
    },
    {
      label: "徐汇区",
      value: "156310104"
    },
    {
      label: "长宁区",
      value: "156310105"
    },
    {
      label: "浦东新区",
      value: "156310115"
    },
    {
      label: "静安区",
      value: "156310106"
    },
    {
      label: "黄浦区",
      value: "156310101"
    },
    {
      label: "普陀区",
      value: "156310107"
    },
    {
      label: "杨浦区",
      value: "156310110"
    },
    {
      label: "吴中区",
      value: "156320506"
    },
    {
      label: "虹口区",
      value: "156310109"
    },
    {
      label: "姑苏区",
      value: "156320508"
    },
    {
      label: "相城区",
      value: "156320507"
    },
    {
      label: "嘉定区",
      value: "156310114"
    },
    {
      label: "昆山市",
      value: "156320583"
    },
    {
      label: "宝山区",
      value: "156310113"
    },
    {
      label: "太仓市",
      value: "156320585"
    },
    {
      label: "崇明区",
      value: "156310151"
    },
    {
      label: "常熟市",
      value: "156320581"
    },
    {
      label: "启东市",
      value: "156320681"
    },
    {
      label: "海门区",
      value: "156320684"
    },
    {
      label: "张家港市",
      value: "156320582"
    },
    {
      label: "崇川区",
      value: "156320602"
    },
    {
      label: "通州区",
      value: "156320612"
    },
    {
      label: "如东县",
      value: "156320623"
    },
    {
      label: "如皋市",
      value: "156320682"
    },
    {
      label: "夏河县",
      value: "156623027"
    },
    {
      label: "同德县",
      value: "156632522"
    },
    {
      label: "康乐县",
      value: "156622922"
    },
    {
      label: "临洮县",
      value: "156621124"
    },
    {
      label: "和政县",
      value: "156622925"
    },
    {
      label: "广河县",
      value: "156622924"
    },
    {
      label: "临夏县",
      value: "156622921"
    },
    {
      label: "同仁市",
      value: "156632301"
    },
    {
      label: "贵南县",
      value: "156632525"
    },
    {
      label: "兴海县",
      value: "156632524"
    },
    {
      label: "临夏市",
      value: "156622901"
    },
    {
      label: "东乡族自治县",
      value: "156622926"
    },
    {
      label: "积石山保安族东乡族撒拉族自治县",
      value: "156622927"
    },
    {
      label: "榆中县",
      value: "156620123"
    },
    {
      label: "循化撒拉族自治县",
      value: "156630225"
    },
    {
      label: "尖扎县",
      value: "156632322"
    },
    {
      label: "永靖县",
      value: "156622923"
    },
    {
      label: "贵德县",
      value: "156632523"
    },
    {
      label: "城关区",
      value: "156620102"
    },
    {
      label: "七里河区",
      value: "156620103"
    },
    {
      label: "西固区",
      value: "156620104"
    },
    {
      label: "化隆回族自治县",
      value: "156630224"
    },
    {
      label: "安宁区",
      value: "156620105"
    },
    {
      label: "共和县",
      value: "156632521"
    },
    {
      label: "都兰县",
      value: "156632822"
    },
    {
      label: "民和回族土族自治县",
      value: "156630222"
    },
    {
      label: "皋兰县",
      value: "156620122"
    },
    {
      label: "红古区",
      value: "156620111"
    },
    {
      label: "格尔木市",
      value: "156632801"
    },
    {
      label: "乐都区",
      value: "156630202"
    },
    {
      label: "平安区",
      value: "156630203"
    },
    {
      label: "湟中区",
      value: "156630106"
    },
    {
      label: "白银区",
      value: "156620402"
    },
    {
      label: "城东区",
      value: "156630102"
    },
    {
      label: "城中区",
      value: "156630103"
    },
    {
      label: "城西区",
      value: "156630104"
    },
    {
      label: "城北区",
      value: "156630105"
    },
    {
      label: "湟源县",
      value: "156630123"
    },
    {
      label: "永登县",
      value: "156620121"
    },
    {
      label: "互助土族自治县",
      value: "156630223"
    },
    {
      label: "于田县",
      value: "156653226"
    },
    {
      label: "海晏县",
      value: "156632223"
    },
    {
      label: "大通回族土族自治县",
      value: "156630121"
    },
    {
      label: "乌兰县",
      value: "156632821"
    },
    {
      label: "天祝藏族自治县",
      value: "156620623"
    },
    {
      label: "策勒县",
      value: "156653225"
    },
    {
      label: "民丰县",
      value: "156653227"
    },
    {
      label: "洛浦县",
      value: "156653224"
    },
    {
      label: "和田县",
      value: "156653201"
    },
    {
      label: "和田市",
      value: "156653201"
    },
    {
      label: "景泰县",
      value: "156620423"
    },
    {
      label: "墨玉县",
      value: "156653222"
    },
    {
      label: "天峻县",
      value: "156632823"
    },
    {
      label: "刚察县",
      value: "156632224"
    },
    {
      label: "德令哈市",
      value: "156632802"
    },
    {
      label: "门源回族自治县",
      value: "156632221"
    },
    {
      label: "古浪县",
      value: "156620622"
    },
    {
      label: "皮山县",
      value: "156653223"
    },
    {
      label: "塔什库尔干塔吉克自治县",
      value: "156653131"
    },
    {
      label: "叶城县",
      value: "156653126"
    },
    {
      label: "凉州区",
      value: "156620602"
    },
    {
      label: "且末县",
      value: "156652825"
    },
    {
      label: "祁连县",
      value: "156632222"
    },
    {
      label: "泽普县",
      value: "156653124"
    },
    {
      label: "永昌县",
      value: "156620321"
    },
    {
      label: "莎车县",
      value: "156653125"
    },
    {
      label: "民乐县",
      value: "156620722"
    },
    {
      label: "金川区",
      value: "156620302"
    },
    {
      label: "民勤县",
      value: "156620621"
    },
    {
      label: "山丹县",
      value: "156620725"
    },
    {
      label: "肃南裕固族自治县",
      value: "156620721"
    },
    {
      label: "麦盖提县",
      value: "156653127"
    },
    {
      label: "甘州区",
      value: "156620702"
    },
    {
      label: "英吉沙县",
      value: "156653123"
    },
    {
      label: "若羌县",
      value: "156652824"
    },
    {
      label: "阿克陶县",
      value: "156653022"
    },
    {
      label: "临泽县",
      value: "156620723"
    },
    {
      label: "阿拉善右旗",
      value: "156152922"
    },
    {
      label: "岳普湖县",
      value: "156653128"
    },
    {
      label: "疏附县",
      value: "156653121"
    },
    {
      label: "高台县",
      value: "156620724"
    },
    {
      label: "疏勒县",
      value: "156653122"
    },
    {
      label: "喀什市",
      value: "156653101"
    },
    {
      label: "伽师县",
      value: "156653129"
    },
    {
      label: "肃北蒙古族自治县",
      value: "156620923"
    },
    {
      label: "阿克塞哈萨克族自治县",
      value: "156620924"
    },
    {
      label: "阿图什市",
      value: "156653001"
    },
    {
      label: "乌恰县",
      value: "156653024"
    },
    {
      label: "肃州区",
      value: "156620902"
    },
    {
      label: "巴楚县",
      value: "156653130"
    },
    {
      label: "图木舒克市",
      value: "156659003"
    },
    {
      label: "金塔县",
      value: "156620921"
    },
    {
      label: "敦煌市",
      value: "156620982"
    },
    {
      label: "玉门市",
      value: "156620981"
    },
    {
      label: "柯坪县",
      value: "156652929"
    },
    {
      label: "瓜州县",
      value: "156620922"
    },
    {
      label: "阿拉尔市",
      value: "156659002"
    },
    {
      label: "阿瓦提县",
      value: "156652928"
    },
    {
      label: "阿合奇县",
      value: "156653023"
    },
    {
      label: "阿克苏市",
      value: "156652901"
    },
    {
      label: "乌什县",
      value: "156652927"
    },
    {
      label: "沙雅县",
      value: "156652924"
    },
    {
      label: "温宿县",
      value: "156652922"
    },
    {
      label: "尉犁县",
      value: "156652823"
    },
    {
      label: "新和县",
      value: "156652925"
    },
    {
      label: "库车市",
      value: "156652902"
    },
    {
      label: "库尔勒市",
      value: "156652801"
    },
    {
      label: "轮台县",
      value: "156652822"
    },
    {
      label: "拜城县",
      value: "156652926"
    },
    {
      label: "铁门关市",
      value: "156659006"
    },
    {
      label: "额济纳旗",
      value: "156152923"
    },
    {
      label: "博湖县",
      value: "156652829"
    },
    {
      label: "焉耆回族自治县",
      value: "156652826"
    },
    {
      label: "和硕县",
      value: "156652828"
    },
    {
      label: "和静县",
      value: "156652827"
    },
    {
      label: "托克逊县",
      value: "156650422"
    },
    {
      label: "伊州区",
      value: "156650502"
    },
    {
      label: "鄯善县",
      value: "156650421"
    },
    {
      label: "高昌区",
      value: "156650402"
    },
    {
      label: "昭苏县",
      value: "156654026"
    },
    {
      label: "特克斯县",
      value: "156654027"
    },
    {
      label: "伊吾县",
      value: "156650522"
    },
    {
      label: "达坂城区",
      value: "156650107"
    },
    {
      label: "新源县",
      value: "156654025"
    },
    {
      label: "乌鲁木齐县",
      value: "156650121"
    },
    {
      label: "巩留县",
      value: "156654024"
    },
    {
      label: "巴里坤哈萨克自治县",
      value: "156650521"
    },
    {
      label: "天山区",
      value: "156650102"
    },
    {
      label: "尼勒克县",
      value: "156654028"
    },
    {
      label: "沙依巴克区",
      value: "156650103"
    },
    {
      label: "水磨沟区",
      value: "156650105"
    },
    {
      label: "木垒哈萨克自治县",
      value: "156652328"
    },
    {
      label: "察布查尔锡伯自治县",
      value: "156654022"
    },
    {
      label: "新市区",
      value: "156650104"
    },
    {
      label: "头屯河区",
      value: "156650106"
    },
    {
      label: "伊宁市",
      value: "156654002"
    },
    {
      label: "米东区",
      value: "156650109"
    },
    {
      label: "伊宁县",
      value: "156654021"
    },
    {
      label: "吉木萨尔县",
      value: "156652327"
    },
    {
      label: "昌吉市",
      value: "156652301"
    },
    {
      label: "奇台县",
      value: "156652325"
    },
    {
      label: "霍城县",
      value: "156654023"
    },
    {
      label: "阜康市",
      value: "156652302"
    },
    {
      label: "五家渠市",
      value: "156659004"
    },
    {
      label: "呼图壁县",
      value: "156652323"
    },
    {
      label: "玛纳斯县",
      value: "156652324"
    },
    {
      label: "石河子市",
      value: "156659001"
    },
    {
      label: "沙湾县",
      value: "156654223"
    },
    {
      label: "独山子区",
      value: "156650202"
    },
    {
      label: "乌苏市",
      value: "156654202"
    },
    {
      label: "奎屯市",
      value: "156654003"
    },
    {
      label: "精河县",
      value: "156652722"
    },
    {
      label: "博乐市",
      value: "156652701"
    },
    {
      label: "双河市",
      value: "156659007"
    },
    {
      label: "温泉县",
      value: "156652723"
    },
    {
      label: "阿拉山口市",
      value: "156652702"
    },
    {
      label: "克拉玛依区",
      value: "156650203"
    },
    {
      label: "白碱滩区",
      value: "156650204"
    },
    {
      label: "托里县",
      value: "156654224"
    },
    {
      label: "乌尔禾区",
      value: "156650205"
    },
    {
      label: "裕民县",
      value: "156654225"
    },
    {
      label: "额敏县",
      value: "156654221"
    },
    {
      label: "青河县",
      value: "156654325"
    },
    {
      label: "塔城市",
      value: "156654201"
    },
    {
      label: "和布克赛尔蒙古自治县",
      value: "156654226"
    },
    {
      label: "富蕴县",
      value: "156654322"
    },
    {
      label: "福海县",
      value: "156654323"
    },
    {
      label: "北屯市",
      value: "156659005"
    },
    {
      label: "吉木乃县",
      value: "156654326"
    },
    {
      label: "布尔津县",
      value: "156654321"
    },
    {
      label: "阿勒泰市",
      value: "156654301"
    },
    {
      label: "哈巴河县",
      value: "156654324"
    },
    {
      label: "博爱县",
      value: "156410822"
    },
    {
      label: "莒南县",
      value: "156371327"
    },
    {
      label: "白水县",
      value: "156610527"
    },
    {
      label: "澄城县",
      value: "156610525"
    },
    {
      label: "新乡县",
      value: "156410721"
    },
    {
      label: "长垣市",
      value: "156410783"
    },
    {
      label: "庄浪县",
      value: "156620825"
    },
    {
      label: "长武县",
      value: "156610428"
    },
    {
      label: "通渭县",
      value: "156621121"
    },
    {
      label: "山阳区",
      value: "156410811"
    },
    {
      label: "华亭市",
      value: "156620881"
    },
    {
      label: "修武县",
      value: "156410821"
    },
    {
      label: "中站区",
      value: "156410803"
    },
    {
      label: "合阳县",
      value: "156610524"
    },
    {
      label: "解放区",
      value: "156410802"
    },
    {
      label: "牡丹区",
      value: "156371702"
    },
    {
      label: "马村区",
      value: "156410804"
    },
    {
      label: "获嘉县",
      value: "156410724"
    },
    {
      label: "费县",
      value: "156371325"
    },
    {
      label: "东明县",
      value: "156371728"
    },
    {
      label: "垣曲县",
      value: "156140827"
    },
    {
      label: "卫滨区",
      value: "156410703"
    },
    {
      label: "崇信县",
      value: "156620823"
    },
    {
      label: "红旗区",
      value: "156410702"
    },
    {
      label: "牧野区",
      value: "156410711"
    },
    {
      label: "泾川县",
      value: "156620821"
    },
    {
      label: "闻喜县",
      value: "156140823"
    },
    {
      label: "凤泉区",
      value: "156410704"
    },
    {
      label: "巨野县",
      value: "156371724"
    },
    {
      label: "卫辉市",
      value: "156410781"
    },
    {
      label: "宜君县",
      value: "156610222"
    },
    {
      label: "邹城市",
      value: "156370883"
    },
    {
      label: "任城区",
      value: "156370811"
    },
    {
      label: "嘉祥县",
      value: "156370829"
    },
    {
      label: "万荣县",
      value: "156140822"
    },
    {
      label: "东港区",
      value: "156371102"
    },
    {
      label: "辉县市",
      value: "156410782"
    },
    {
      label: "韩城市",
      value: "156610581"
    },
    {
      label: "阳城县",
      value: "156140522"
    },
    {
      label: "绛县",
      value: "156140826"
    },
    {
      label: "正宁县",
      value: "156621025"
    },
    {
      label: "泾源县",
      value: "156640424"
    },
    {
      label: "城区",
      value: "156140502"
    },
    {
      label: "宁县",
      value: "156621026"
    },
    {
      label: "泽州县",
      value: "156140502"
    },
    {
      label: "平邑县",
      value: "156371326"
    },
    {
      label: "静宁县",
      value: "156620826"
    },
    {
      label: "崆峒区",
      value: "156620802"
    },
    {
      label: "沂南县",
      value: "156371321"
    },
    {
      label: "兖州区",
      value: "156370812"
    },
    {
      label: "鄄城县",
      value: "156371726"
    },
    {
      label: "滑县",
      value: "156410526"
    },
    {
      label: "黄陵县",
      value: "156610632"
    },
    {
      label: "莒县",
      value: "156371122"
    },
    {
      label: "曲阜市",
      value: "156370881"
    },
    {
      label: "安定区",
      value: "156621102"
    },
    {
      label: "黄龙县",
      value: "156610631"
    },
    {
      label: "河津市",
      value: "156140882"
    },
    {
      label: "郓城县",
      value: "156371725"
    },
    {
      label: "稷山县",
      value: "156140824"
    },
    {
      label: "淇县",
      value: "156410622"
    },
    {
      label: "新绛县",
      value: "156140825"
    },
    {
      label: "侯马市",
      value: "156141081"
    },
    {
      label: "隆德县",
      value: "156640423"
    },
    {
      label: "曲沃县",
      value: "156141021"
    },
    {
      label: "泗水县",
      value: "156370831"
    },
    {
      label: "浚县",
      value: "156410621"
    },
    {
      label: "镇原县",
      value: "156621027"
    },
    {
      label: "沁水县",
      value: "156140521"
    },
    {
      label: "会宁县",
      value: "156620422"
    },
    {
      label: "蒙阴县",
      value: "156371328"
    },
    {
      label: "濮阳县",
      value: "156410928"
    },
    {
      label: "西峰区",
      value: "156621002"
    },
    {
      label: "汶上县",
      value: "156370830"
    },
    {
      label: "翼城县",
      value: "156141022"
    },
    {
      label: "淇滨区",
      value: "156410611"
    },
    {
      label: "五莲县",
      value: "156371121"
    },
    {
      label: "宁阳县",
      value: "156370921"
    },
    {
      label: "洛川县",
      value: "156610629"
    },
    {
      label: "陵川县",
      value: "156140524"
    },
    {
      label: "华龙区",
      value: "156410902"
    },
    {
      label: "沂水县",
      value: "156371323"
    },
    {
      label: "高平市",
      value: "156140581"
    },
    {
      label: "梁山县",
      value: "156370832"
    },
    {
      label: "合水县",
      value: "156621024"
    },
    {
      label: "彭阳县",
      value: "156640425"
    },
    {
      label: "范县",
      value: "156410926"
    },
    {
      label: "襄汾县",
      value: "156141023"
    },
    {
      label: "清丰县",
      value: "156410922"
    },
    {
      label: "山城区",
      value: "156410603"
    },
    {
      label: "新泰市",
      value: "156370982"
    },
    {
      label: "汤阴县",
      value: "156410523"
    },
    {
      label: "东平县",
      value: "156370923"
    },
    {
      label: "内黄县",
      value: "156410527"
    },
    {
      label: "鹤山区",
      value: "156410602"
    },
    {
      label: "黄岛区",
      value: "156370211"
    },
    {
      label: "西吉县",
      value: "156640422"
    },
    {
      label: "浮山县",
      value: "156141027"
    },
    {
      label: "台前县",
      value: "156410927"
    },
    {
      label: "乡宁县",
      value: "156141029"
    },
    {
      label: "富县",
      value: "156610628"
    },
    {
      label: "诸城市",
      value: "156370782"
    },
    {
      label: "原州区",
      value: "156640402"
    },
    {
      label: "庆城县",
      value: "156621021"
    },
    {
      label: "宜川县",
      value: "156610630"
    },
    {
      label: "上党区",
      value: "156140404"
    },
    {
      label: "钢城区",
      value: "156370117"
    },
    {
      label: "南乐县",
      value: "156410923"
    },
    {
      label: "市南区",
      value: "156370202"
    },
    {
      label: "龙安区",
      value: "156410506"
    },
    {
      label: "林州市",
      value: "156410581"
    },
    {
      label: "尧都区",
      value: "156141002"
    },
    {
      label: "市北区",
      value: "156370203"
    },
    {
      label: "文峰区",
      value: "156410502"
    },
    {
      label: "吉县",
      value: "156141028"
    },
    {
      label: "安阳县",
      value: "156410522"
    },
    {
      label: "北关区",
      value: "156410503"
    },
    {
      label: "崂山区",
      value: "156370212"
    },
    {
      label: "殷都区",
      value: "156410505"
    },
    {
      label: "阳谷县",
      value: "156371521"
    },
    {
      label: "壶关县",
      value: "156140427"
    },
    {
      label: "长子县",
      value: "156140428"
    },
    {
      label: "李沧区",
      value: "156370213"
    },
    {
      label: "安泽县",
      value: "156141026"
    },
    {
      label: "九龙镇",
      value: "156370281"
    },
    {
      label: "肥城市",
      value: "156370983"
    },
    {
      label: "沂源县",
      value: "156370323"
    },
    {
      label: "岱岳区",
      value: "156370911"
    },
    {
      label: "泰山区",
      value: "156370902"
    },
    {
      label: "平顺县",
      value: "156140425"
    },
    {
      label: "莱芜区",
      value: "156370116"
    },
    {
      label: "潞州区",
      value: "156140403"
    },
    {
      label: "莘县",
      value: "156371522"
    },
    {
      label: "洪洞县",
      value: "156141024"
    },
    {
      label: "胶州市",
      value: "156370281"
    },
    {
      label: "古县",
      value: "156141025"
    },
    {
      label: "甘泉县",
      value: "156610627"
    },
    {
      label: "大名县",
      value: "156130425"
    },
    {
      label: "平阴县",
      value: "156370124"
    },
    {
      label: "城阳区",
      value: "156370214"
    },
    {
      label: "屯留区",
      value: "156140405"
    },
    {
      label: "潞城区",
      value: "156140406"
    },
    {
      label: "临漳县",
      value: "156130423"
    },
    {
      label: "东阿县",
      value: "156371524"
    },
    {
      label: "魏县",
      value: "156130434"
    },
    {
      label: "磁县",
      value: "156130427"
    },
    {
      label: "高密市",
      value: "156370785"
    },
    {
      label: "即墨区",
      value: "156370215"
    },
    {
      label: "蒲县",
      value: "156141033"
    },
    {
      label: "峰峰矿区",
      value: "156130406"
    },
    {
      label: "东昌府区",
      value: "156371502"
    },
    {
      label: "成安县",
      value: "156130424"
    },
    {
      label: "华池县",
      value: "156621023"
    },
    {
      label: "大宁县",
      value: "156141030"
    },
    {
      label: "安丘市",
      value: "156370784"
    },
    {
      label: "冠县",
      value: "156371525"
    },
    {
      label: "广平县",
      value: "156130432"
    },
    {
      label: "博山区",
      value: "156370304"
    },
    {
      label: "沁源县",
      value: "156140431"
    },
    {
      label: "邯山区",
      value: "156130402"
    },
    {
      label: "黎城县",
      value: "156140426"
    },
    {
      label: "临朐县",
      value: "156370724"
    },
    {
      label: "馆陶县",
      value: "156130433"
    },
    {
      label: "襄垣县",
      value: "156140423"
    },
    {
      label: "肥乡区",
      value: "156130407"
    },
    {
      label: "长清区",
      value: "156370113"
    },
    {
      label: "靖远县",
      value: "156620421"
    },
    {
      label: "海原县",
      value: "156640522"
    },
    {
      label: "环县",
      value: "156621022"
    },
    {
      label: "霍州市",
      value: "156141082"
    },
    {
      label: "延长县",
      value: "156610621"
    },
    {
      label: "茌平区",
      value: "156371503"
    },
    {
      label: "涉县",
      value: "156130426"
    },
    {
      label: "宝塔区",
      value: "156610602"
    },
    {
      label: "复兴区",
      value: "156130404"
    },
    {
      label: "丛台区",
      value: "156130403"
    },
    {
      label: "淄川区",
      value: "156370302"
    },
    {
      label: "市中区",
      value: "156370103"
    },
    {
      label: "槐荫区",
      value: "156370104"
    },
    {
      label: "汾西县",
      value: "156141034"
    },
    {
      label: "坊子区",
      value: "156370704"
    },
    {
      label: "历下区",
      value: "156370102"
    },
    {
      label: "天桥区",
      value: "156370105"
    },
    {
      label: "历城区",
      value: "156370112"
    },
    {
      label: "青州市",
      value: "156370781"
    },
    {
      label: "海阳市",
      value: "156370687"
    },
    {
      label: "隰县",
      value: "156141031"
    },
    {
      label: "武安市",
      value: "156130481"
    },
    {
      label: "昌乐县",
      value: "156370725"
    },
    {
      label: "奎文区",
      value: "156370705"
    },
    {
      label: "章丘区",
      value: "156370114"
    },
    {
      label: "平川区",
      value: "156620403"
    },
    {
      label: "潍城区",
      value: "156370702"
    },
    {
      label: "沁县",
      value: "156140430"
    },
    {
      label: "永和县",
      value: "156141032"
    },
    {
      label: "寒亭区",
      value: "156370703"
    },
    {
      label: "平度市",
      value: "156370283"
    },
    {
      label: "永年区",
      value: "156130408"
    },
    {
      label: "曲周县",
      value: "156130435"
    },
    {
      label: "齐河县",
      value: "156371425"
    },
    {
      label: "周村区",
      value: "156370306"
    },
    {
      label: "张店区",
      value: "156370303"
    },
    {
      label: "邱县",
      value: "156130430"
    },
    {
      label: "志丹县",
      value: "156610625"
    },
    {
      label: "临淄区",
      value: "156370305"
    },
    {
      label: "武乡县",
      value: "156140429"
    },
    {
      label: "临清市",
      value: "156371581"
    },
    {
      label: "灵石县",
      value: "156140729"
    },
    {
      label: "沙河市",
      value: "156130582"
    },
    {
      label: "寿光市",
      value: "156370783"
    },
    {
      label: "昌邑市",
      value: "156370786"
    },
    {
      label: "邹平市",
      value: "156371681"
    },
    {
      label: "安塞区",
      value: "156610603"
    },
    {
      label: "高唐县",
      value: "156371526"
    },
    {
      label: "临西县",
      value: "156130535"
    },
    {
      label: "延川县",
      value: "156610622"
    },
    {
      label: "莱西市",
      value: "156370285"
    },
    {
      label: "鸡泽县",
      value: "156130431"
    },
    {
      label: "乳山市",
      value: "156371083"
    },
    {
      label: "吴起县",
      value: "156610626"
    },
    {
      label: "禹城市",
      value: "156371482"
    },
    {
      label: "夏津县",
      value: "156371427"
    },
    {
      label: "桓台县",
      value: "156370321"
    },
    {
      label: "威县",
      value: "156130533"
    },
    {
      label: "济阳区",
      value: "156370115"
    },
    {
      label: "莱阳市",
      value: "156370682"
    },
    {
      label: "同心县",
      value: "156640324"
    },
    {
      label: "交口县",
      value: "156141130"
    },
    {
      label: "石楼县",
      value: "156141126"
    },
    {
      label: "南和区",
      value: "156130506"
    },
    {
      label: "介休市",
      value: "156140781"
    },
    {
      label: "广饶县",
      value: "156370523"
    },
    {
      label: "信都区",
      value: "156130503"
    },
    {
      label: "平乡县",
      value: "156130532"
    },
    {
      label: "襄都区",
      value: "156130502"
    },
    {
      label: "榆社县",
      value: "156140721"
    },
    {
      label: "清河县",
      value: "156130534"
    },
    {
      label: "广宗县",
      value: "156130531"
    },
    {
      label: "左权县",
      value: "156140722"
    },
    {
      label: "清涧县",
      value: "156610830"
    },
    {
      label: "任泽区",
      value: "156130505"
    },
    {
      label: "子长市",
      value: "156610681"
    },
    {
      label: "孝义市",
      value: "156141181"
    },
    {
      label: "博兴县",
      value: "156371625"
    },
    {
      label: "荣成市",
      value: "156371082"
    },
    {
      label: "平原县",
      value: "156371426"
    },
    {
      label: "高青县",
      value: "156370322"
    },
    {
      label: "莱州市",
      value: "156370683"
    },
    {
      label: "平遥县",
      value: "156140728"
    },
    {
      label: "临邑县",
      value: "156371424"
    },
    {
      label: "文登区",
      value: "156371003"
    },
    {
      label: "武城县",
      value: "156371428"
    },
    {
      label: "巨鹿县",
      value: "156130529"
    },
    {
      label: "汾阳市",
      value: "156141182"
    },
    {
      label: "内丘县",
      value: "156130523"
    },
    {
      label: "商河县",
      value: "156370126"
    },
    {
      label: "和顺县",
      value: "156140723"
    },
    {
      label: "栖霞市",
      value: "156370686"
    },
    {
      label: "陵城区",
      value: "156371403"
    },
    {
      label: "故城县",
      value: "156131126"
    },
    {
      label: "隆尧县",
      value: "156130525"
    },
    {
      label: "招远市",
      value: "156370685"
    },
    {
      label: "中阳县",
      value: "156141129"
    },
    {
      label: "祁县",
      value: "156140727"
    },
    {
      label: "南宫市",
      value: "156130581"
    },
    {
      label: "牟平区",
      value: "156370612"
    },
    {
      label: "太谷区",
      value: "156140703"
    },
    {
      label: "红寺堡区",
      value: "156640303"
    },
    {
      label: "柳林县",
      value: "156141125"
    },
    {
      label: "滨城区",
      value: "156371602"
    },
    {
      label: "文水县",
      value: "156141121"
    },
    {
      label: "临城县",
      value: "156130522"
    },
    {
      label: "东营区",
      value: "156370502"
    },
    {
      label: "德城区",
      value: "156371402"
    },
    {
      label: "吴堡县",
      value: "156610829"
    },
    {
      label: "柏乡县",
      value: "156130524"
    },
    {
      label: "惠民县",
      value: "156371621"
    },
    {
      label: "利津县",
      value: "156370522"
    },
    {
      label: "中宁县",
      value: "156640521"
    },
    {
      label: "福山区",
      value: "156370611"
    },
    {
      label: "环翠区",
      value: "156371002"
    },
    {
      label: "绥德县",
      value: "156610826"
    },
    {
      label: "莱山区",
      value: "156370613"
    },
    {
      label: "枣强县",
      value: "156131121"
    },
    {
      label: "沙坡头区",
      value: "156640502"
    },
    {
      label: "离石区",
      value: "156141102"
    },
    {
      label: "新河县",
      value: "156130530"
    },
    {
      label: "芝罘区",
      value: "156370602"
    },
    {
      label: "冀州区",
      value: "156131103"
    },
    {
      label: "交城县",
      value: "156141122"
    },
    {
      label: "垦利区",
      value: "156370505"
    },
    {
      label: "定边县",
      value: "156610825"
    },
    {
      label: "靖边县",
      value: "156610824"
    },
    {
      label: "清徐县",
      value: "156140121"
    },
    {
      label: "子洲县",
      value: "156610831"
    },
    {
      label: "昔阳县",
      value: "156140724"
    },
    {
      label: "高邑县",
      value: "156130127"
    },
    {
      label: "宁晋县",
      value: "156130528"
    },
    {
      label: "吴桥县",
      value: "156130928"
    },
    {
      label: "阳信县",
      value: "156371622"
    },
    {
      label: "龙口市",
      value: "156370681"
    },
    {
      label: "宁津县",
      value: "156371422"
    },
    {
      label: "赞皇县",
      value: "156130129"
    },
    {
      label: "景县",
      value: "156131127"
    },
    {
      label: "沾化区",
      value: "156371603"
    },
    {
      label: "榆次区",
      value: "156140702"
    },
    {
      label: "晋源区",
      value: "156140110"
    },
    {
      label: "乐陵市",
      value: "156371481"
    },
    {
      label: "桃城区",
      value: "156131102"
    },
    {
      label: "小店区",
      value: "156140105"
    },
    {
      label: "米脂县",
      value: "156610827"
    },
    {
      label: "赵县",
      value: "156130133"
    },
    {
      label: "元氏县",
      value: "156130132"
    },
    {
      label: "无棣县",
      value: "156371623"
    },
    {
      label: "庆云县",
      value: "156371423"
    },
    {
      label: "盐池县",
      value: "156640323"
    },
    {
      label: "平定县",
      value: "156140321"
    },
    {
      label: "武邑县",
      value: "156131122"
    },
    {
      label: "蓬莱区",
      value: "156370684"
    },
    {
      label: "城区",
      value: "156140302"
    },
    {
      label: "万柏林区",
      value: "156140109"
    },
    {
      label: "迎泽区",
      value: "156140106"
    },
    {
      label: "矿区",
      value: "156140303"
    },
    {
      label: "阜城县",
      value: "156131128"
    },
    {
      label: "河口区",
      value: "156370503"
    },
    {
      label: "东光县",
      value: "156130923"
    },
    {
      label: "杏花岭区",
      value: "156140107"
    },
    {
      label: "方山县",
      value: "156141128"
    },
    {
      label: "寿阳县",
      value: "156140725"
    },
    {
      label: "栾城区",
      value: "156130111"
    },
    {
      label: "古交市",
      value: "156140181"
    },
    {
      label: "尖草坪区",
      value: "156140108"
    },
    {
      label: "辛集市",
      value: "156130181"
    },
    {
      label: "郊区",
      value: "156140311"
    },
    {
      label: "临县",
      value: "156141124"
    },
    {
      label: "横山区",
      value: "156610803"
    },
    {
      label: "利通区",
      value: "156640302"
    },
    {
      label: "深州市",
      value: "156131182"
    },
    {
      label: "桥西区",
      value: "156130104"
    },
    {
      label: "裕华区",
      value: "156130108"
    },
    {
      label: "佳县",
      value: "156610828"
    },
    {
      label: "青铜峡市",
      value: "156640381"
    },
    {
      label: "藁城区",
      value: "156130109"
    },
    {
      label: "井陉县",
      value: "156130121"
    },
    {
      label: "晋州市",
      value: "156130183"
    },
    {
      label: "长安区",
      value: "156130102"
    },
    {
      label: "南皮县",
      value: "156130927"
    },
    {
      label: "武强县",
      value: "156131123"
    },
    {
      label: "新华区",
      value: "156130105"
    },
    {
      label: "孟村回族自治县",
      value: "156130930"
    },
    {
      label: "盐山县",
      value: "156130925"
    },
    {
      label: "阳曲县",
      value: "156140122"
    },
    {
      label: "井陉矿区",
      value: "156130107"
    },
    {
      label: "娄烦县",
      value: "156140123"
    },
    {
      label: "泊头市",
      value: "156130981"
    },
    {
      label: "盂县",
      value: "156140322"
    },
    {
      label: "鹿泉区",
      value: "156130110"
    },
    {
      label: "灵武市",
      value: "156640181"
    },
    {
      label: "海兴县",
      value: "156130924"
    },
    {
      label: "正定县",
      value: "156130123"
    },
    {
      label: "无极县",
      value: "156130130"
    },
    {
      label: "鄂托克前旗",
      value: "156150623"
    },
    {
      label: "深泽县",
      value: "156130128"
    },
    {
      label: "献县",
      value: "156130929"
    },
    {
      label: "安平县",
      value: "156131125"
    },
    {
      label: "饶阳县",
      value: "156131124"
    },
    {
      label: "平山县",
      value: "156130131"
    },
    {
      label: "榆阳区",
      value: "156610802"
    },
    {
      label: "永宁县",
      value: "156640121"
    },
    {
      label: "岚县",
      value: "156141127"
    },
    {
      label: "沧县",
      value: "156130921"
    },
    {
      label: "灵寿县",
      value: "156130126"
    },
    {
      label: "运河区",
      value: "156130903"
    },
    {
      label: "新华区",
      value: "156130902"
    },
    {
      label: "新乐市",
      value: "156130184"
    },
    {
      label: "静乐县",
      value: "156140926"
    },
    {
      label: "黄骅市",
      value: "156130983"
    },
    {
      label: "忻府区",
      value: "156140902"
    },
    {
      label: "安国市",
      value: "156130683"
    },
    {
      label: "肃宁县",
      value: "156130926"
    },
    {
      label: "行唐县",
      value: "156130125"
    },
    {
      label: "河间市",
      value: "156130984"
    },
    {
      label: "博野县",
      value: "156130637"
    },
    {
      label: "兴县",
      value: "156141123"
    },
    {
      label: "金凤区",
      value: "156640106"
    },
    {
      label: "定襄县",
      value: "156140921"
    },
    {
      label: "兴庆区",
      value: "156640104"
    },
    {
      label: "蠡县",
      value: "156130635"
    },
    {
      label: "西夏区",
      value: "156640105"
    },
    {
      label: "定州市",
      value: "156130682"
    },
    {
      label: "贺兰县",
      value: "156640122"
    },
    {
      label: "青县",
      value: "156130922"
    },
    {
      label: "乌审旗",
      value: "156150626"
    },
    {
      label: "曲阳县",
      value: "156130634"
    },
    {
      label: "高阳县",
      value: "156130628"
    },
    {
      label: "岢岚县",
      value: "156140929"
    },
    {
      label: "大城县",
      value: "156131025"
    },
    {
      label: "望都县",
      value: "156130631"
    },
    {
      label: "任丘市",
      value: "156130982"
    },
    {
      label: "五台县",
      value: "156140922"
    },
    {
      label: "原平市",
      value: "156140981"
    },
    {
      label: "唐县",
      value: "156130627"
    },
    {
      label: "清苑区",
      value: "156130608"
    },
    {
      label: "阿拉善左旗",
      value: "156152921"
    },
    {
      label: "顺平县",
      value: "156130636"
    },
    {
      label: "神木市",
      value: "156610881"
    },
    {
      label: "阜平县",
      value: "156130624"
    },
    {
      label: "旅顺口区",
      value: "156210212"
    },
    {
      label: "文安县",
      value: "156131026"
    },
    {
      label: "竞秀区",
      value: "156130602"
    },
    {
      label: "莲池区",
      value: "156130606"
    },
    {
      label: "沙河口区",
      value: "156210204"
    },
    {
      label: "五寨县",
      value: "156140928"
    },
    {
      label: "平罗县",
      value: "156640221"
    },
    {
      label: "西岗区",
      value: "156210203"
    },
    {
      label: "中山区",
      value: "156210202"
    },
    {
      label: "安新县",
      value: "156130632"
    },
    {
      label: "静海区",
      value: "156120118"
    },
    {
      label: "满城区",
      value: "156130607"
    },
    {
      label: "甘井子区",
      value: "156210211"
    },
    {
      label: "津南区",
      value: "156120112"
    },
    {
      label: "雄县",
      value: "156130638"
    },
    {
      label: "宁武县",
      value: "156140925"
    },
    {
      label: "滨海新区",
      value: "156120116"
    },
    {
      label: "徐水区",
      value: "156130609"
    },
    {
      label: "大武口区",
      value: "156640202"
    },
    {
      label: "保德县",
      value: "156140931"
    },
    {
      label: "府谷县",
      value: "156610822"
    },
    {
      label: "容城县",
      value: "156130629"
    },
    {
      label: "金州区",
      value: "156210213"
    },
    {
      label: "代县",
      value: "156140923"
    },
    {
      label: "东丽区",
      value: "156120110"
    },
    {
      label: "鄂托克旗",
      value: "156150624"
    },
    {
      label: "神池县",
      value: "156140927"
    },
    {
      label: "河西区",
      value: "156120103"
    },
    {
      label: "霸州市",
      value: "156131081"
    },
    {
      label: "河东区",
      value: "156120102"
    },
    {
      label: "南开区",
      value: "156120104"
    },
    {
      label: "西青区",
      value: "156120111"
    },
    {
      label: "河北区",
      value: "156120105"
    },
    {
      label: "红桥区",
      value: "156120106"
    },
    {
      label: "繁峙县",
      value: "156140924"
    },
    {
      label: "北辰区",
      value: "156120113"
    },
    {
      label: "惠农区",
      value: "156640205"
    },
    {
      label: "定兴县",
      value: "156130626"
    },
    {
      label: "长海县",
      value: "156210224"
    },
    {
      label: "曹妃甸区",
      value: "156130209"
    },
    {
      label: "朔城区",
      value: "156140602"
    },
    {
      label: "永清县",
      value: "156131023"
    },
    {
      label: "高碑店市",
      value: "156130684"
    },
    {
      label: "宁河区",
      value: "156120117"
    },
    {
      label: "易县",
      value: "156130633"
    },
    {
      label: "涞源县",
      value: "156130630"
    },
    {
      label: "武清区",
      value: "156120114"
    },
    {
      label: "河曲县",
      value: "156140930"
    },
    {
      label: "涞水县",
      value: "156130623"
    },
    {
      label: "普兰店区",
      value: "156210214"
    },
    {
      label: "乐亭县",
      value: "156130225"
    },
    {
      label: "偏关县",
      value: "156140932"
    },
    {
      label: "固安县",
      value: "156131022"
    },
    {
      label: "海南区",
      value: "156150303"
    },
    {
      label: "灵丘县",
      value: "156140224"
    },
    {
      label: "涿州市",
      value: "156130681"
    },
    {
      label: "滦南县",
      value: "156130224"
    },
    {
      label: "乌达区",
      value: "156150304"
    },
    {
      label: "平鲁区",
      value: "156140603"
    },
    {
      label: "安次区",
      value: "156131003"
    },
    {
      label: "广阳区",
      value: "156131003"
    },
    {
      label: "山阴县",
      value: "156140621"
    },
    {
      label: "应县",
      value: "156140622"
    },
    {
      label: "伊金霍洛旗",
      value: "156150627"
    },
    {
      label: "丰南区",
      value: "156130207"
    },
    {
      label: "路北区",
      value: "156130203"
    },
    {
      label: "路南区",
      value: "156130202"
    },
    {
      label: "瓦房店市",
      value: "156210281"
    },
    {
      label: "开平区",
      value: "156130205"
    },
    {
      label: "庄河市",
      value: "156210283"
    },
    {
      label: "海勃湾区",
      value: "156150302"
    },
    {
      label: "浑源县",
      value: "156140225"
    },
    {
      label: "昌黎县",
      value: "156130322"
    },
    {
      label: "古冶区",
      value: "156130204"
    },
    {
      label: "宝坻区",
      value: "156120115"
    },
    {
      label: "大兴区",
      value: "156110115"
    },
    {
      label: "滦州市",
      value: "156130284"
    },
    {
      label: "房山区",
      value: "156110111"
    },
    {
      label: "广灵县",
      value: "156140223"
    },
    {
      label: "香河县",
      value: "156131024"
    },
    {
      label: "东胜区",
      value: "156150602"
    },
    {
      label: "怀仁市",
      value: "156140681"
    },
    {
      label: "丰润区",
      value: "156130208"
    },
    {
      label: "杭锦旗",
      value: "156150625"
    },
    {
      label: "北戴河区",
      value: "156130304"
    },
    {
      label: "蔚县",
      value: "156130726"
    },
    {
      label: "丰台区",
      value: "156110106"
    },
    {
      label: "东港市",
      value: "156210681"
    },
    {
      label: "准格尔旗",
      value: "156150622"
    },
    {
      label: "抚宁区",
      value: "156130306"
    },
    {
      label: "大厂回族自治县",
      value: "156131028"
    },
    {
      label: "卢龙县",
      value: "156130324"
    },
    {
      label: "玉田县",
      value: "156130229"
    },
    {
      label: "石景山区",
      value: "156110107"
    },
    {
      label: "清水河县",
      value: "156150124"
    },
    {
      label: "通州区",
      value: "156110112"
    },
    {
      label: "西城区",
      value: "156110102"
    },
    {
      label: "朝阳区",
      value: "156110105"
    },
    {
      label: "东城区",
      value: "156110101"
    },
    {
      label: "海港区",
      value: "156130302"
    },
    {
      label: "门头沟区",
      value: "156110109"
    },
    {
      label: "海淀区",
      value: "156110108"
    },
    {
      label: "山海关区",
      value: "156130303"
    },
    {
      label: "三河市",
      value: "156131082"
    },
    {
      label: "右玉县",
      value: "156140623"
    },
    {
      label: "迁安市",
      value: "156130283"
    },
    {
      label: "左云县",
      value: "156140226"
    },
    {
      label: "云冈区",
      value: "156140214"
    },
    {
      label: "云州区",
      value: "156140215"
    },
    {
      label: "蓟州区",
      value: "156120119"
    },
    {
      label: "平城区",
      value: "156140213"
    },
    {
      label: "阳原县",
      value: "156130727"
    },
    {
      label: "振兴区",
      value: "156210603"
    },
    {
      label: "顺义区",
      value: "156110113"
    },
    {
      label: "元宝区",
      value: "156210602"
    },
    {
      label: "平谷区",
      value: "156110117"
    },
    {
      label: "迁西县",
      value: "156130227"
    },
    {
      label: "振安区",
      value: "156210604"
    },
    {
      label: "遵化市",
      value: "156130281"
    },
    {
      label: "昌平区",
      value: "156110114"
    },
    {
      label: "鲅鱼圈区",
      value: "156210804"
    },
    {
      label: "新荣区",
      value: "156140212"
    },
    {
      label: "托克托县",
      value: "156150122"
    },
    {
      label: "岫岩满族自治县",
      value: "156210323"
    },
    {
      label: "怀柔区",
      value: "156110116"
    },
    {
      label: "绥中县",
      value: "156211421"
    },
    {
      label: "磴口县",
      value: "156150822"
    },
    {
      label: "阳高县",
      value: "156140221"
    },
    {
      label: "密云区",
      value: "156110118"
    },
    {
      label: "和林格尔县",
      value: "156150123"
    },
    {
      label: "涿鹿县",
      value: "156130731"
    },
    {
      label: "达拉特旗",
      value: "156150621"
    },
    {
      label: "盖州市",
      value: "156210881"
    },
    {
      label: "青龙满族自治县",
      value: "156130321"
    },
    {
      label: "怀来县",
      value: "156130730"
    },
    {
      label: "兴隆县",
      value: "156130822"
    },
    {
      label: "天镇县",
      value: "156140222"
    },
    {
      label: "丰镇市",
      value: "156150981"
    },
    {
      label: "凤城市",
      value: "156210682"
    },
    {
      label: "延庆区",
      value: "156110119"
    },
    {
      label: "下花园区",
      value: "156130706"
    },
    {
      label: "凉城县",
      value: "156150925"
    },
    {
      label: "鹰手营子矿区",
      value: "156130804"
    },
    {
      label: "土默特右旗",
      value: "156150221"
    },
    {
      label: "东河区",
      value: "156150202"
    },
    {
      label: "宣化区",
      value: "156130705"
    },
    {
      label: "兴城市",
      value: "156211481"
    },
    {
      label: "九原区",
      value: "156150207"
    },
    {
      label: "宽城满族自治县",
      value: "156130827"
    },
    {
      label: "昆都仑区",
      value: "156150203"
    },
    {
      label: "大石桥市",
      value: "156210882"
    },
    {
      label: "青山区",
      value: "156150204"
    },
    {
      label: "西市区",
      value: "156210803"
    },
    {
      label: "站前区",
      value: "156210802"
    },
    {
      label: "怀安县",
      value: "156130728"
    },
    {
      label: "石拐区",
      value: "156150205"
    },
    {
      label: "老边区",
      value: "156210811"
    },
    {
      label: "土默特左旗",
      value: "156150121"
    },
    {
      label: "宽甸满族自治县",
      value: "156210624"
    },
    {
      label: "龙港区",
      value: "156211403"
    },
    {
      label: "乌拉特前旗",
      value: "156150823"
    },
    {
      label: "玉泉区",
      value: "156150104"
    },
    {
      label: "临河区",
      value: "156150802"
    },
    {
      label: "万全区",
      value: "156130708"
    },
    {
      label: "承德县",
      value: "156130821"
    },
    {
      label: "连山区",
      value: "156211402"
    },
    {
      label: "察哈尔右翼前旗",
      value: "156150926"
    },
    {
      label: "桥东区",
      value: "156130702"
    },
    {
      label: "赛罕区",
      value: "156150105"
    },
    {
      label: "回民区",
      value: "156150103"
    },
    {
      label: "桥西区",
      value: "156130703"
    },
    {
      label: "建昌县",
      value: "156211422"
    },
    {
      label: "新城区",
      value: "156150102"
    },
    {
      label: "兴和县",
      value: "156150924"
    },
    {
      label: "海城市",
      value: "156210381"
    },
    {
      label: "杭锦后旗",
      value: "156150826"
    },
    {
      label: "卓资县",
      value: "156150921"
    },
    {
      label: "赤城县",
      value: "156130732"
    },
    {
      label: "滦平县",
      value: "156130824"
    },
    {
      label: "双滦区",
      value: "156130803"
    },
    {
      label: "崇礼区",
      value: "156130709"
    },
    {
      label: "双桥区",
      value: "156130802"
    },
    {
      label: "大洼区",
      value: "156211104"
    },
    {
      label: "平泉市",
      value: "156130881"
    },
    {
      label: "固阳县",
      value: "156150222"
    },
    {
      label: "集宁区",
      value: "156150902"
    },
    {
      label: "千山区",
      value: "156210302"
    },
    {
      label: "尚义县",
      value: "156130725"
    },
    {
      label: "乌拉特后旗",
      value: "156150825"
    },
    {
      label: "五原县",
      value: "156150821"
    },
    {
      label: "铁东区",
      value: "156210302"
    },
    {
      label: "武川县",
      value: "156150125"
    },
    {
      label: "南芬区",
      value: "156210505"
    },
    {
      label: "南票区",
      value: "156211404"
    },
    {
      label: "太和区",
      value: "156210711"
    },
    {
      label: "凌河区",
      value: "156210703"
    },
    {
      label: "古塔区",
      value: "156210702"
    },
    {
      label: "铁西区",
      value: "156210303"
    },
    {
      label: "集安市",
      value: "156220582"
    },
    {
      label: "喀喇沁左翼蒙古族自治县",
      value: "156211324"
    },
    {
      label: "兴隆台区",
      value: "156211103"
    },
    {
      label: "立山区",
      value: "156210304"
    },
    {
      label: "弓长岭区",
      value: "156211005"
    },
    {
      label: "张北县",
      value: "156130722"
    },
    {
      label: "凌海市",
      value: "156210781"
    },
    {
      label: "双台子区",
      value: "156211102"
    },
    {
      label: "辽阳县",
      value: "156211021"
    },
    {
      label: "丰宁满族自治县",
      value: "156130826"
    },
    {
      label: "宏伟区",
      value: "156211004"
    },
    {
      label: "盘山县",
      value: "156211122"
    },
    {
      label: "凌源市",
      value: "156211382"
    },
    {
      label: "太子河区",
      value: "156211002"
    },
    {
      label: "文圣区",
      value: "156211002"
    },
    {
      label: "桓仁满族自治县",
      value: "156210522"
    },
    {
      label: "白塔区",
      value: "156211002"
    },
    {
      label: "察哈尔右翼中旗",
      value: "156150927"
    },
    {
      label: "平山区",
      value: "156210502"
    },
    {
      label: "本溪满族自治县",
      value: "156210521"
    },
    {
      label: "明山区",
      value: "156210504"
    },
    {
      label: "隆化县",
      value: "156130825"
    },
    {
      label: "溪湖区",
      value: "156210503"
    },
    {
      label: "建平县",
      value: "156211322"
    },
    {
      label: "台安县",
      value: "156210321"
    },
    {
      label: "长白朝鲜族自治县",
      value: "156220623"
    },
    {
      label: "灯塔市",
      value: "156211081"
    },
    {
      label: "察哈尔右翼后旗",
      value: "156150928"
    },
    {
      label: "朝阳县",
      value: "156211321"
    },
    {
      label: "辽中区",
      value: "156210115"
    },
    {
      label: "义县",
      value: "156210727"
    },
    {
      label: "四子王旗",
      value: "156150929"
    },
    {
      label: "商都县",
      value: "156150923"
    },
    {
      label: "双塔区",
      value: "156211302"
    },
    {
      label: "乌拉特中旗",
      value: "156150824"
    },
    {
      label: "北镇市",
      value: "156210782"
    },
    {
      label: "龙城区",
      value: "156211303"
    },
    {
      label: "宁城县",
      value: "156150429"
    },
    {
      label: "苏家屯区",
      value: "156210111"
    },
    {
      label: "沽源县",
      value: "156130724"
    },
    {
      label: "通化县",
      value: "156220521"
    },
    {
      label: "黑山县",
      value: "156210726"
    },
    {
      label: "达尔罕茂明安联合旗",
      value: "156150223"
    },
    {
      label: "东昌区",
      value: "156220502"
    },
    {
      label: "新宾满族自治县",
      value: "156210422"
    },
    {
      label: "浑南区",
      value: "156210103"
    },
    {
      label: "白云鄂博矿区",
      value: "156150206"
    },
    {
      label: "二道江区",
      value: "156220503"
    },
    {
      label: "清河门区",
      value: "156210905"
    },
    {
      label: "和平区",
      value: "156120101"
    },
    {
      label: "和平区",
      value: "156210102"
    },
    {
      label: "于洪区",
      value: "156210114"
    },
    {
      label: "沈河区",
      value: "156210103"
    },
    {
      label: "北票市",
      value: "156211381"
    },
    {
      label: "铁西区",
      value: "156210106"
    },
    {
      label: "大东区",
      value: "156210104"
    },
    {
      label: "临江市",
      value: "156220681"
    },
    {
      label: "皇姑区",
      value: "156210105"
    },
    {
      label: "康保县",
      value: "156130723"
    },
    {
      label: "东洲区",
      value: "156210403"
    },
    {
      label: "望花区",
      value: "156210404"
    },
    {
      label: "新抚区",
      value: "156210402"
    },
    {
      label: "太仆寺旗",
      value: "156152527"
    },
    {
      label: "抚顺县",
      value: "156210421"
    },
    {
      label: "顺城区",
      value: "156210411"
    },
    {
      label: "化德县",
      value: "156150922"
    },
    {
      label: "喀喇沁旗",
      value: "156150428"
    },
    {
      label: "围场满族蒙古族自治县",
      value: "156130828"
    },
    {
      label: "浑江区",
      value: "156220602"
    },
    {
      label: "新民市",
      value: "156210181"
    },
    {
      label: "太平区",
      value: "156210904"
    },
    {
      label: "海州区",
      value: "156210902"
    },
    {
      label: "细河区",
      value: "156210911"
    },
    {
      label: "元宝山区",
      value: "156150403"
    },
    {
      label: "沈北新区",
      value: "156210113"
    },
    {
      label: "江源区",
      value: "156220605"
    },
    {
      label: "阜新蒙古族自治县",
      value: "156210921"
    },
    {
      label: "新邱区",
      value: "156210903"
    },
    {
      label: "清原满族自治县",
      value: "156210423"
    },
    {
      label: "多伦县",
      value: "156152531"
    },
    {
      label: "抚松县",
      value: "156220621"
    },
    {
      label: "铁岭县",
      value: "156211221"
    },
    {
      label: "镶黄旗",
      value: "156152528"
    },
    {
      label: "正蓝旗",
      value: "156152530"
    },
    {
      label: "红山区",
      value: "156150402"
    },
    {
      label: "柳河县",
      value: "156220524"
    },
    {
      label: "银州区",
      value: "156211202"
    },
    {
      label: "松山区",
      value: "156150404"
    },
    {
      label: "正镶白旗",
      value: "156152529"
    },
    {
      label: "敖汉旗",
      value: "156150430"
    },
    {
      label: "彰武县",
      value: "156210922"
    },
    {
      label: "靖宇县",
      value: "156220622"
    },
    {
      label: "调兵山市",
      value: "156211281"
    },
    {
      label: "法库县",
      value: "156210124"
    },
    {
      label: "梅河口市",
      value: "156220581"
    },
    {
      label: "和龙市",
      value: "156222406"
    },
    {
      label: "开原市",
      value: "156211282"
    },
    {
      label: "清河区",
      value: "156211204"
    },
    {
      label: "东丰县",
      value: "156220421"
    },
    {
      label: "辉南县",
      value: "156220523"
    },
    {
      label: "库伦旗",
      value: "156150524"
    },
    {
      label: "西丰县",
      value: "156211223"
    },
    {
      label: "苏尼特右旗",
      value: "156152524"
    },
    {
      label: "康平县",
      value: "156210123"
    },
    {
      label: "龙井市",
      value: "156222405"
    },
    {
      label: "昌图县",
      value: "156211224"
    },
    {
      label: "珲春市",
      value: "156222404"
    },
    {
      label: "奈曼旗",
      value: "156150525"
    },
    {
      label: "延吉市",
      value: "156222401"
    },
    {
      label: "龙山区",
      value: "156220402"
    },
    {
      label: "东辽县",
      value: "156220422"
    },
    {
      label: "西安区",
      value: "156220403"
    },
    {
      label: "科尔沁左翼后旗",
      value: "156150522"
    },
    {
      label: "翁牛特旗",
      value: "156150426"
    },
    {
      label: "磐石市",
      value: "156220284"
    },
    {
      label: "图们市",
      value: "156222402"
    },
    {
      label: "桦甸市",
      value: "156220282"
    },
    {
      label: "安图县",
      value: "156222426"
    },
    {
      label: "铁西区",
      value: "156220302"
    },
    {
      label: "铁东区",
      value: "156220303"
    },
    {
      label: "克什克腾旗",
      value: "156150425"
    },
    {
      label: "梨树县",
      value: "156220322"
    },
    {
      label: "汪清县",
      value: "156222424"
    },
    {
      label: "伊通满族自治县",
      value: "156220323"
    },
    {
      label: "敦化市",
      value: "156222403"
    },
    {
      label: "公主岭市",
      value: "156220184"
    },
    {
      label: "双辽市",
      value: "156220382"
    },
    {
      label: "双阳区",
      value: "156220112"
    },
    {
      label: "巴林右旗",
      value: "156150423"
    },
    {
      label: "开鲁县",
      value: "156150523"
    },
    {
      label: "林西县",
      value: "156150424"
    },
    {
      label: "科尔沁区",
      value: "156150502"
    },
    {
      label: "二连浩特市",
      value: "156152501"
    },
    {
      label: "永吉县",
      value: "156220221"
    },
    {
      label: "蛟河市",
      value: "156220281"
    },
    {
      label: "丰满区",
      value: "156220211"
    },
    {
      label: "朝阳区",
      value: "156220104"
    },
    {
      label: "船营区",
      value: "156220204"
    },
    {
      label: "苏尼特左旗",
      value: "156152523"
    },
    {
      label: "南关区",
      value: "156220102"
    },
    {
      label: "二道区",
      value: "156220105"
    },
    {
      label: "阿鲁科尔沁旗",
      value: "156150421"
    },
    {
      label: "绿园区",
      value: "156220106"
    },
    {
      label: "昌邑区",
      value: "156220202"
    },
    {
      label: "龙潭区",
      value: "156220203"
    },
    {
      label: "锡林浩特市",
      value: "156152502"
    },
    {
      label: "宽城区",
      value: "156220103"
    },
    {
      label: "巴林左旗",
      value: "156150422"
    },
    {
      label: "阿巴嘎旗",
      value: "156152522"
    },
    {
      label: "东宁市",
      value: "156231086"
    },
    {
      label: "科尔沁左翼中旗",
      value: "156150521"
    },
    {
      label: "九台区",
      value: "156220113"
    },
    {
      label: "长岭县",
      value: "156220722"
    },
    {
      label: "宁安市",
      value: "156231084"
    },
    {
      label: "舒兰市",
      value: "156220283"
    },
    {
      label: "绥芬河市",
      value: "156231081"
    },
    {
      label: "农安县",
      value: "156220122"
    },
    {
      label: "德惠市",
      value: "156220183"
    },
    {
      label: "扎鲁特旗",
      value: "156150526"
    },
    {
      label: "西安区",
      value: "156231005"
    },
    {
      label: "东安区",
      value: "156231002"
    },
    {
      label: "西乌珠穆沁旗",
      value: "156152526"
    },
    {
      label: "海林市",
      value: "156231083"
    },
    {
      label: "爱民区",
      value: "156231004"
    },
    {
      label: "阳明区",
      value: "156231003"
    },
    {
      label: "通榆县",
      value: "156220822"
    },
    {
      label: "榆树市",
      value: "156220182"
    },
    {
      label: "穆棱市",
      value: "156231085"
    },
    {
      label: "五常市",
      value: "156230184"
    },
    {
      label: "扶余市",
      value: "156220781"
    },
    {
      label: "乾安县",
      value: "156220723"
    },
    {
      label: "科尔沁右翼中旗",
      value: "156152222"
    },
    {
      label: "梨树区",
      value: "156230305"
    },
    {
      label: "前郭尔罗斯蒙古族自治县",
      value: "156220721"
    },
    {
      label: "宁江区",
      value: "156220702"
    },
    {
      label: "尚志市",
      value: "156230183"
    },
    {
      label: "恒山区",
      value: "156230303"
    },
    {
      label: "麻山区",
      value: "156230307"
    },
    {
      label: "鸡东县",
      value: "156230321"
    },
    {
      label: "林口县",
      value: "156231025"
    },
    {
      label: "鸡冠区",
      value: "156230302"
    },
    {
      label: "洮南市",
      value: "156220881"
    },
    {
      label: "城子河区",
      value: "156230306"
    },
    {
      label: "滴道区",
      value: "156230304"
    },
    {
      label: "突泉县",
      value: "156152224"
    },
    {
      label: "双城区",
      value: "156230113"
    },
    {
      label: "延寿县",
      value: "156230129"
    },
    {
      label: "大安市",
      value: "156220882"
    },
    {
      label: "东乌珠穆沁旗",
      value: "156152525"
    },
    {
      label: "肇源县",
      value: "156230622"
    },
    {
      label: "密山市",
      value: "156230382"
    },
    {
      label: "霍林郭勒市",
      value: "156150581"
    },
    {
      label: "阿城区",
      value: "156230112"
    },
    {
      label: "平房区",
      value: "156230108"
    },
    {
      label: "洮北区",
      value: "156220802"
    },
    {
      label: "肇州县",
      value: "156230621"
    },
    {
      label: "香坊区",
      value: "156230110"
    },
    {
      label: "勃利县",
      value: "156230921"
    },
    {
      label: "道里区",
      value: "156230102"
    },
    {
      label: "宾县",
      value: "156230125"
    },
    {
      label: "南岗区",
      value: "156230103"
    },
    {
      label: "虎林市",
      value: "156230381"
    },
    {
      label: "桃山区",
      value: "156230903"
    },
    {
      label: "茄子河区",
      value: "156230904"
    },
    {
      label: "道外区",
      value: "156230104"
    },
    {
      label: "松北区",
      value: "156230109"
    },
    {
      label: "新兴区",
      value: "156230902"
    },
    {
      label: "镇赉县",
      value: "156220821"
    },
    {
      label: "方正县",
      value: "156230124"
    },
    {
      label: "呼兰区",
      value: "156230111"
    },
    {
      label: "木兰县",
      value: "156230127"
    },
    {
      label: "通河县",
      value: "156230128"
    },
    {
      label: "大同区",
      value: "156230606"
    },
    {
      label: "肇东市",
      value: "156231282"
    },
    {
      label: "乌兰浩特市",
      value: "156152201"
    },
    {
      label: "科尔沁右翼前旗",
      value: "156152221"
    },
    {
      label: "巴彦县",
      value: "156230126"
    },
    {
      label: "桦南县",
      value: "156230822"
    },
    {
      label: "兰西县",
      value: "156231222"
    },
    {
      label: "依兰县",
      value: "156230123"
    },
    {
      label: "宝清县",
      value: "156230523"
    },
    {
      label: "泰来县",
      value: "156230224"
    },
    {
      label: "红岗区",
      value: "156230605"
    },
    {
      label: "安达市",
      value: "156231281"
    },
    {
      label: "龙凤区",
      value: "156230603"
    },
    {
      label: "宝山区",
      value: "156230506"
    },
    {
      label: "岭东区",
      value: "156230503"
    },
    {
      label: "萨尔图区",
      value: "156230602"
    },
    {
      label: "四方台区",
      value: "156230505"
    },
    {
      label: "北林区",
      value: "156231202"
    },
    {
      label: "尖山区",
      value: "156230502"
    },
    {
      label: "让胡路区",
      value: "156230604"
    },
    {
      label: "青冈县",
      value: "156231223"
    },
    {
      label: "扎赉特旗",
      value: "156152223"
    },
    {
      label: "集贤县",
      value: "156230521"
    },
    {
      label: "汤原县",
      value: "156230828"
    },
    {
      label: "友谊县",
      value: "156230522"
    },
    {
      label: "饶河县",
      value: "156230524"
    },
    {
      label: "向阳区",
      value: "156230803"
    },
    {
      label: "郊区",
      value: "156230811"
    },
    {
      label: "前进区",
      value: "156230804"
    },
    {
      label: "东风区",
      value: "156230805"
    },
    {
      label: "望奎县",
      value: "156231221"
    },
    {
      label: "杜尔伯特蒙古族自治县",
      value: "156230624"
    },
    {
      label: "庆安县",
      value: "156231224"
    },
    {
      label: "铁力市",
      value: "156230781"
    },
    {
      label: "桦川县",
      value: "156230826"
    },
    {
      label: "大箐山县",
      value: "156230725"
    },
    {
      label: "南岔县",
      value: "156230726"
    },
    {
      label: "昂昂溪区",
      value: "156230205"
    },
    {
      label: "林甸县",
      value: "156230623"
    },
    {
      label: "明水县",
      value: "156231225"
    },
    {
      label: "阿尔山市",
      value: "156152202"
    },
    {
      label: "富拉尔基区",
      value: "156230206"
    },
    {
      label: "绥棱县",
      value: "156231226"
    },
    {
      label: "富锦市",
      value: "156230882"
    },
    {
      label: "兴安区",
      value: "156230405"
    },
    {
      label: "绥滨县",
      value: "156230422"
    },
    {
      label: "梅里斯达斡尔族区",
      value: "156230208"
    },
    {
      label: "南山区",
      value: "156230404"
    },
    {
      label: "龙沙区",
      value: "156230202"
    },
    {
      label: "工农区",
      value: "156230403"
    },
    {
      label: "东山区",
      value: "156230406"
    },
    {
      label: "龙江县",
      value: "156230221"
    },
    {
      label: "铁锋区",
      value: "156230204"
    },
    {
      label: "向阳区",
      value: "156230402"
    },
    {
      label: "建华区",
      value: "156230203"
    },
    {
      label: "兴山区",
      value: "156230407"
    },
    {
      label: "海伦市",
      value: "156231283"
    },
    {
      label: "金林区",
      value: "156230751"
    },
    {
      label: "碾子山区",
      value: "156230207"
    },
    {
      label: "萝北县",
      value: "156230421"
    },
    {
      label: "拜泉县",
      value: "156230231"
    },
    {
      label: "同江市",
      value: "156230881"
    },
    {
      label: "乌翠区",
      value: "156230718"
    },
    {
      label: "伊美区",
      value: "156230717"
    },
    {
      label: "富裕县",
      value: "156230227"
    },
    {
      label: "友好区",
      value: "156230719"
    },
    {
      label: "依安县",
      value: "156230223"
    },
    {
      label: "甘南县",
      value: "156230225"
    },
    {
      label: "扎兰屯市",
      value: "156150783"
    },
    {
      label: "克山县",
      value: "156230229"
    },
    {
      label: "克东县",
      value: "156230230"
    },
    {
      label: "阿荣旗",
      value: "156150721"
    },
    {
      label: "新巴尔虎左旗",
      value: "156150726"
    },
    {
      label: "北安市",
      value: "156231181"
    },
    {
      label: "丰林县",
      value: "156230724"
    },
    {
      label: "抚远市",
      value: "156230883"
    },
    {
      label: "汤旺县",
      value: "156230723"
    },
    {
      label: "莫力达瓦达斡尔族自治旗",
      value: "156150722"
    },
    {
      label: "讷河市",
      value: "156230281"
    },
    {
      label: "五大连池市",
      value: "156231182"
    },
    {
      label: "新巴尔虎右旗",
      value: "156150727"
    },
    {
      label: "嘉荫县",
      value: "156230722"
    },
    {
      label: "鄂温克族自治旗",
      value: "156150724"
    },
    {
      label: "嫩江市",
      value: "156231183"
    },
    {
      label: "海拉尔区",
      value: "156150702"
    },
    {
      label: "牙克石市",
      value: "156150782"
    },
    {
      label: "陈巴尔虎旗",
      value: "156150725"
    },
    {
      label: "孙吴县",
      value: "156231124"
    },
    {
      label: "扎赉诺尔区",
      value: "156150781"
    },
    {
      label: "逊克县",
      value: "156231123"
    },
    {
      label: "满洲里市",
      value: "156150781"
    },
    {
      label: "额尔古纳市",
      value: "156150784"
    },
    {
      label: "爱辉区",
      value: "156231102"
    },
    {
      label: "加格达奇",
      value: "156150723"
    },
    {
      label: "鄂伦春自治旗",
      value: "156150723"
    },
    {
      label: "根河市",
      value: "156150785"
    },
    {
      label: "呼玛县",
      value: "156232721"
    },
    {
      label: "塔河县",
      value: "156232722"
    },
    {
      label: "漠河市",
      value: "156232701"
    },
    {
      label: "可克达拉市",
      value: "156659008"
    },
    {
      label: "昆玉市",
      value: "156659009"
    },
    {
      label: "新吴区",
      value: "156320214"
    },
    {
      label: "华州区",
      value: "156520115"
    },
    {
      label: "浑南区",
      value: "156210112"
    },
    {
      label: "平桂区",
      value: "156451103"
    },
    {
      label: "观山湖区",
      value: "156451103"
    },
    {
      label: "康巴什区",
      value: "156150603"
    },
    {
      label: "龙华区",
      value: "156440309"
    },
    {
      label: "坪山区",
      value: "156440310"
    },
    {
      label: "随县",
      value: "156421321"
    },
    {
      label: "太子山天然林保护区",
      value: "156629900"
    },
    {
      label: "叶集区",
      value: "156341504"
    },
    {
      label: "霍尔果斯市",
      value: "156654004"
    },
    {
      label: "红谷滩区",
      value: "156360113"
    },
    {
      label: "阿拉善经济开发区",
      value: "156152971"
    },
    {
      label: "莲花山风景林自然保护区",
      value: "156629800"
    },
    {
      label: "甘肃中牧山丹马场",
      value: "156629700"
    },
    {
      label: "光明区",
      value: "156440311"
    },
    {
      label: "龙港市",
      value: "156330383"
    },
    {
      label: "胡杨河市",
      value: "156659010"
    },
    {
      label: "西沙区",
      value: "156460321"
    },
    {
      label: "南沙区",
      value: "156460322"
    }
  ];
  const _sfc_main$3 = {
    components: {
      tiandituPopupVue
    },
    data() {
      return {
        keyword: "",
        visible: false,
        list1: [],
        records: [],
        storKey: "tianditu-records-city",
        inputCity: "",
        city: {
          "label": "德阳市",
          "value": "156510600"
        }
      };
    },
    props: {
      searchType: {
        type: Number,
        default: 0
      },
      style: {
        type: Object,
        default: {}
      },
      showSearch: {
        type: Boolean,
        require: true
      }
    },
    created() {
      const stor = uni.getStorageSync(this.storKey);
      if (stor && stor.length) {
        this.records = stor;
      }
    },
    methods: {
      searchKeyword() {
        if (this.keyword) {
          let params = {
            city: this.city,
            keyword: this.keyword
          };
          if (this.searchType === 1) {
            delete params.city;
          }
          this.$emit("onSearch", params);
        } else {
          tools.createMessage("请输入详细地址");
        }
      },
      selectCity(item) {
        if (!this.records.some((zItem) => zItem.value === item.value)) {
          const arr = [...this.records, item];
          if (arr.length > 10) {
            arr.shift();
          }
          this.records = arr;
          uni.setStorage({
            key: this.storKey,
            data: this.records
          });
        }
        this.city = item;
        this.inputCity = "";
        this.visible = false;
      },
      clearRcords() {
        this.records = [];
        uni.setStorage({
          key: this.storKey,
          data: []
        });
      },
      searchCity() {
        if (this.inputCity) {
          this.list1 = dataCityList.filter((item) => {
            const reg = new RegExp(this.inputCity, "ig");
            if (reg.test(item.label)) {
              return true;
            }
          });
        } else {
          tools.createMessage("请输入省市区关键字");
        }
      },
      close() {
        this.$emit("onClose");
      },
      confirm() {
        this.$emit("onConfirm");
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tiandituPopupVue = vue.resolveComponent("tiandituPopupVue");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      vue.createElementVNode(
        "view",
        {
          style: vue.normalizeStyle($props.style),
          class: "search-zhuozhuo"
        },
        [
          vue.createElementVNode("view", { class: "hearderback" }, [
            vue.createElementVNode("view", {
              class: "back",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.close && $options.close(...args))
            }, "关 闭"),
            vue.createElementVNode("view", {
              class: "confirm",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.confirm && $options.confirm(...args))
            }, "完 成")
          ]),
          vue.withDirectives(vue.createElementVNode(
            "view",
            { class: "search" },
            [
              vue.createElementVNode("view", { class: "search-content" }, [
                $props.searchType === 0 ? (vue.openBlock(), vue.createElementBlock(
                  "view",
                  {
                    key: 0,
                    class: "search-icon",
                    onClick: _cache[2] || (_cache[2] = ($event) => $data.visible = true)
                  },
                  vue.toDisplayString($data.city.label),
                  1
                  /* TEXT */
                )) : vue.createCommentVNode("v-if", true),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    class: "search-input",
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.keyword = $event),
                    placeholder: "请输入详细地址"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.keyword]
                ]),
                vue.createElementVNode("view", {
                  class: "search-btn",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.searchKeyword && $options.searchKeyword(...args))
                }, "搜索")
              ])
            ],
            512
            /* NEED_PATCH */
          ), [
            [vue.vShow, $props.showSearch]
          ])
        ],
        4
        /* STYLE */
      ),
      vue.createVNode(_component_tiandituPopupVue, {
        visible: $data.visible,
        onOnClose: _cache[8] || (_cache[8] = ($event) => $data.visible = false)
      }, {
        default: vue.withCtx(() => [
          vue.createElementVNode("view", { class: "search" }, [
            vue.createElementVNode("view", { class: "search-content" }, [
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  class: "search-input",
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.inputCity = $event),
                  placeholder: "请输入省\\市\\区"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.inputCity]
              ]),
              vue.createElementVNode("view", {
                class: "search-btn",
                onClick: _cache[6] || (_cache[6] = (...args) => $options.searchCity && $options.searchCity(...args))
              }, "搜索")
            ])
          ]),
          vue.createElementVNode("view", { class: "listBox" }, [
            vue.createElementVNode("view", { style: { "display": "flex", "justify-content": "space-between", "align-items": "center" } }, [
              vue.createElementVNode("h3", { style: { "margin-bottom": "10px" } }, "历史记录"),
              vue.createElementVNode("view", {
                class: "clear",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.clearRcords && $options.clearRcords(...args))
              }, "清空")
            ]),
            vue.createElementVNode("view", { class: "listBox1" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.records, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "tab-card",
                    onClick: ($event) => $options.selectCity(item),
                    key: item.value
                  }, vue.toDisplayString(item.label), 9, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ]),
            vue.createElementVNode("view", {
              "data-text": "历史记录",
              class: "divider"
            }),
            vue.createElementVNode("view", { class: "listBoxchild" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.list1, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    class: "tab-card",
                    onClick: ($event) => $options.selectCity(item),
                    key: item.value
                  }, vue.toDisplayString(item.label), 9, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])
        ]),
        _: 1
        /* STABLE */
      }, 8, ["visible"])
    ]);
  }
  const tiandituSearchVue = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$2], ["__scopeId", "data-v-427bb69a"], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/tianditu-search.vue"]]);
  const _sfc_main$2 = {
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
      search: {
        type: Boolean,
        default: true
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
        selectItem: {},
        iStatusBarHeight: 0,
        option: {
          apikey: 123123
        }
      };
    },
    created() {
      var that = this;
      const searchHeight = this.search ? 54 : 10;
      const {
        statusBarHeight,
        screenHeight,
        windowHeight
      } = uni.getSystemInfoSync();
      if (screenHeight === windowHeight) {
        that.iStatusBarHeight = statusBarHeight + searchHeight;
      } else {
        that.iStatusBarHeight = 0;
      }
      uni.getSystemInfo({
        success: function(res) {
          that.winWidth = res.windowWidth;
          that.winHeight = res.windowHeight;
          that.winTop = res.windowTop;
        }
      });
    },
    methods: {
      open(lon, lat) {
        if (lon && lat) {
          this.visible = true;
          this.$nextTick(() => {
            this.$refs.tiandituMapRefs.initCharts(lon, lat);
          });
        } else {
          formatAppLog("error", "at uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.vue:120", "请传入lon, lat");
        }
      },
      close() {
        this.visible = false;
      },
      onConfirm() {
        if (Object.keys(this.selectItem).length) {
          this.visible = false;
          this.$emit("onSelect", this.selectItem);
        } else {
          tools.createMessage("请选择位置");
        }
      },
      upDateLonLat(lon, lat) {
        if (lon && lat) {
          this.$refs.tiandituMapRefs.upDataCharts(lon, lat);
        } else {
          formatAppLog("error", "at uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.vue:139", "请传入lon, lat");
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
        let resData = await tools.createRequest("http://api.tianditu.gov.cn/geocoder", params, true);
        if (resData.status === "0") {
          const location = resData.location;
          const formateOne = tools.formatterAdressLocation(resData, 3);
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
        let resData = await tools.createRequest("http://api.tianditu.gov.cn/v2/search", params, true);
        if (resData.status.infocode === 1e3) {
          const {
            pois: aPoints,
            count
          } = resData;
          if (count === "0" || !aPoints || !aPoints.length) {
            return tools.createMessage("没有找到该地址");
          }
          const {
            pois,
            keyWord,
            lonlat
          } = aPoints[0];
          const formateData = aPoints.map((item) => tools.formatterAdressLocation(item, 2));
          this.datalist = formateData;
          this.selectItem = formateData[0];
          const [lon, lat] = lonlat.split(",");
          this.$refs.tiandituMapRefs.upDataCharts(lon, lat);
        } else {
          tools.createMessage("数据异常", 1e3, false, "error");
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
        formatAppLog("warn", "at uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.vue:210", "--------天地图加载完成--------");
      },
      start(e) {
        const clientY = e.changedTouches[0].clientY;
        this.startY = clientY;
      },
      end(e) {
        const transformY = e.changedTouches[0].clientY - this.startY;
        switch (true) {
          case transformY > 50:
            formatAppLog("log", "at uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.vue:220", "下划");
            this.domMaxHeight = "20vh";
            this.domMinHeight = "0vh";
            break;
          case transformY < -50:
            formatAppLog("log", "at uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.vue:225", "上划");
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
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_tiandituSearchVue = vue.resolveComponent("tiandituSearchVue");
    const _component_tiandituMap = vue.resolveComponent("tiandituMap");
    return vue.openBlock(), vue.createElementBlock("view", null, [
      $data.visible ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 0,
          class: "mask",
          style: vue.normalizeStyle({ height: $data.winHeight + "px", width: $data.winWidth + "px", top: $data.winTop + "px" })
        },
        [
          vue.createVNode(_component_tiandituSearchVue, {
            showSearch: $props.search,
            style: vue.normalizeStyle({ height: $data.iStatusBarHeight ? $data.iStatusBarHeight + "px" : "fitcontent", paddingTop: $data.iStatusBarHeight ? "20px" : "0" }),
            onOnSearch: $options.tianidtuSearch,
            searchType: $props.searchType,
            onOnClose: $options.close,
            onOnConfirm: $options.onConfirm
          }, null, 8, ["showSearch", "style", "onOnSearch", "searchType", "onOnClose", "onOnConfirm"]),
          vue.createVNode(_component_tiandituMap, {
            ref: "tiandituMapRefs",
            onOnLoadTianDiTu: $options.initMaps,
            onOnSelect: $options.selectPoint,
            apiKey: $props.apiKey,
            customIcon: $props.icon
          }, null, 8, ["onOnLoadTianDiTu", "onOnSelect", "apiKey", "customIcon"]),
          vue.createCommentVNode(" footer "),
          vue.createElementVNode(
            "view",
            {
              class: "list-boxd",
              ref: "listBox",
              style: vue.normalizeStyle({ minHeight: $data.domMinHeight, maxHeight: $data.domMaxHeight })
            },
            [
              vue.createElementVNode(
                "view",
                {
                  class: "list-header",
                  onTouchstart: _cache[0] || (_cache[0] = (...args) => $options.start && $options.start(...args)),
                  onTouchend: _cache[1] || (_cache[1] = (...args) => $options.end && $options.end(...args))
                },
                null,
                32
                /* NEED_HYDRATION */
              ),
              vue.createElementVNode("view", { class: "list-content" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.datalist, (item, index) => {
                    return vue.openBlock(), vue.createElementBlock("view", {
                      key: index,
                      onClick: ($event) => $options.selectCard(item)
                    }, [
                      vue.renderSlot(_ctx.$slots, "cards", {
                        row: item,
                        index: $data.selectItem,
                        onClick: ($event) => $options.selectCard(item)
                      }, void 0, true),
                      !_ctx.$slots.cards ? (vue.openBlock(), vue.createElementBlock(
                        "view",
                        {
                          key: 0,
                          class: "card",
                          style: vue.normalizeStyle({ background: item.address === $data.selectItem.address ? "#f3f4f6" : "#FFFFFF" })
                        },
                        [
                          vue.createElementVNode("view", { class: "card-left" }, [
                            vue.createElementVNode(
                              "view",
                              { class: "card-title" },
                              vue.toDisplayString(item.address) + vue.toDisplayString(item.name && `(${item.name})`),
                              1
                              /* TEXT */
                            ),
                            vue.createElementVNode(
                              "view",
                              { class: "card-text" },
                              "(" + vue.toDisplayString(item.location.lon) + "," + vue.toDisplayString(item.location.lat) + ")",
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode("view", { class: "card-right" }, [
                            vue.createElementVNode("view", { class: "arrow" })
                          ])
                        ],
                        4
                        /* STYLE */
                      )) : vue.createCommentVNode("v-if", true)
                    ], 8, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ],
            4
            /* STYLE */
          )
        ],
        4
        /* STYLE */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const __easycom_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$1], ["__scopeId", "data-v-aedbc2bd"], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/uni_modules/zhuo-tianditu-select/components/zhuo-tianditu-select/zhuo-tianditu-select.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        icon: null,
        point: {}
      };
    },
    onLoad() {
      const that = this;
      uni.getImageInfo({
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
        formatAppLog("log", "at pages/index/index.vue:40", "天地图加载完成");
      },
      onSelect(value) {
        formatAppLog("log", "at pages/index/index.vue:43", "value", value);
        this.point = value;
      },
      selectMap() {
        this.$refs.tMap.open(104.397894, 31.126855);
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_zhuo_tianditu_select = resolveEasycom(vue.resolveDynamicComponent("zhuo-tianditu-select"), __easycom_0);
    return vue.openBlock(), vue.createElementBlock("view", { class: "content" }, [
      vue.createElementVNode("view", { style: { "height": "47px" } }),
      vue.createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.selectMap && $options.selectMap(...args))
      }, " 选择位置 "),
      $data.point.address ? (vue.openBlock(), vue.createElementBlock("view", { key: 0 }, [
        vue.createElementVNode(
          "view",
          null,
          "address: " + vue.toDisplayString($data.point.address),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "view",
          null,
          "lon: " + vue.toDisplayString($data.point.location.lon),
          1
          /* TEXT */
        ),
        vue.createElementVNode(
          "view",
          null,
          "lat: " + vue.toDisplayString($data.point.location.lat),
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createCommentVNode(" 天地图使用示例 "),
      vue.createVNode(_component_zhuo_tianditu_select, {
        ref: "tMap",
        search: true,
        icon: $data.icon,
        searchType: 0,
        "api-key": "e122b0518f43b32dcc256edbae20a5d1",
        onOnLoad: $options.onLoad,
        onOnSelect: $options.onSelect
      }, {
        default: vue.withCtx(() => [
          vue.createCommentVNode(" 自定义cardList样式 事件有绑定，自己写样式即可 "),
          vue.createCommentVNode(' <template v-slot:cards="{row, index}">{{row.address}}</template> ')
        ]),
        _: 1
        /* STABLE */
      }, 8, ["icon", "onOnLoad", "onOnSelect"])
    ]);
  }
  const PagesIndexIndex = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render], ["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/pages/index/index.vue"]]);
  __definePage("pages/index/index", PagesIndexIndex);
  const _sfc_main = {
    onLaunch: function() {
      formatAppLog("log", "at App.vue:4", "App Launch");
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:7", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:10", "App Hide");
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__file", "/Users/shidianzhuo/Hello/HBuilderProjects/tianditu-plugin/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
