<script setup>
    import {
        ref,
        onMounted,
        onBeforeMount,
        watch,
        nextTick
    } from "vue"
    import navLink from './navLink.vue'
</script>

<template>
  <div class="nav car flex column">
    <navLink link="" name="网站信息"></navLink>
    <navLink link="article-editor" name="博客编写"></navLink>
    <navLink link="log-writing" name="日志编写"></navLink>
    <navLink link="link-audit" name="友链审核"></navLink>
    <navLink link="messages-manage" name="留言管理"></navLink>
    <navLink link="users-manage" name="用户管理"></navLink>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .nav {
        width: 200px;
        height: 100%;
        overflow: hidden;
    }
</style>