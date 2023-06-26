<script setup>
  import {
    ref,
    watch,
    onMounted,
    onBeforeMount,
    nextTick
  } from "vue"
  import log from '../developmentLog/log.vue'

  onBeforeMount(() => {
    uniCloud.database().collection('development-logs').orderBy('createdAt', 'desc').limit(1).get().then(res => {
      text.value = {
        ...res.result.data[0]
      }
      crl.value.logLoaded = true
    })
  })

  onMounted(() => {
    let watchContent = watch(() => crl.value.logLoaded, (n) => {
      if (n) {
        crl.value.main = true
        nextTick(() => {
          watchContent()
        })
      }
    }, {
      immediate: true
    })
  })


  const crl = ref({
    main: false,
    logLoaded: false
  })

  const text = ref({
    log: '',
    createdAt: ''
  })

  function To(s) {
    document.getElementById(s).scrollIntoView({
      behavior: "smooth",
      block: "start"
    })
  }
</script>

<template>
  <transition name="blur">
    <div class="log-contanier car flex a-c j-c" v-show="crl.main">
      <div class="el flex column">
        <div class="flex">
          <h3 class="title" style="margin-right: auto;">开发日志：</h3>
          <router-link @click="To('top')" to="/development-log">
            <p class="pointer" style="color: var(--color-theme-1);">更多</p>
          </router-link>
        </div>
        <log :data="text" style="margin-bottom: 30px;"></log>
      </div>
    </div>
  </transition>
</template>

<style scoped>
  @import '/pages/main.css';

  .log-contanier {
    height: max-content;
    overflow: hidden;
    margin-bottom: 15px;
  }

  .el {
    width: 85%;
  }

  .el>* {
    margin-top: 20px;
  }

  .title {
    margin-left: -2%;
    color: var(--color-theme-1);
  }

  .log-date {
    margin-left: -2%;
    margin-right: 2.5%;
  }

  .log-text {
    padding-left: 2.5%;
    border-left: 1px solid var(--color-line);
  }
</style>
