<template>
    <view id="mapDiv"></view>
</template>

<script>
    import tools from '../../tools.js'
    import iconPath from '../../static/point.png'
    export default {
        data() {
            return {
                Tmap: null
            }
        },
        props: {
            apiKey: {
                type: String,
                require: true,
                default: ''
            },
            customIcon: {
                type: String,
                default: ''
            }
        },
        destroyed() {
            // this.Tmap = null
        },
        methods: {
            initCharts(lng, lat) {
                var that = this;
                this.Tmap = new T.Map('mapDiv', {
                    projection: 'EPSG:4326',
                });
                this.Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
                that.nextPoint({
                    lng,
                    lat
                })
                this.Tmap.addEventListener('click', (e) => {
                    that.nextPoint(e.lnglat)
                });
            },
            upDataCharts(lng, lat) {
                this.setIcon(lng, lat, true)
                this.Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
            },
            setIcon(lng, lat, isClear) {
                if (isClear) {
                    this.Tmap.clearOverLays()
                }
                const icon = new T.Icon({
                    iconUrl: this.customIcon || iconPath,
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
                        ver: 1,
                    }),
                    type: 'geocode',
                    tk: that.apiKey
                }
                let resData = await tools.createRequest('https://api.tianditu.gov.cn/geocoder', params, true)
                if (resData.status === '0') {
                    this.setIcon(lnglat.lng, lnglat.lat, true)
                    const info = tools.formatterAdressLocation(resData.result, 1)
                    this.$emit('onSelect', info)
                } else {
                    tools.createMessage('数据异常', 1000, false, 'error')
                }
            },
        }
    }
</script>

<style scoped>
    #mapDiv {
        width: 100%;
        height: 100%;
    }

    /deep/ .tdt-control-copyright {
        display: none;
    }
</style>