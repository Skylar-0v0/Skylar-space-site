<script setup>
    import {
        ref,
        onMounted
    } from 'vue'
    import {
        useWebInfoStore
    } from '/stores/webInfo.js'
    const webInfo = useWebInfoStore()

    onMounted(() => {
        let genesis = new Date('2023/2/10 00:00:00')
        let time = Math.floor((Date.now() - genesis) / 1000)
        runTime.value = Math.floor(time / 86400)
    })

    const crl = ref({
        side: false,
    })

    const runTime = ref(0)

    function To(s) {
        document.getElementById(s).scrollIntoView({
            behavior: "smooth", // 平滑过渡
            block: "start" // 上边框与视窗顶部平齐。默认值
        })
        crl.value.side = false
    }
</script>

<template>
  <svg class="menu pointer" @click="crl.side=true" viewBox="0 0 1024 1024" width="40" height="40">
    <path d="M815.5 309h-458c-17.6 0-32-14.4-32-32s14.4-32 32-32h458c17.6 0 32 14.4 32 32s-14.4 32-32 32z"
      fill="#dbdbdb" p-id="5456"></path>
    <path d="M208.5 277m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#dbdbdb" p-id="5457"></path>
    <path d="M815.5 544h-458c-17.6 0-32-14.4-32-32s14.4-32 32-32h458c17.6 0 32 14.4 32 32s-14.4 32-32 32z"
      fill="#dbdbdb" p-id="5458"></path>
    <path d="M208.5 512m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#dbdbdb" p-id="5459"></path>
    <path d="M815.5 779h-458c-17.6 0-32-14.4-32-32s14.4-32 32-32h458c17.6 0 32 14.4 32 32s-14.4 32-32 32z"
      fill="#dbdbdb" p-id="5460"></path>
    <path d="M208.5 747m-32 0a32 32 0 1 0 64 0 32 32 0 1 0-64 0Z" fill="#dbdbdb" p-id="5461"></path>
  </svg>
  <div class="marks" @click="crl.side = false" v-show="crl.side"></div>
  <transition name="side">
    <div class="side flex column a-c" v-show="crl.side">
      <svg class="exit pointer" @click="crl.side = false" viewBox="0 0 1024 1024" width="30" height="30">
        <path
          d="M862.485 481.154H234.126l203.3-203.3c12.497-12.497 12.497-32.758 0-45.255s-32.758-12.497-45.255 0L135.397 489.373c-12.497 12.497-12.497 32.758 0 45.254l256.774 256.775c6.249 6.248 14.438 9.372 22.627 9.372s16.379-3.124 22.627-9.372c12.497-12.497 12.497-32.759 0-45.255l-203.3-203.301h628.36c17.036 0 30.846-13.81 30.846-30.846s-13.81-30.846-30.846-30.846z"
          fill="#e6e6e6" p-id="7566"></path>
      </svg>
      <div class="box flex a-c column w-100p">
        <img src="/static/logo.png" class="logo">
        <div class="summed flex w-100p">
          <div class="flex column a-c">
            <h3 style="margin-top: 20px;">文章</h3>
            <h4 style="margin-top: 5px;">{{webInfo.data.article}}</h4>
          </div>
          <div class="flex column a-c">
            <h3 style="margin-top: 20px;">留言数</h3>
            <h4 style="margin-top: 5px;">{{webInfo.data.messages_count}}</h4>
          </div>
        </div>
      </div>
      <div class="box fun flex column a-c">
        <p class="box-title">导航</p>
        <router-link @click="To('top')" class="but pointer" to="/">首页</router-link>
        <router-link @click="To('top')" class="but pointer" to="/link">友情链接</router-link>
        <router-link @click="To('top')" class="but pointer" to="/guestbook">留言板</router-link>
      </div>
      <div class="webInfo flex column a-c op-8">
        <div class="flex" style="width: 90%;">
          <uni-icons type="circle-filled" size="23" style="margin-right: 10px;" color="var(--color-theme-1)">
          </uni-icons>
          <h4>站点信息</h4>
        </div>
        <div class="flex" style="margin: 10px 0 0 0;">
          <p style="margin-right: auto;">访问量: </p>
          <p>{{webInfo.data.web_view_count}}</p>
        </div>
        <div class="flex" style="margin: 7px 0 0 0;">
          <p style="margin-right: auto;">用户量: </p>
          <p>{{webInfo.data.user_count}}</p>
        </div>
        <div class="flex" style="margin: 7px 0 10px 0;">
          <p style="margin-right: auto;">已运行：</p>
          <p>{{runTime}} 天</p>
        </div>
      </div>
    </div>
  </transition>
  <div></div>
</template>

<style scoped>
    @import '/pages/main.css';
    * {
        color: var(--color-but-font)
    }
    
    .menu {
        padding-left: 15px;
        padding-right: 15px;
    }
    
    .side {
        position: fixed;
        top: 0;
        width: 300px;
        height: 100vh;
        background: var(--color-bar-1);
        z-index: 5;
    }
    
    .marks {
        width: 100%;
        height: 100vh;
        top: 0;
        z-index: 4;
        position: absolute;
    }
    
    .exit {
        align-self: flex-start;
        margin: 10px;
    }
    
    .box {
        margin: 10px 0 10px 0;
    }
    
    .logo {
        height: 90px;
        border-radius: 50%;
    }
    
    .summed {
        justify-content: space-around;
        margin-bottom: 15px;
    }
    
    .fun {
        width: 90%;
        background: var(--color-nav-box);
        margin-top: 15px;
        border-radius: 15px;
        overflow: hidden;
    }
    
    .box-title {
        align-self: start;
        border-bottom: 1px solid var(--color-but-font);
        opacity: 0.5;
        padding: 7px 20px;
        width: 100%;
    }
    
    .but {
        text-align: center;
        width: 100%;
        padding: 12px;
    }
    
    .user {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 0 10px 0;
    }
    
    .webInfo {
        margin-top: auto;
        margin-left: -20px;
        margin-bottom: 20px;
        height: max-content;
        width: 90%;
    }
    
    .webInfo>* {
        width: 80%;
    }
    
    .side-enter-active,
    .side-leave-active {
        transition: 0.75s ease;
    }
    
    .side-enter-from,
    .side-leave-to {
        transform: translateX(-300px);
    }
</style>