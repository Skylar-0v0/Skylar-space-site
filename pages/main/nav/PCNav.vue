<script setup>
    import {
        ref,
    } from 'vue'
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()

    let crl = ref({
        show: '',
        email: false
    })

    function To(s) {
        document.getElementById(s).scrollIntoView({
            behavior: "smooth", // 平滑过渡
            block: "start" // 上边框与视窗顶部平齐。默认值
        })
    }
</script>

<template>
  <router-link @click="To('top')" class="luminousBox but pointer" to="/">首页</router-link>
  <router-link @click="To('top')" class="luminousBox but pointer" to="/link">友情链接</router-link>
  <div class="luminousBox but" @mouseenter="crl.show = 'findMe'" @mouseleave="crl.show = ''">其他平台
    <transition name="show">
      <div v-show="crl.show === 'findMe'">
        <div class="findMe luminousBox but" @mouseenter='crl.email = true' @mouseleave='crl.email = false'>
          {{crl.email?'skylar@cyber0101.com':'email'}}
        </div>
        <a href="https://space.bilibili.com/100944589">
          <div class="findMe luminousBox but pointer">BiliBili</div>
        </a>
      </div>
    </transition>
  </div>
  <router-link @click="To('top')" class="luminousBox but pointer" to="/guestbook">留言板</router-link>
  <router-link @click="To('content')" class="luminousBox but pointer" to="/console" v-if="user.isAdmin">控制台
  </router-link>
</template>

<style scoped>
    @import '/pages/main.css';
    * {
        color: var(--color-but-font)
    }
    
    .but {
        height: 100%;
        line-height: 60px;
        text-align: center;
        width: 150px;
        border-right: 1px solid var(--color-line);
    }
    
    .but .but {
        width: 200px;
        line-height: 60px;
        border-right: 0px;
    }
    
    .style img {
        height: 35px;
    }
    
    .findMe {
        background: var(--color-bar-1);
    }
    
    .friend {
        width: 500px;
        height: 700px;
        background: var(--color-bar-1);
        overflow: scroll;
        overflow-x: hidden;
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