/**
 * @param title  String，提示的内容
 * @param duration  String，提示的延迟时间，单位毫秒，默认：1500
 * @param mask  Boolean，是否显示透明蒙层，防止触摸穿透，默认：false
 * @param icon  String，图标：success、error、fail、exception、loading、none，默认：none
 **/
export function createMessage(title, duration = 1500, mask = false, icon = "none") {
    uni.showToast({
        title,
        duration: duration,
        mask,
        icon
    });
}

/**
 * @param url  String，请求的地址，默认：none
 * @param data  Object，请求的参数，默认：{}
 * @param method  String，请求的方式，默认：GET
 * @param loading  Boolean，是否需要loading ，默认：false
 * @param header  Object，headers，默认：{}
 * @returns promise
 **/
export function createRequest(url, data = {}, loading = false, method = 'GET', header = {}) {
    if (loading) {
        uni.showLoading({
            title: '请稍后',
            mask: true
        })
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: url,
            method: method,
            data: data,
            header: header,
            success: res => {
                if (res.statusCode === 200) {
                    resolve(res.data)
                } else {
                    reject(new Error('请求错位'))
                }
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                uni.hideLoading();
            }
        });
    })
}

/**
 * 数据格式化
 * @param obj  Object，响应的数据
 * @param type  Number 0 ｜ 1，处理类型
 * @returns Object {address = string, name = string, location = {lon, lat }, infomation = {}}
 */
export function formatterAdressLocation(obj, type) {
    switch (type) {
        case 1:
            return {
                address: obj.formatted_address,
                    name: '',
                    location: obj.location,
                    infomation: obj.addressComponent
            }
            break;
        case 2:
            const [lon, lat] = obj.lonlat.split(',')
            return {
                address: obj.address,
                    name: obj.name,
                    location: {
                        lon,
                        lat
                    },
                    infomation: obj
            }
            break
        case 3:
            return {
                address: obj.location.keyWord,
                    name: '',
                    location: {
                        lon: obj.location.lon,
                        lat: obj.location.lat,
                    },
                    infomation: obj.location
            }
        default:
            break;
    }
}
export default {
    createMessage,
    createRequest,
    formatterAdressLocation
}