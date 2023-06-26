<script setup>
    import {
        ref,
        onMounted
    } from 'vue'
    import cf from '/utils/cf.js'
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        useWindowStore
    } from '/stores/window.js'
    const Window = useWindowStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    import {
        useRouter
    } from 'vue-router';
    const router = useRouter()
    const db = uniCloud.database()

    onMounted(async() => {
        crl.value.main = true
        if (!user.link.name) {
            try {
                uni.showLoading()
                await db.collection('link-audit').doc(user.userInfo._id).get().then(res => {
                    user.link = {
                        ...res.result.data[0]
                    }
                    crl.value.link = true
                    crl.value.loading = false
                })
            } catch (err) {
                user.userInfo.link = false
                popUps.tip(err, true)
            } finally {
                uni.hideLoading()
            }
        } else {
            crl.value.link = true
            crl.value.loading = false
        }
    })

    async function infoError() {
        await router.push('/')
        user.signOut()
    }

    let fontColor = ref({
        color: 'var(--color-font)'
    })
    const crl = ref({
        main: false,
        link: false,
        loading: true
    })

    async function deleteLink() {
        try {
            if (!confirm('确定要删除链接吗？')) return
            crl.value.loading = true
            uni.showLoading()
            await db.collection("link-audit").doc(user.userInfo._id).remove().then(res => {
                user.link = {}
                user.userInfo.link = false
                popUps.tip('删除成功', false)
            })
        } catch (err) {
            popUps.tip(err, false)
        } finally {
            crl.value.loading = false
            uni.hideLoading()
        }
    }
</script>

<template>
  <transition name="mainFade">
    <div class="car flex column a-c" v-show="crl.main">
      <h2 :class="{'isLink-h2':(Window.windowWidth>1000)}" style="margin-top: 30px;">
        我的链接{{(Window.windowWidth>1000)?':':''}}</h2>
      <transition name="mainFade">
        <a :href="user.link.url" class="link flex a-c luminousBox" v-show="crl.link"
          @mouseenter="fontColor.color = 'var(--color-but-font)'" @mouseleave="fontColor.color = 'var(--color-font)'">
          <img :src="user.link.logo" :alt="user.link.name">
          <div class="content flex column">
            <h3 :style="fontColor" style="transition: 0.75s;">{{user.link.name}}</h3>
            <div :style="fontColor" style="transition: 0.75s;">{{user.link.content}}</div>
          </div>
        </a>
      </transition>
      <p>{{user.link.tip}}</p>
      <div class="buts flex a-c">
        <button class="but" :class="crl.loading?'op-5':'luminousBox'"
          @click="crl.loading?'':popUps.callPopUps(['link','linkFiled'], {type: 'update'})">修改链接</button>
        <button @click="crl.loading?'':popUps.callPopUps(['link','linkInfo'])" class="but"
          :class="crl.loading?'op-5':'luminousBox'">互链信息</button>
        <button @click="crl.loading?'':deleteLink()" class="but-delete" :class="{'op-5':crl.loading}">删除友链</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
    @import '/pages/main.css';
    @media screen and (max-width:999px) {
        .car {
            width: 100%;
            max-width: 750px;
            margin: 20px auto 0 auto;
        }
        .buts {
            width: 100%;
        }
    }
    
    @media screen and (max-width:600px) {
        .buts {
            flex-direction: column;
        }
    }
    
    @media screen and (min-width:1000px) {
        .car {
            width: 70%;
            margin: 30px 15px 0 0;
        }
        .isLink-h2 {
            align-self: flex-start;
            margin-left: 25px;
        }
        .buts {
            width: 90%;
        }
    }
    
    .car {
        height: max-content;
    }
    
    .link {
        width: 90%;
        height: 100px;
        margin: 20px 0 10px 0;
        border: 3px solid var(--color-line);
        border-radius: 1rem;
    }
    
    .link:hover {
        border: 3px solid var(--color-theme-1);
    }
    
    .content {
        padding-left: 15px;
        height: 90px;
        justify-content: space-around;
    }
    
    img {
        height: 70px;
        margin-left: 10%;
        border-radius: 100%;
    }
    
    .buts {
        justify-content: space-around;
        margin-bottom: 15px;
    }
    
    button {
        background: none;
        color: var(--color-font);
        font-size: 15px;
        width: 250px;
        height: 45px;
        border-radius: 50px;
        margin: 15px;
    }
    
    .but {
        border: 1px solid var(--color-line);
    }
    
    .but:hover {
        border: 1px solid var(--color-theme-1);
    }
    
    .but-delete {
        border: 1px solid var(--color-warn);
        background-color: var(--color-warn);
        color: var(--color-but-font);
    }
</style>