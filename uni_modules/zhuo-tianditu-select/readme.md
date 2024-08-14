## 天地图位置选择
>  **组件名：zhuo-tianditu-select**

### 安装方式

`HBuilderX 2.5.5`，只需将本组件导入项目，在页面`template`中即可直接使用，无需在页面中`import`和注册`components`

**开发不易，如果帮助到你的，请支持 有问题请留言，作者会积极更新**

### 基本用法

```html
    <!-- 天地图使用示例 -->
<zhuo-tianditu-select ref="tMap"api-key="******"></zhuo-tianditu-select>
```



### Props

| 参数       | **说明**                               | **类型**        | **默认值** | 可选值 |
| ---------- | -------------------------------------- | --------------- | ---------- | ------ |
| apiKey     | 天地图密钥                             | 必填 ｜ Stirng  | ''         | 无     |
| icon       | 自定义图标 （App必填）                 | 可选 ｜ Stirng  | ''         | 无     |
| searchType | 搜索方式，0：地名搜索，1：地理编码查询 | 可选 ｜ Number  | 0          | 0 \| 1 |
| search     | 开启关闭搜索                           | 可选 ｜ Boolean | true       | 无     |



### Events

| **事件名** | **说明**                     | 回调参数      |
| ---------- | ---------------------------- | ------------- |
| onLoad     | 天地图资源加载完成触发此事件 | 无            |
| onSelect   | 点击完成按钮触发此事件       | value：内容值 |



### Methods

| 方法名       | 说明               | 参数                |
| ------------ | ------------------ | ------------------- |
| open         | 打开地图位置选择器 | 必填 ｜（lon, lat） |
| close        | 关闭地图位置选择器 | 无                  |
| upDateLonLat | 设置中心点坐标     | 必填 ｜（lon, lat） |

```js
// 打开地图
this.$refs.tMap.open(104.397894, 31.126855)
// 关闭地图
this.$refs.tMap.close()
// 设置中心点
this.$refs.tMap.open(103.397894, 32.126855)
```



###  Slots

| 名称  | **说明**                                                 | 参数                                |
| ----- | -------------------------------------------------------- | ----------------------------------- |
| cards | 搜索列表、自定义样式（自动绑定事件，只需自己写样式即可） | Row： 当前行数据；index：当前选中行 |

```html
 <template v-slot:cards="{row, index}">{{row.address}}</template> 
```



### 示列代码

### vue2

```vue
<template>
    <view class="content">
        <button @click="selectMap"> 选择地图 </button>
        <view v-if="point.address">
            <view>address: {{point.address}}</view>
            <view>lon: {{point.location.lon}}</view>
            <view>lat: {{point.location.lat}}</view>
        </view>
        <!-- 天地图使用示例 -->
        <zhuo-tianditu-select ref="tMap" :icon="icon" :searchType="0" api-key="******"
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
```

### Vue3:

```vue
<template>
    <view class="content">
        <button @click="selectMap"> 选择地图 </button>
        <!-- 天地图使用示例 -->
        <zhuo-tianditu-select ref="tMap" :icon="state.icon" :searchType="0" api-key="******">
        </zhuo-tianditu-select>
    </view>
</template>

<script setup>
    import {
        ref,
        reactive
    } from "vue";
    const tMap = ref()
    const state = reactive({
        icon: ''
    })
    const selectMap = () => {
        tMap.value.open(104.397894, 31.126855)
    };
</script>
```

