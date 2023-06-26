<script setup>
    import {
        nextTick,
        ref,
        onMounted,
        watch,
        onBeforeMount,
        computed,
        watchEffect
    } from "vue"
    import {
        useWindowStore
    } from '/stores/window.js'
    const Window = useWindowStore()
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()

    let status = ref({
        animation: false,
        maskA: '1',
        arrowL: '-75vh',
        arrowR: '100vw',
        color: 'var(--color-theme-1)',
    });

    // 初始化首屏动画
    onBeforeMount(() => {
        Window.changeWindow()
        if (Window.isLandscape) {
            status.value.arrowL = '-75vh'
        } else {
            status.value.landscape = false
            status.value.arrowL = '-44vh'
        }
    })

    // 首屏动画
    onMounted(() => {
        status.value.animation = true
        setTimeout(() => {
            let l = status.value.arrowL
            status.value.arrowL = '100vw'
            status.value.arrowR = l
        }, 500);
        setTimeout(() => {
            status.value.maskA = '0'
        }, 1150);
        setTimeout(() => {
            atf.animation.period = 1 // 动画一阶段
        }, 1750)
        setTimeout(() => {
            atf.animation.period = 2 // 动画二阶段
        }, 2600)
        setTimeout(() => {
            status.value.animation = false
            atf.animation.period = 3 // 动画三阶段
            popUps.shutPopUps()
        }, 3150)
    })
</script>

<template>
  <!-- 首屏动画 -->
  <div class="aft position-f">
    <div class="mask" v-show="status.animation"></div>
    <div class="arrow" v-show="status.animation">
        <svg class="A a-l" v-if="Window.isLandscape" viewBox="0 0 300.52 400">
        <polygon class="cls-arrow" points="0 0 100.47 0 300.52 200 100.51 400 0 400 200 200 0 0" />
        </svg>
        <svg class="A a-r" v-if="Window.isLandscape" viewBox="0 0 300.52 400">
        <polygon class="cls-arrow" points="100.52 200 300.52 400 200.01 400 0 200 200.05 0 300.52 0 100.52 200" />
        </svg>
        <svg class="A a-l" v-if="!Window.isLandscape" viewBox="0 0 169.36 400">
        <polygon class="cls-arrow" points="0 0 33.32 0 98.96 400 65.68 400 0 0" />
        <polygon class="cls-arrow" points="70.4 0 103.72 0 169.36 400 136.08 400 70.4 0" />
        </svg>
        <svg class="A a-r" v-if="!Window.isLandscape" viewBox="0 0 169.36 400">
        <polygon class="cls-arrow" points="103.68 400 70.4 400 136.04 0 169.36 0 103.68 400" />
        <polygon class="cls-arrow" points="33.28 400 0 400 65.64 0 98.96 0 33.28 400" />
        </svg>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .cls-arrow {
        fill: v-bind('status.color');
    }
    
    .aft {
        top: 0;
        width: 100%;
        height: 100vh;
        z-index: 10;
    }
    
    .arrow {
        height: 100vh;
        position: fixed;
        width: 100%;
        padding: 0;
        margin: 0;
        overflow: hidden;
        z-index: 2;
    }
    
    .mask {
        height: 100vh;
        position: fixed;
        width: 100%;
        padding: 0;
        margin: 0;
        background: #1d1d1d;
        opacity: v-bind('status.maskA');
        transition: 2s ease;
        z-index: 2;
    }
    
    .A {
        height: 100%;
        position: absolute;
        transition: 1.25s cubic-bezier(0.42, 0, 0.58, 1.0);
    }
    
    .arrow .a-l {
        transform: translateX(v-bind('status.arrowL'));
    }
    
    .arrow .a-r {
        transform: translateX(v-bind('status.arrowR'));
    }
</style>