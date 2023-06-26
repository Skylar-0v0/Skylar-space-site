<script setup>
    import {
        ref,
        onMounted,
        onBeforeMount,
        watch,
        nextTick
    } from "vue"
    import consoleNav from './consoleNav'
    import config from '/config.js'
    import {
        useRouter
    } from 'vue-router';
    const router = useRouter()
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()

    onBeforeMount(() => {
        atf.initHeader(40, {
            main: config.title.console.main || '控制台',
            sub: config.title.console.sub || 'console'
        })
    })
</script>

<template>
  <div class="console-container">
    <div class="console-car flex">
      <consoleNav></consoleNav>
      <div class="content flex j-c">
        <div class="content-car car">
          <router-view v-slot="{ Component }">
            <transition name="blur" mode="out-in" style="--active-time:0.5s ease-out">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .console-container {
        width: 95%;
        max-width: 1500px;
        height: 85vh;
        min-height: 800px;
        margin: 30px auto;
    }
    
    .console-car {
        width: 100%;
        height: 100%;
        box-shadow: none;
    }
    
    .content {
        height: 100%;
        width: 100%;
        background-color: var(--color-background);
    }
    
    .content-car {
        width: 95%;
        height: 100%;
        overflow: hidden;
    }
</style>