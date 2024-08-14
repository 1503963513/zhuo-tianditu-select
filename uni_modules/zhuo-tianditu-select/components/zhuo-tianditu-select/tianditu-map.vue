<template>
    <view style="width: 100%;height: 100%;">
        <view id="mapDiv" class="mapDiv" :apikey="apiKey" :prop="option" :change:prop="Trenderjs.initTMap"></view>
    </view>
</template>

<script>
    import tools from '../../tools.js'
    import iconPath from '../../static/point.png'
    export default {
        name: 'TianDiTu-Map',
        data() {
            return {
                Tmap: null,
                option: {
                    type: '',
                    apikey: '',
                    lng: '',
                    lat: '',
                    png: iconPath
                }
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
        methods: {
            compliteonLoadTianDiTu() {
                this.$emit('onLoadTianDiTu')
            },
            initCharts(lng, lat) {
                this.option = {
                    apikey: this.apiKey,
                    lng,
                    lat,
                    png: this.customIcon || this.option.png,
                    type: 'open'
                }
            },
            upDataCharts(lng, lat) {
                this.option = {
                    ...this.option,
                    type: 'Icon',
                    lng,
                    lat,
                    png: this.customIcon || this.option.png,
                    type: 'update'
                }
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
                    const info = tools.formatterAdressLocation(resData.result, 1)
                    this.option = {
                        ...this.option,
                        apikey: this.apiKey,
                        lng: lnglat.lng,
                        lat: lnglat.lat,
                        png: this.customIcon || this.option.png,
                        type: 'update'
                    }
                    this.$emit('onSelect', info)
                } else {
                    tools.createMessage('数据异常', 1000, false, 'error')
                }
            },
        }
    }
</script>


<script module="Trenderjs" lang="renderjs">
    var Tmap = null;
    export default {
        data() {
            return {
                options: {},
            }
        },
        mounted() {
            // if (typeof window.T === 'object') {
            //     console.warn('--------天地图已加载--------');
            // } else {
            //     if (this.apiKey) {
            //         const script = document.createElement('script')
            //         script.src = 'http://api.tianditu.gov.cn/api?v=4.0&tk=' + this.apiKey
            //         script.onload = this.initChartsRender.bind(this)
            //         document.head.appendChild(script)
            //     }
            // }
        },
        methods: {
            initTMap(newValue, oldValue, ownerInstance, instance) {
                this.options = newValue
                if (newValue.type === 'open' && newValue.apikey) {
                    if (!window.T) {
                        const script = document.createElement('script')
                        script.src = 'http://api.tianditu.gov.cn/api?v=4.0&tk=' + this.options.apikey
                        script.onload = this.initChartsRender.bind(this)
                        document.head.appendChild(script)
                    } else {
                        const {
                            lng,
                            lat
                        } = this.options
                        Tmap = null;
                        Tmap = new T.Map('mapDiv', {
                            projection: 'EPSG:4326',
                        });
                        Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
                        this.setIcon(lng, lat, true)
                        this.$ownerInstance.callMethod('nextPoint', {
                            lng,
                            lat
                        })
                        Tmap.addEventListener('click', (e) => {
                            this.$ownerInstance.callMethod('nextPoint', e.lnglat)
                        });
                    }
                } else {
                    const {
                        lng,
                        lat
                    } = newValue
                    this.upDataChartsRender(lng, lat)
                }
            },
            initChartsRender() {
                this.$ownerInstance.callMethod('compliteonLoadTianDiTu')
                const {
                    lng,
                    lat
                } = this.options
                var that = this;
                Tmap = new T.Map('mapDiv', {
                    projection: 'EPSG:4326',
                });
                Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
                this.setIcon(lng, lat, true)
                this.$ownerInstance.callMethod('nextPoint', {
                    lng,
                    lat
                })
                Tmap.addEventListener('click', (e) => {
                    this.$ownerInstance.callMethod('nextPoint', e.lnglat)
                });
            },
            upDataChartsRender(lng, lat) {
                if (!Tmap) return
                this.setIcon(lng, lat, true)
                Tmap.centerAndZoom(new T.LngLat(lng, lat), 15);
            },
            setIcon(lng, lat, isClear) {
                if (isClear) {
                    Tmap.clearOverLays()
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
            },
        },
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