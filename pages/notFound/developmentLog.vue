<script setup>
    import {
        onBeforeMount,
    } from 'vue'
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()

    onBeforeMount(() => {
        atf.initHeader(100, {
            main: '404 Not Found',
            sub: '未发现请求资源'
        })
    })
</script>

<template>
</template>

<style>

</style>