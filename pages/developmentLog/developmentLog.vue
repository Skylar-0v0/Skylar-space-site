<script setup>
    import {
        watch,
        ref,
        onMounted,
        onBeforeMount,
        nextTick
    } from 'vue'
    import log from './log.vue'
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()

    onBeforeMount(() => {
        atf.initHeader(40, {
            main: '开发日志',
            sub: 'development-logs'
        })
    })

    onMounted(() => {
        uniCloud.database().collection('development-logs').orderBy('createdAt', 'desc').get().then(res => {
            data.value = {
                ...res.result.data
            }
            crl.value.logLoaded = true
        })
        let watchContent = watch([() => crl.value.logLoaded, () => atf.animation.content], ([n1, n2]) => {
            if (n1 && n2) {
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

    const data = ref({})
</script>

<template>
  <div class="pageContainer">
    <transition name="blur">
      <div class="car" v-show="crl.main">
        <div v-for="item in data" class="flex column a-c">
          <log :data="item"></log>
        </div>
      </div>
    </transition>
  </div>

</template>

<style>
    @import '../main.css';
    .car {
        padding-top: 45px;
    }
</style>