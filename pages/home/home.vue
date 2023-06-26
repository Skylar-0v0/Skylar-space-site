<script setup>
    import sidebar from './sidebar.vue'
    import articleCar from './articleCar.vue'
    import logCar from './logCar.vue'
    import cf from '/utils/cf.js'
    import {
        ref,
        watch,
        onMounted,
        getCurrentInstance,
        onBeforeMount
    } from "vue"
    import {
        useWindowStore
    } from '/stores/window.js'
    const Window = useWindowStore()
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()
    import {
        useWebInfoStore
    } from '/stores/webInfo.js'
    const webInfo = useWebInfoStore()

    onMounted(() => {
        // 如果webInfo.articleList长度为0，说明是第一次加载，需要获取数据
        if (webInfo.articleList.length == 0) {
            webInfo.getArticleList()
        }
    })

    onBeforeMount(() => {
        atf.initHeader(100, {
            main: '这里是Skylar的空间站点',
            sub: 'welcome to my utopia'
        })
    })

    let crl = ref({
        main: true,
    })
    let text = ref({
        introduce: '\u2003\u2003站长本来是一个美术生，也是一个文科生。出于对计算机技术的喜爱，开始自学编程，学习各种前端、后端知识，立志成为一名全栈工程师。目前站长比较擅长的还是前端，可能是曾经学过美术的原因，现在写前端页面的各种UI美工、交互动画可以说是信手拈来。'
    })

    function To(s) {
        document.getElementById(s).scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    }
</script>

<template>
  <div class="container flex j-c">
    <div class='flex'>
      <div class="flex column pageContainer">
        <div class="blog car flex a-c j-c">
          <div class="el flex column">
            <h2 class="blog-title" style="margin-top: 30px;">关于站长：</h2>
            <p>{{text.introduce}}</p>
            <router-link @click="To('top')" to="/blog?article=About-the-webmaster" style="width: min-content;">
              <div class="but luminousBox pointer" style="margin-bottom: 30px;">了解更多</div>
            </router-link>
          </div>
        </div>
        <logCar></logCar>
        <!-- 将webInfo.articleList数据，使用blog-car组件展示 -->
        <div v-for="(item, index) in webInfo.articleList">
          <router-link @click="To('top')" :to="'/blog?article=' + item.title">
            <articleCar :article="item" :index="index" />
          </router-link>
        </div>
      </div>
      <sidebar v-if="Window.windowWidth > 990"></sidebar>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .container {
        margin: 0 auto;
        min-height: 80vh;
        height: min-content;
        width: 95%;
    }
    
    .blog {
        height: max-content;
        overflow: hidden;
        margin-bottom: 15px;
    }
    
    .blog .el {
        width: 85%;
    }
    
    .blog .el * {
        margin-top: 20px;
    }
    
    .blog-title {
        margin-left: -2%;
        color: var(--color-theme-1);
    }
    
    .but {
        width: max-content;
        padding: 8px 20px;
        border-radius: 75px;
        border: solid 1px var(--color-line);
    }
    
    .but:hover {
        border: solid 1px var(--color-theme-1);
    }
</style>