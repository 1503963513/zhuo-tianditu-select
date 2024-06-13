<template>
    <view v-if="visible" class="tianditu-popop"
        :style="{ height: (winHeight)+ 'px',width: winWidth+'px',top: winTop+'px'}">
        <view class="popup-header" @click="close">
            <slot name="header"></slot>
        </view>
        <view class="popup-content fadeInUp animated">
            <slot></slot>
        </view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                winWidth: 0,
                winHeight: 0,
                winTop: 0,
            }
        },
        props: {
            visible: {
                type: Boolean,
                require: true,
                default: false
            }
        },
        created() {
            var that = this
            uni.getSystemInfo({
                success: function(res) {
                    that.winWidth = res.windowWidth
                    that.winHeight = res.windowHeight
                    that.winTop = res.windowTop
                }
            });
        },
        methods: {
            close(e) {
                this.$emit('onClose')
            }
        }
    }
</script>

<style scoped>
    .tianditu-popop {
        position: fixed;
        left: 0;
        z-index: 403;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        flex-direction: column;
    }

    .popup-header {
        flex: 1;
    }

    .popup-content {
        background-color: #FFFFFF;
        min-height: 300px;
        width: 100%;
        /*     position: absolute;
        bottom: 0;
        left: 0; */
    }

    /*base code*/
    .animated {
        -webkit-animation-duration: 1s;
        animation-duration: 1s;
        -webkit-animation-fill-mode: both;
        animation-fill-mode: both;
    }

    .animated.infinite {
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
    }

    .animated.hinge {
        -webkit-animation-duration: 2s;
        animation-duration: 2s;
    }

    @keyframes fadeInUp {
        0% {
            opacity: 0;
            -webkit-transform: translate3d(0, 100%, 0);
            -ms-transform: translate3d(0, 100%, 0);
            transform: translate3d(0, 100%, 0)
        }

        100% {
            opacity: 1;
            -webkit-transform: none;
            -ms-transform: none;
            transform: none
        }
    }

    .fadeInUp {
        -webkit-animation-name: fadeInUp;
        animation-name: fadeInUp
    }
</style>