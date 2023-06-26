<script setup>
    import {
        ref,
        onMounted,
        onBeforeMount,
        watch,
        nextTick
    } from "vue"
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()

    onBeforeMount(() => {
        atf.initHeader(40, {
            main: '这里是Skylar的空间站点',
            sub: 'welcome to my utopia'
        })
    })

    function Link() {
        if (!user.isLogin) return popUps.callPopUps(['login'])
        if (!user.userInfo.link) return popUps.callPopUps(['link', 'linkFiled'], {
            type: 'add'
        })
        window.open(user.link.url, "_blank")
    }
</script>

<template>
  <div class="pageContainer">
    <button class="add-link-but position-f" @click="Link()">{{user.isLogin?user.userInfo.link?'我的博客':'添加链接':'登陆后可添加自己的博客链接'}}</button>
    <div class="title flex a-c j-c">
      <h1>友情链接</h1>
    </div>
    <div class="container flex j-c">
      <unicloud-db v-slot:default="{data, loading, error, options}" collection="link">
        <view v-if="error">
          <div class="link item flex a-c j-c">
            <h3 style="cursor: default;">{{error.message}}</h3>
          </div>
        </view>
        <view v-else-if="loading">
          <div class="link item flex a-c j-c">
            <h3 style="cursor: default;">加载中.....</h3>
          </div>
        </view>
        <view v-else>
          <div class="container flex j-c">
            <div v-for="i in data" :key="i._id">
              <a :href="i.url" class="item link flex a-c j-c pointer">
                <img :src="i.logo" class="logo">
                <div class="flex column content">
                  <h3 style="margin-left: 10px;text-align: center;width:max-content;">{{i.name}}</h3>
                  <p style="margin-top: auto;">{{i.content}}</p>
                </div>
              </a>
            </div>
            <div class="link item flex a-c j-c">
              <h2 style="cursor: default;">链接位招租...</h2>
            </div>
          </div>
        </view>
      </unicloud-db>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .container {
        width: 100%;
        flex-wrap: wrap;
    }
    
    .pageContainer {
        width: 85%;
        max-width: 2000px;
    }
    
    .title {
        width: 90%;
        max-width: 800px;
        height: 100px;
        margin: 30px auto;
        border-radius: 50px;
        background: var(--color-box-2);
        box-shadow: 0 0 10px var(--color-shadow);
    }
    
    .item {
        margin: 5px;
        width: 20%;
        min-width: 300px;
        height: 125px;
        border-radius: 25px;
        background: var(--color-box-2);
        box-shadow: 0 0 10px var(--color-shadow);
    }
    
    .item * {
        cursor: pointer;
    }
    
    .link {
        transition: 0.75s;
    }
    
    .link:hover {
        width: 25%;
        min-width: 325px;
        height: 140px;
    }
    
    .logo {
        border-radius: 10px;
        height: 65px;
        margin-right: 15px;
    }
    
    .content {
        width: 60%;
        height: 50%;
    }
    
    .add-link-but {
        width: max-content;
        background-color: var(--color-theme-1);
        border-radius: 50px;
        color: var(--color-but-font);
        font-size: 15px;
        height: 40px;
        bottom: 5%;
        right: 5%;
        z-index: 5;
    }
</style>