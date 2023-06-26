<script setup>
  import {
    ref,
    watch,
    onMounted
  } from 'vue'
  import {
    useRouter
  } from 'vue-router';
  const router = useRouter()
  import {
    usePopUpsStore
  } from '/stores/popUps.js'
  const popUps = usePopUpsStore()
  import {
    useUserStore
  } from '/stores/user.js'
  const user = useUserStore()
  import {
    useThemeStore
  } from '/stores/theme.js'
  const theme = useThemeStore()
  import {
    useWindowStore
  } from '/stores/window.js'
  const Window = useWindowStore()
  import {
    useAtfStore
  } from '/stores/atf.js'
  const atf = useAtfStore()
  import PCNav from './PCNav.vue'
  import PENav from './PENav.vue'

  onMounted(() => {
    let watchContent = watch(() => atf.animation.content, (n) => {
      if (n) {
        crl.value.nav = true
        watchContent()
      }
    })
  })

  let crl = ref({
    nav: false
  })

  function switchTheme() {
    if (theme.displaying == 'light') {
      theme.switchTheme('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      theme.switchTheme('light')
      localStorage.setItem('theme', 'light')
    }
  }

  function toUser() {
    if (!user.isLogin) return popUps.callPopUps(['login'])
    To('top')
    router.push({
      name: 'user'
    })
  }

  function To(s) {
    document.getElementById(s).scrollIntoView({
      behavior: "smooth", // 平滑过渡
      block: "start" // 上边框与视窗顶部平齐。默认值
    })
  }
</script>

<template>
  <teleport to='body'>
    <transition name="show">
      <div class="nav flex a-c" v-show="crl.nav">
        <component :is="Window.windowWidth > 990 ? PCNav : PENav"></component>
        <div class="style flex j-c a-c">
          <img class="pointer" @click="switchTheme"
            :src="theme.displaying=='light'?'/static/light.png':'/static/dark.png'">
        </div>
        <div class="login pointer" @click="toUser">
          {{user.isLogin?user.userInfo.nickname:'登陆'}}
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
  * {
    color: var(--color-but-font)
  }

  .nav {
    height: 60px;
    width: 100%;
    background: var(--color-nav);
    transform: v-bind('crl.nav');
    backdrop-filter: blur(5px);
    transition: 0.5s;
    position: fixed;
    top: 0;
    z-index: 2;
  }

  .style {
    margin-left: auto;
    margin-right: 5%;
    width: 60px;
    height: 100%;
  }

  .style img {
    height: 35px;
  }

  .login {
    line-height: 60px;
    height: 100%;
    padding-left: 2%;
    padding-right: 2%;
    width: max-content;
    text-align: center;
    margin-right: 2vmax;
  }

  .show-enter-active,
  .show-leave-active {
    transition: 1s;
  }

  .show-enter-from,
  .show-leave-to {
    opacity: 0;
  }
</style>
