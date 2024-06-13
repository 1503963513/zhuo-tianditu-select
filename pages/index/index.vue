<template>
    <view class="content">
        <button @click="selectMap"> 选择地图 </button>
        <view v-if="point.address">
            <view>address: {{point.address}}</view>
            <view>lon: {{point.location.lon}}</view>
            <view>lat: {{point.location.lat}}</view>
        </view>
        <!-- 天地图使用示例 -->
        <zhuo-tianditu-select ref="tMap" :icon="icon" :searchType="0" api-key="e122b0518f43b32dcc256edbae20a5d1"
            @onLoad="onLoad" @onSelect="onSelect">
            <!-- 自定义cardList样式 事件有绑定，自己写样式即可 -->
            <!-- <template v-slot:cards="{row, index}">{{row.address}}</template> -->
        </zhuo-tianditu-select>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                icon: null,
                point: {},
            }
        },
        onLoad() {
            // 自定义图片
            const that = this
            uni.getImageInfo({
                src: '../../static/position.png',
                success(res) {
                    that.icon = res.path
                },
            })
        },
        mounted() {},
        methods: {
            onLoad() {
                console.log('天地图加载完成')
            },
            onSelect(value) {
                this.point = value
            },
            selectMap() {
                // uni.getLocation({
                //     type: 'wgs84',
                //     success: function(res) {
                //         console.log('当前位置的经度：' + res.longitude);
                //         console.log('当前位置的纬度：' + res.latitude);
                //         that.$refs.tMap.open(res.longitude, res.latitude);
                //     },
                //     fail: function(err) {
                //         console.log('获取失败');
                //     },
                // });
                this.$refs.tMap.open(104.397894, 31.126855)
            }
        }
    }
</script>

<style>

</style>