<script setup>
    const uniIdCo = uniCloud.importObject('uni-id-co')
    import {
        ref,
        onMounted,
        watch,
        onBeforeMount,
        computed
    } from "vue"
    import renamed from './renamed.vue'
    import myLink from './myLink.vue'
    import {
        useRouter
    } from 'vue-router';
    const router = useRouter()
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    import {
        useAtfStore
    } from '/stores/atf.js'
    const atf = useAtfStore()
    import {
        useWindowStore
    } from '/stores/window.js'
    const Window = useWindowStore()

    onBeforeMount(() => {
        atf.initHeader(40, {
            main: computed(() => {
                return '欢迎' + user.userInfo.nickname + '来到我的空间站点'
            }),
            sub: 'welcome to my utopia'
        })
    })

    async function signOut() {
        await uniIdCo.logout()
        await router.push('/')
        user.signOut()
        popUps.tip('退出登陆', false)
    }
</script>

<template>
  <div class="pageContainer flex" v-if="user.isLogin">
    <myLink v-if="user.userInfo.link"></myLink>
    <div class="user car flex column a-c" :style="user.userInfo.link?'':'margin: 20px auto; width: 100%;'">
      <h2 :class="{'isLink-h2':user.userInfo.link}" style="margin-top: 30px;">
        用户信息{{user.userInfo.link?(Window.windowWidth>1000)?':':'':''}}</h2>
      <h3 style="margin: 20px 0;">{{user.userInfo.nickname}}</h3>
      <button v-if="!user.userInfo.link" @click="popUps.callPopUps(['link','linkFiled'], {type: 'add'})"
        class="but but-f pointer luminousBox">添加友链</button>
      <renamed></renamed>
      <button @click="popUps.callPopUps(['login'])" class="but but-f pointer luminousBox"
        style="margin-top: 0;">重置密码</button>
      <button @click="signOut" class="but pointer but-exit">退出登陆</button>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    @media screen and (max-width:1000px) {
        .user {
            width: 100%;
            max-width: 750px;
            margin: 20px auto 0 auto;
        }
        .pageContainer {
            flex-direction: column;
        }
    }
    
    @media screen and (min-width:1000px) {
        .user {
            width: 30%;
            max-width: 750px;
            margin: 30px 0 15px 0;
        }
        .isLink-h2 {
            align-self: flex-start;
            margin-left: 25px;
        }
    }
    
    .user {
        height: max-content;
    }
    
    .but {
        margin-bottom: 30px;
        width: 250px;
        height: 45px;
        font-size: 15px;
        border-radius: 75px;
        transition: 0.75s;
        letter-spacing: 5px;
    }
    
    .but-t {
        border: 0;
        background: var(--color-theme-1);
        box-shadow: 0 0 10px var(--color-theme-1);
        color: var(--color-but-font);
    }
    
    .but-f {
        border: 1px solid var(--color-line);
        color: var(--color-font);
        background: none;
    }
    
    .but-f:hover {
        border: 1px solid var(--color-theme-1);
    }
    
    .but-w {
        border: 1px solid var(--color-line);
        color: var(--color-font);
        background: none;
        opacity: 0.5;
    }
    
    .but-exit {
        margin-top: 0;
        border: 0;
        color: var(--color-but-font);
        background: var(--color-warn);
    }
</style>