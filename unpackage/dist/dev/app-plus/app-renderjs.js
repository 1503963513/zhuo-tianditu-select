var __renderjsModules={};

__renderjsModules["3573ec8f"] = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // <stdin>
  var stdin_exports = {};
  __export(stdin_exports, {
    default: () => stdin_default
  });
  var Tmap = null;
  var stdin_default = {
    data() {
      return {
        options: {}
      };
    },
    mounted() {
    },
    methods: {
      initTMap(newValue, oldValue, ownerInstance, instance) {
        this.options = newValue;
        if (newValue.type === "open" && newValue.apikey) {
          if (!window.T) {
            const script = document.createElement("script");
            script.src = "http://api.tianditu.gov.cn/api?v=4.0&tk=" + this.options.apikey;
            script.onload = this.initChartsRender.bind(this);
            document.head.appendChild(script);
          } else {
            const {
              lng,
              lat
            } = this.options;
            Tmap = null;
            Tmap = new T.Map("mapDiv", {
              projection: "EPSG:4326"
            });
            Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
            this.setIcon(lng, lat, true);
            this.$ownerInstance.callMethod("nextPoint", {
              lng,
              lat
            });
            Tmap.addEventListener("click", (e) => {
              this.$ownerInstance.callMethod("nextPoint", e.lnglat);
            });
          }
        } else {
          const {
            lng,
            lat
          } = newValue;
          this.upDataChartsRender(lng, lat);
        }
      },
      initChartsRender() {
        this.$ownerInstance.callMethod("compliteonLoadTianDiTu");
        const {
          lng,
          lat
        } = this.options;
        var that = this;
        Tmap = new T.Map("mapDiv", {
          projection: "EPSG:4326"
        });
        Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
        this.setIcon(lng, lat, true);
        this.$ownerInstance.callMethod("nextPoint", {
          lng,
          lat
        });
        Tmap.addEventListener("click", (e) => {
          this.$ownerInstance.callMethod("nextPoint", e.lnglat);
        });
      },
      upDataChartsRender(lng, lat) {
        if (!Tmap)
          return;
        this.setIcon(lng, lat, true);
        Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
      },
      setIcon(lng, lat, isClear) {
        if (isClear) {
          Tmap.clearOverLays();
        }
        const icon = new T.Icon({
          iconUrl: this.options.png,
          iconSize: new T.Point(30, 30),
          iconAnchor: new T.Point(15, 30)
        });
        const marker = new T.Marker(new T.LngLat(lng, lat), {
          icon
        });
        Tmap.addOverLay(marker);
      }
    }
  };
  return __toCommonJS(stdin_exports);
})();
