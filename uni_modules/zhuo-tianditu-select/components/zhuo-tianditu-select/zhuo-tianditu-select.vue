<template>
    <view>
        <view v-if="visible" class="mask" :style="{ height: (winHeight)+ 'px',width: winWidth+'px',top: winTop+'px'}">
            <tiandituSearchVue :showSearch="search"
                :style="{ height: iStatusBarHeight ?  iStatusBarHeight + 'px' : 'fitcontent', paddingTop: iStatusBarHeight ?  '20px' : '0' }"
                @onSearch="tianidtuSearch" :searchType="searchType" @onClose="close" @onConfirm="onConfirm">
            </tiandituSearchVue>
            <tiandituMap ref="tiandituMapRefs" @onLoadTianDiTu="initMaps" @onSelect="selectPoint" :apiKey="apiKey"
                :customIcon="icon">
            </tiandituMap>
            <!-- footer -->
            <view class="list-boxd" ref="listBox" :style="{minHeight: domMinHeight, maxHeight: domMaxHeight}">
                <view class="list-header" @touchstart="start" @touchend="end"></view>
                <view class="list-content">
                    <view v-for="(item, index) in datalist" :key="index" @click="selectCard(item)">
                        <!-- #ifdef MP-WEIXIN -->
                        <slot name="cards" :row="item" :index="selectItem"></slot>
                        <!-- #endif -->
                        <!-- #ifdef H5  -->
                        <slot name="cards" :row="item" :index="selectItem" @click="selectCard(item)"></slot>
                        <!-- #endif -->
                        <!-- #ifdef APP  -->
                        <slot name="cards" :row="item" :index="selectItem" @click="selectCard(item)"></slot>
                        <!-- #endif -->
                        <view class="card"
                            :style="{background: item.address === selectItem.address ?'#f3f4f6' :'#FFFFFF'}"
                            v-if="!$slots.cards">
                            <view class="card-left">
                                <view class="card-title">{{item.address}}{{item.name && `(${item.name})`}}</view>
                                <view class="card-text">({{item.location.lon}},{{item.location.lat}})</view>
                            </view>
                            <view class="card-right">
                                <view class="arrow"></view>
                            </view>
                        </view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    import tiandituMap from './tianditu-map.vue'
    import tiandituSearchVue from './tianditu-search.vue'
    import tools from '../../tools.js'
    export default {
        name: 'zhuozhuoTiandituPlugin',
        components: {
            tiandituMap,
            tiandituSearchVue,
        },
        props: {
            apiKey: {
                type: String,
                require: true,
                default: ''
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
                default: ''
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
                domMaxHeight: '50vh',
                domMinHeight: '0vh',
                selectItem: {},
                iStatusBarHeight: 0,
                option: {
                    apikey: 123123,
                }
            }
        },
        created() {
            var that = this
            // #ifdef APP
            // 44 + 10 44: search Input height
            const searchHeight = this.search ? 54 : 10
            const {
                statusBarHeight,
                screenHeight,
                windowHeight
            } = uni.getSystemInfoSync()
            if (screenHeight === windowHeight) {
                that.iStatusBarHeight = statusBarHeight + searchHeight;
            } else {
                that.iStatusBarHeight = 0;
            }
            // #endif
            uni.getSystemInfo({
                success: function(res) {
                    that.winWidth = res.windowWidth
                    that.winHeight = res.windowHeight
                    that.winTop = res.windowTop
                }
            });
        },
        methods: {
            open(lon, lat) {
                if (lon && lat) {
                    this.visible = true
                    this.$nextTick(() => {
                        this.$refs.tiandituMapRefs.initCharts(lon, lat)
                    })
                } else {
                    console.error('请传入lon, lat')
                }

            },
            close() {
                this.visible = false
            },
            onConfirm() {
                if (Object.keys(this.selectItem).length) {
                    this.visible = false
                    this.$emit('onSelect', this.selectItem)
                } else {
                    tools.createMessage('请选择位置')
                }
            },
            upDateLonLat(lon, lat) {
                if (lon && lat) {
                    this.$refs.tiandituMapRefs.upDataCharts(lon, lat)
                } else {
                    console.error('请传入lon, lat')
                }
            },
            tianidtuSearch(value) {
                if (value.city) {
                    this.cityInfoSearch(value)
                } else {
                    this.infoSearch(value)
                }
            },
            async infoSearch(value) { // 地理编码查询
                let params = {
                    ds: {
                        "keyWord": value.keyword,
                    },
                    tk: this.apiKey,
                }
                let resData = await tools.createRequest('http://api.tianditu.gov.cn/geocoder', params, true)
                if (resData.status === '0') {
                    const location = resData.location
                    const formateOne = tools.formatterAdressLocation(resData, 3)
                    this.datalist = [formateOne]
                    this.selectItem = datalist
                    this.$refs.tiandituMapRefs.upDataCharts(location.lon, location.lat)
                }
            },
            async cityInfoSearch(value) { // 地名搜索2.0
                let params = {
                    postStr: {
                        "keyWord": value.keyword,
                        "queryType": 12,
                        "start": 0,
                        "count": 10,
                        "specify": value.city.value
                    },
                    type: 'query',
                    tk: this.apiKey,
                }
                let resData = await tools.createRequest('http://api.tianditu.gov.cn/v2/search', params, true)
                if (resData.status.infocode === 1000) {
                    const {
                        pois: aPoints,
                        count
                    } = resData
                    if (count === '0' || !aPoints || !aPoints.length) {
                        return tools.createMessage('没有找到该地址')
                    }
                    const {
                        pois,
                        keyWord,
                        lonlat
                    } = aPoints[0]
                    const formateData = aPoints.map((item) => tools.formatterAdressLocation(item, 2))
                    this.datalist = formateData
                    this.selectItem = formateData[0]
                    const [lon, lat] = lonlat.split(',')
                    this.$refs.tiandituMapRefs.upDataCharts(lon, lat)
                } else {
                    tools.createMessage('数据异常', 1000, false, 'error')
                }
            },
            selectListItem(item) {
                this.$refs.tiandituMapRefs.upDataCharts(item.location.lon, item.location.lat)
            },
            selectPoint(e) {
                this.domMinHeight = '0vh'
                this.datalist = [e]
                this.selectItem = e
            },
            initMaps() {
                this.$emit('onLoad')
                console.warn('--------天地图加载完成--------');
            },
            start(e) {
                const clientY = e.changedTouches[0].clientY
                this.startY = clientY
            },
            end(e) {
                const transformY = e.changedTouches[0].clientY - this.startY;
                switch (true) {
                    case transformY > 50:
                        console.log('下划')
                        this.domMaxHeight = '20vh'
                        this.domMinHeight = '0vh'
                        break;
                    case transformY < -50:
                        console.log('上划')
                        this.domMaxHeight = '50vh'
                        this.domMinHeight = '50vh'
                        break;
                    default:
                        break;
                }

            },
            selectCard(item) {
                this.domMaxHeight = '20vh'
                this.domMinHeight = '0vh'
                this.selectItem = item
                this.selectListItem(item)
            }
        }
    }
</script>



<style scope>
    .mask {
        /* overflow: hidden; */
        position: fixed;
        left: 0;
        background-color: #FFFFFF;
        z-index: 399;
    }

    /* footer */
    .list-boxd {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 401;
        right: 0;
        border-radius: 14px 14px 0 0;
        background: #FFFFFF;
        transition: all 1s;
    }

    .list-header {
        height: 20px;
        position: relative;
        border-bottom: 1px solid #f3f4f6;
        cursor: pointer;
    }

    .list-header::after {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        content: '';
        height: 6px;
        width: 60px;
        border-top: 1px solid #e8e8e8;
        border-bottom: 1px solid #e8e8e8;
    }

    .list-content {
        max-height: 50vh;
        overflow-y: scroll;
    }

    .card {
        min-height: 44px;
        padding: 12px;
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;

    }

    .card-left {
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .card-right {
        padding-right: 10px;
    }

    .arrow {
        border-top: 2px solid #666666;
        border-right: 2px solid #666666;
        width: 10px;
        height: 10px;
        transform: rotate(45deg);
    }


    .card:active {
        background-color: #f3f4f6;
    }


    .card::after {
        position: absolute;
        content: '';
        bottom: 0;
        height: 1px;
        background-color: #e8e8e8;
        width: 90%;
    }

    .card:last-child::after {
        height: 0;
        background-color: #FFFFFF;
    }

    .card-title {
        font-size: 18px;
    }

    .card-text {
        color: #e8e8e8;
        font-size: 13px;
    }
</style>