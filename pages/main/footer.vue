<script setup>
    import {
        ref
    } from "vue"
</script>

<template>
  <div class="footer flex column a-c">
    <a class="icp font" href="https://beian.miit.gov.cn/">粤ICP备2022146899号-1</a>
    <div style="margin:0 auto; padding:10px 0;">
      <a class="font" target="_blank" href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=44120302000105"
        style="display:inline-block;text-decoration:none;height:20px;line-height:20px;">
        <img src="/static/beian.png" style="float:left; height: 17px;" />
        <p class="pointer" style="float:left;height:20px;line-height:20px;margin: 0px 0px 0px 5px; color:#939393;">粤公网安备 44120302000105号
        </p>
      </a>
    </div>
  </div>
</template>

<style scoped>
    .footer {
        background: var(--color-bar-2);
        backdrop-filter: blur(5px);
        height: 125px;
        width: 100%;
        padding-top: 20px;
    }
    
    .icp {
        padding: 10px;
    }
    
    .font {
        color: var(--color-font);
        text-decoration: none;
    }
</style>