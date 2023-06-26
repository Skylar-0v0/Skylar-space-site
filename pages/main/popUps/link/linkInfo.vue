<script setup>
    import {
        ref,
        onMounted
    } from 'vue'
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()

    const text = ref({
        name: 'Skylar的空间站点',
        content: '正在开往遥远的深空......',
        url: 'https://www.cyber0101.com',
        logo: 'https://www.cyber0101.com/logo.png'
    })

    function copy(text) {
        let cInput = document.createElement("input")
        cInput.value = text
        document.body.appendChild(cInput)
        cInput.select()
        document.execCommand("copy")
        document.body.removeChild(cInput)
        popUps.tip('复制成功', false)
    }
</script>

<template>
  <div class="my-web-info-container flex column a-c">
    <h3 style="margin-bottom: 30px">互链信息</h3>
    <div class="my-web-info flex column" style="margin-bottom: 50px">
      <p style="margin-top:25px;" @click="copy(text.name)">网站名称：{{text.name}}</p>
      <p @click="copy(text.content)">网站介绍：{{text.content}}</p>
      <p @click="copy(text.url)">URL：{{text.url}}</p>
      <p @click="copy(text.logo)">头像URL：{{text.logo}}</p>
      <p class="op-8" style="align-self: center; margin: 0 0 15px 0;">（点击复制）</p>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    @media screen and (min-width:768px) {
        .my-web-info-container {
            width: 490px;
        }
    }
    
    .my-web-info {
        width: 90%;
        border-radius: 1.5rem;
        background-color: var(--color-background-box);
    }
    
    .my-web-info>* {
        margin: 0 20px 35px 30px;
        white-space: normal;
        word-break: break-all;
        word-wrap: break-word;
    }
</style>