"use strict";
const common_vendor = require("../../common/vendor.js");
function createMessage(title, duration = 1500, mask = false, icon = "none") {
  common_vendor.index.showToast({
    title,
    duration,
    mask,
    icon
  });
}
function createRequest(url, data = {}, loading = false, method = "GET", header = {}) {
  if (loading) {
    common_vendor.index.showLoading({
      title: "请稍后",
      mask: true
    });
  }
  return new Promise((resolve, reject) => {
    common_vendor.index.request({
      url,
      method,
      data,
      header,
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(new Error("请求错位"));
        }
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        common_vendor.index.hideLoading();
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
exports.tools = tools;
