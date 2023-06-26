<script setup>
  import {
    ref,
    watch,
    onMounted,
  } from "vue"
  import {
    useUserStore
  } from '/stores/user.js'
  const user = useUserStore()
  import {
    useWebInfoStore
  } from '/stores/webInfo.js'
  const webInfo = useWebInfoStore()

  onMounted(() => {
    let genesis = new Date('2023/2/10 00:00:00')
    let time = Math.floor((Date.now() - genesis) / 1000)
    runTime.value = Math.floor(time / 86400)
  })

  const runTime = ref(0)
</script>

<template>
  <div class="sidebar flex a-c column">
    <div class="car flex a-c column w-100p">
      <img src="/static/logo.png" class="logo">
      <h2 style="margin-top: 20px;">Skylar</h2>
      <p style="margin-top: 5px;">个人博客</p>
      <div class="summed flex w-100p">
        <div class="flex column a-c">
          <h3 style="margin-top: 20px;">文章</h3>
          <h4 style="margin-top: 15px;">{{webInfo.data.article}}</h4>
        </div>
        <div class="flex column a-c">
          <h3 style="margin-top: 20px;">留言数</h3>
          <h4 style="margin-top: 15px;">{{webInfo.data.messages_count}}</h4>
        </div>
      </div>
    </div>
    <div class="webInfo car flex column a-c">
      <div class="flex" style="margin-top: 20px;width: 90%;">
        <uni-icons type="circle-filled" size="23" style="margin-right: 10px;" color="var(--color-theme-1)"></uni-icons>
        <h4>站点信息</h4>
      </div>
      <div class="flex" style="margin: 20px 0 0 0;">
        <p style="margin-right: auto;">访问量: </p>
        <p>{{webInfo.data.web_view_count}}</p>
      </div>
      <div class="flex" style="margin: 10px 0 0 0;">
        <p style="margin-right: auto;">用户量: </p>
        <p>{{webInfo.data.user_count}}</p>
      </div>
      <div class="flex" style="margin: 10px 0 20px 0;">
        <p style="margin-right: auto;">已运行：</p>
        <p>{{runTime}} 天</p>
      </div>
    </div>
    <transition name="fade">
      <div class="user w-100p car" v-if="user.isLogin">
        <div style="width: 90%;">
          <h2 style="text-align: center;">欢迎{{user.userInfo.nickname}}来到我的空间站点</h2>
          <h3 style="text-align: center;">˗ˋˏ♡ˎˊ˗</h3>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
  @import '../main.css';

  .sidebar {
    margin: 30px 0 0 20px;
    height: max-content;
    min-width: 300px;
    max-width: 300px;
  }

  .logo {
    margin-top: 40px;
    height: 125px;
    border-radius: 50%;
  }

  .summed {
    justify-content: space-around;
    margin-bottom: 30px;
  }

  .user {
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px 0 10px 0;
  }

  .webInfo {
    margin-top: 20px;
    height: max-content;
    width: 100%;
  }

  .webInfo>* {
    width: 80%;
  }

  .icon {
    height: 30px;
    width: 30px;
    margin: 0 15px;
  }
</style>
