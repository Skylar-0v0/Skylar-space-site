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

    let crl = ref({
        show: {
            title: false,
            lead: false,
            bottom: false,
            landscape: true
        },
        style: {
            mainHg: computed(() => {
                return atf.headerHeight + 'vh'
            }),
            bottomPs: computed(() => {
                return (atf.headerHeight * 0.8) + 'vh'
            }),
            bottomHei: computed(() => {
                return (atf.headerHeight / 5) + 'vh'
            }),
            maskBG: '0'
        },
    });

    onMounted(() => {
        // 根据动画进度，首屏页面作出相应的副作用
        let watchAnimation = watch(() => atf.animation.period, (n) => {
            if (n == 1 && Window.route[0] === '') return
            setTimeout(() => {
                crl.value.style.maskBG = '0.3'
            }, 550)
            atf.animation.content = true // 用于提示其他模组作出相应副作用
            crl.value.show.bottom = true
            onWatchPages()
        })
    })

    function onWatchPages() {
        watch(() => Window.route[0], (n) => {
            crl.value.show.lead = (n == '') ? true : false
            crl.value.show.title = (n != 'guestbook') ? true : false
        }, {
            immediate: true
        })
    }

    function To(s) {
        document.getElementById(s).scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }
</script>

<template>
  <!-- 首屏内容  -->
  <!-- id="top" 用于标记位置,让页面回到最顶部 -->
  <div class="atf flex a-c j-c" id="top">
    <div class="position-a" style="top: calc(40vh - 60px);" id="content"></div>
    <div class="position-a" style="top: calc(100vh - 70px);" id="home"></div>
    <!-- 标题 -->
    <transition name="fade">
      <div class="title flex a-c j-c position-a" v-show="crl.show.title">
        <div class="box1 cls-text">
          {{atf.title.main}}
        </div>
        <div class="box2 cls-text">
          {{atf.title.sub}}
        </div>
      </div>
    </transition>
    <!-- 引导箭头 -->
    <transition name="fade">
      <div class="cls-text pointer icons flex column" v-show="crl.show.lead" @click="To('home')">
        <svg class="icon pointer" viewBox="0 0 1024 1024" width="30" height="30">
          <path class="cls-text"
            d="M483.072 714.496l30.165333 30.208 415.957334-415.829333a42.837333 42.837333 0 0 0 0-60.288 42.538667 42.538667 0 0 0-60.330667-0.042667l-355.541333 355.413333-355.242667-355.413333a42.496 42.496 0 0 0-60.288 0 42.837333 42.837333 0 0 0-0.085333 60.330667l383.701333 383.872 1.706667 1.749333z"
            p-id="7363"></path>
        </svg>
        <svg class="icon pointer" style="transform:translateY(-10px);animation-delay: 0.15s" viewBox="0 0 1024 1024"
          width="30" height="30">
          <path class="cls-text"
            d="M483.072 714.496l30.165333 30.208 415.957334-415.829333a42.837333 42.837333 0 0 0 0-60.288 42.538667 42.538667 0 0 0-60.330667-0.042667l-355.541333 355.413333-355.242667-355.413333a42.496 42.496 0 0 0-60.288 0 42.837333 42.837333 0 0 0-0.085333 60.330667l383.701333 383.872 1.706667 1.749333z"
            p-id="7363"></path>
        </svg>
      </div>
    </transition>
    <!-- 底部波浪 -->
    <transition name="fade">
      <img class="bottom position-a" v-show="crl.show.bottom" src="/static/wave.png">
    </transition>
  </div>

</template>

<style scoped>
    @import '../main.css';
    .atf {
        background-image: var(--atf-background-img);
        height: v-bind('crl.style.mainHg');
        width: 100%;
        background-position: 50% 0;
        background-repeat: no-repeat;
        background-size: cover;
        flex-direction: column;
        transition: 1.25s ease;
        z-index: -2;
    }
    
    .atf::before {
        position: absolute;
        content: "";
        display: block;
        height: v-bind('crl.style.mainHg');
        width: 100%;
        background-color: #1d1d1d;
        opacity: v-bind('crl.style.maskBG');
        transition: 1.25s ease;
        z-index: 1;
    }
    
    .bottom {
        transition: 1.25s ease;
        height: v-bind('crl.style.bottomHei');
        top: v-bind('crl.style.bottomPs');
        filter: var(--atf-bottom-filter);
        width: 100%;
        margin-top: auto;
        z-index: 0;
    }
    
    .cls-text {
        color: var(--color-atf-font);
        fill: var(--color-atf-font);
    }
    
    .title {
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 2;
    }
    
    .box1 {
        text-align: center;
        display: flex;
        font-size: 2rem;
        justify-content: center;
        align-items: center;
    }
    
    .box2 {
        text-align: center;
        margin-top: 10px;
        font-size: 1.5rem;
    }
    
    .icons {
        margin-top: auto;
        margin-bottom: 1%;
        z-index: 2;
    }
    
    .icon {
        animation: icon 2s ease infinite;
        z-index: 2;
    }
    
    @keyframes icon {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }
    
    .fade-enter-active {
        transition: 2s ease;
    }
    
    .fade-leave-active {
        transition: 0.75s ease;
    }
    
    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>