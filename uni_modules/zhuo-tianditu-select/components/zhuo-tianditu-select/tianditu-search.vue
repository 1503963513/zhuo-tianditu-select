<template>
    <view>
        <view>
            <view class="hearderback">
                <view class="back" @click="close">关 闭</view>
                <view class="confirm" @click="confirm">完 成</view>
            </view>
            <view class="search">
                <view class="search-content">
                    <view class="search-icon" v-if="searchType === 0" @click="visible = true">{{city.label}}</view>
                    <input class="search-input" v-model="keyword" placeholder="请输入详细地址" />
                    <view class="search-btn" @click="searchKeyword">搜索</view>
                </view>
            </view>
        </view>
        <tiandituPopupVue :visible="visible" @onClose="visible = false">
            <view class="search">
                <view class="search-content">
                    <input class="search-input" v-model="inputCity" placeholder="请输入省\市\区" />
                    <view class="search-btn" @click="searchCity">搜索</view>
                </view>
            </view>
            <view class="listBox">
                <view style="display: flex;justify-content: space-between;align-items: center;">
                    <h3 style="margin-bottom: 10px;">历史记录</h3>
                    <view class="clear" @click="clearRcords">清空</view>
                </view>
                <view class="listBox1">
                    <view class="tab-card" v-for="(item,index) in records" @click="selectCity(item)" :key="item.value">
                        {{item.label}}
                    </view>
                </view>
                <view data-text="历史记录" class="divider"></view>
                <view class="listBoxchild">
                    <view class="tab-card" v-for="(item,index) in list1" @click="selectCity(item)" :key="item.value">
                        {{item.label}}
                    </view>
                </view>
            </view>
        </tiandituPopupVue>
    </view>
</template>

<script>
    import tiandituPopupVue from './tianditu-popup.vue'
    import tools from '../../tools.js'
    import dataCityList from '../../cityData.json'
    export default {
        components: {
            tiandituPopupVue
        },
        data() {
            return {
                keyword: '',
                visible: false,
                list1: [],
                records: [],
                storKey: 'tianditu-records-city',
                inputCity: '',
                city: {
                    "label": "德阳市",
                    "value": "156510600"
                },
            }
        },
        props: {
            searchType: {
                type: Number,
                default: 0,
            }
        },
        created() {
            const stor = uni.getStorageSync(this.storKey)
            if (stor && stor.length) {
                this.records = stor
            }
        },
        methods: {
            searchKeyword() {
                if (this.keyword) {
                    let params = {
                        city: this.city,
                        keyword: this.keyword
                    }
                    if (this.searchType === 1) {
                        delete params.city
                    }
                    this.$emit('onSearch', params)
                } else {
                    tools.createMessage('请输入详细地址')
                }
            },
            selectCity(item) {
                if (!this.records.some((zItem) => zItem.value === item.value)) {
                    const arr = [...this.records, item]
                    if (arr.length > 10) {
                        arr.shift()
                    }
                    this.records = arr
                    uni.setStorage({
                        key: this.storKey,
                        data: this.records
                    })
                }
                this.city = item
                this.inputCity = ''
                this.visible = false
            },
            clearRcords() {
                this.records = []
                uni.setStorage({
                    key: this.storKey,
                    data: []
                })
            },
            searchCity() {
                if (this.inputCity) {
                    this.list1 = dataCityList.filter((item) => {
                        const reg = new RegExp(this.inputCity, 'ig')
                        if (reg.test(item.label)) {
                            return true
                        }
                    })
                } else {
                    tools.createMessage('请输入省\市\区关键字')
                }
            },
            close() {
                this.$emit('onClose')
            },
            confirm() {
                this.$emit('onConfirm')
            },
        }
    }
</script>

<style scoped>
    .hearderback {
        display: flex;
        justify-content: space-between;
        padding: 10px 10px 0 10px;
    }

    .back,
    .confirm {
        width: 48px;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        border: 1px solid #e8e8e8;
        text-align: center;
        border-radius: 5px;
    }

    .back:active {
        background-color: #f3f4f6;
        background-color: #f3f4f6;
    }

    .confirm {
        background-color: #006fff;
        border: 1px solid #006fff;
        color: #FFFFFF;
    }

    .confirm:active {
        background-color: #f3f4f6;
        border: 1px solid #f3f4f6;
        color: #333333;
    }

    .search {
        /*   position: absolute;
        left: 0;
        top: 0; */
        width: 100%;
        height: 44px;
        /* z-index: 402; */
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #FFFFFF;
    }

    .search-content {
        width: calc(100% - 24px);
        height: 32px;
        border-radius: 10px;
        padding: 0 5px 0 10px;
        background-color: rgb(242, 242, 242);
        border-radius: 100px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .search-icon {
        margin-right: 5px;
        border-right: 1px solid #bababa;
        padding-right: 5px;
    }

    .search-icon:active {
        color: #666666;
    }

    .search-input {
        flex: 1;
        font-size: 14px;
    }

    .search-btn {
        height: 24px;
        color: #FFFFFF;
        font-size: 14px;
        background-color: rgba(148, 170, 41, 0.7);
        text-align: center;
        line-height: 24px;
        border-radius: 25px;
        padding: 0 8px;
    }

    .search-btn:active {
        background-color: #e8e8e8;
        color: #666666;
    }

    .listBox {
        display: flex;
        flex-direction: column;
        padding: 12px;
        padding-top: 48px;
        max-height: 70vh;
    }

    .listBoxheader {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .listBox1 {
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .listBoxchild {
        flex: 1;
        overflow-y: scroll;
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .tab-card {
        background-color: #e8e8e8;
        padding: 3px 5px;
        font-size: 14px;
        color: #666666;
        height: 20px;
        line-height: 20px;
        text-align: center;
        margin: 4px 6px 4px 4px;
    }

    .clear {
        font-size: #666666;
        font-size: 13px;
    }

    .divider {
        width: 100%;
        border: 1px dashed #e8e8e8;
        position: relative;
        margin: 10px 0;
    }

    .divider::after {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: #FFFFFF;
        padding: 0 10px;
        height: 16px;
        line-height: 16px;
        content: '历史记录';
        font-size: 12px;
        color: rgb(144, 147, 153);
    }
</style>