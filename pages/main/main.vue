<script setup>
    import Header from './header.vue'
    import Footer from './footer.vue'
    import popUps from './popUps'
    import Nav from './nav'
    import {
        nextTick,
        ref,
        onMounted,
        watch,
        onBeforeMount,
        onErrorCaptured
    } from "vue"
    import {
        useRoute
    } from 'vue-router';
    const route = useRoute()
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const PopUps = usePopUpsStore()
    import {
        useThemeStore
    } from '/stores/theme.js'
    const theme = useThemeStore()
    import {
        useWindowStore
    } from '/stores/window.js'
    const Window = useWindowStore()
    import {
        useWebInfoStore
    } from '/stores/webInfo.js'
    const webInfo = useWebInfoStore()

    onBeforeMount(() => {
        theme.switchTheme(localStorage.getItem('theme') || 'dark')
        webInfo.getData()
        user.signIn()
    })

    onMounted(() => {
        PopUps.callPopUps(['aft'])
        window.onresize = () => {
            Window.changeWindow()
        }
        window.addEventListener('scroll', (e) => {
            Window.scrollPosition = document.documentElement.scrollTop
        })
        watch(() => Window.windowWidth, () => {
            let fsr = document.documentElement.clientWidth;
            if (fsr > 1500)
                fsr = 1500
            document.getElementsByTagName("html")[0].style.fontSize = Math.sqrt(fsr) / 1.75 + 'px'
        }, {
            immediate: true
        })
        watch(() => route.path, (n) => {
            let routeName = n.split('/')
            routeName.shift()
            Window.route = routeName
        }, {
            immediate: true
        })
    })

    onErrorCaptured((err, instance, info) => {
        console.log(err, instance, info)
    })
</script>

<template>
  <!-- 弹窗组件 -->
  <popUps></popUps>
  <!-- 导航栏 -->
  <Nav></Nav>
  <!-- 欢迎页面 -->
  <Header></Header>
  <!-- 内容页面 -->
  <router-view v-slot="{ Component }">
    <transition name="mainFade" style="--active-enter-time:1s ease-in-out;--active-leave-time:0.25s ease-in">
      <component :is="Component" />
    </transition>
  </router-view>
  <!-- 底部栏 -->
  <Footer></Footer>
</template>

<style>

</style>