<script setup>
    import {
        ref,
    } from "vue"
    import cf from '/utils/cf.js'
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()

    const crl = ref({
        focus: false,
        butText: '修改',
        loading: false,
        newNickname: ''
    })

    const db = uniCloud.database()
    async function renamed() {
        try {
            uni.showLoading({
                title: '信息提交中...'
            })
            if (!crl.value.newNickname) throw Error('昵称不能为空')
            let nickname = crl.value.newNickname.trim()
            if (nickname == "") throw Error('昵称不能为空')
            await db.collection('uni-id-users').doc(user.userInfo._id).update({
                nickname
            })
            crl.value.newNickname = ''
            user.userInfo.nickname = nickname
            popUps.tip('修改成功', false)
        } catch (err) {
            popUps.tip(err.message, true)
        } finally {
            uni.hideLoading()
        }
    }
</script>

<template>
  <button class="but pointer " :class="crl.focus?'but-focus':'but-unfocus luminousBox'"
    @click="crl.focus=!crl.focus">修改昵称</button>
  <transition name="renamed">
    <div class="renamed-container flex column a-c" v-show="crl.focus">
      <div class="input-container flex" style="margin-bottom: 20px;">
        <p class="input-title">新昵称：</p>
        <input v-model="crl.newNickname" placeholder="只能使用中文、英文、下划线-_">
      </div>
      <button @click="renamed"
        :class="crl.loading?'but but-wait':'but but-unfocus pointer luminousBox'">{{crl.butText}}</button>
    </div>
  </transition>
</template>

<style scoped>
    @import '/pages/main.css';
    .renamed-container {
        margin: 0;
        width: 100%;
        overflow: hidden;
    }
    
    .input-container {
        width: 260px;
        padding: 10px;
        border-radius: 75px;
        border: 1px solid var(--color-line);
    }
    
    .input-title {
        text-align: end;
        width: 55px;
        margin-right: 5px;
        white-space: nowrap;
    }
    
    input {
        width: 210px;
        background: none;
        outline: none;
        border-radius: 0;
        font-size: 15px;
        padding-bottom: 5px;
        transform: translateY(2.5px);
        border: 0;
        border-bottom: 1px solid var(--color-wait);
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
    
    .but-focus {
        border: 0;
        background: var(--color-theme-1);
        box-shadow: 0 0 10px var(--color-theme-1);
        color: var(--color-but-font);
    }
    
    .but-unfocus {
        border: 1px solid var(--color-line);
        color: var(--color-font);
        background: none;
    }
    
    .but-wait {
        border: 1px solid var(--color-line);
        color: var(--color-font);
        background: none;
        opacity: 0.5;
    }
    
    .luminousBox:hover {
        border: 1px solid var(--color-theme-1);
    }
    
    .renamed-enter-active,
    .renamed-leave-active {
        transition: 1s;
    }
    
    .renamed-enter-from,
    .renamed-leave-to {
        height: 0;
        opacity: 0;
    }
    
    .renamed-enter-to,
    .renamed-leave-from {
        height: 144px;
        opacity: 1;
    }
</style>