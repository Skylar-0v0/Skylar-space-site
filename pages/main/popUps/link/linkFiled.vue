<script setup>
    import {
        ref,
        onMounted,
        getCurrentInstance
    } from 'vue'
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import linkInfo from './linkInfo.vue'
    const db = uniCloud.database()

    onMounted(() => {
        if (popUps.args.type == 'update') {
            Object.assign(linkText.value, {
                name: user.link.name,
                content: user.link.content,
                url: user.link.url,
                logo: user.link.logo
            })
        }
    })

    const crl = ref({
        butText: '提交信息',
        loading: false
    })

    const linkText = ref({
        name: '',
        content: '',
        url: '',
        logo: ''
    })

    const linkTip = {
        name: '网站名称',
        content: '网站介绍',
        url: 'URL',
        logo: '头像URL'
    }

    const Fun = {
        add: async function(data) {
            return db.collection('link-audit').add(data)
        },
        update: async function(data) {
            return db.collection('link-audit').doc(user.userInfo._id).update(data)
        }
    }

    const emit = defineEmits(['exit'])

    async function LinkAction() {
        try {
            crl.value.loading = true
            crl.value.butText = '信息提交中...'
            uni.showLoading()
            await Fun[popUps.args.type]({
                ...linkText.value
            }).then(res => {
                user.link = {
                    ...linkText.value
                }
                user.link.tip = '待审核...'
                user.link.status = 1
                user.userInfo.link = true
                emit('exit')
            })
            throw 0
        } catch (err) {
            if (err == "Error: 友情链接已存在" && popUps.args.type == 'add') {
                user.userInfo.link = true
                emit('exit')
            }
            popUps.tip(err ? err : '信息提交成功', Boolean(err))
        } finally {
            crl.value.butText = '提交信息'
            crl.value.loading = false
            uni.hideLoading()
        }
    }
</script>

<template>
  <div class="flex linkFilde-container" style="margin-top: 10px;">
    <linkInfo style="flex: 1;" v-if="popUps.args.type == 'add'"></linkInfo>
    <div class="inputs-container flex column a-c" style="flex: 1">
      <h3>友链申请</h3>
      <div class="inputs flex column">
        <div class="ups flex a-c">
          <h4>网站名称：</h4>
          <input type="text" placeholder="不大于15字" v-model="linkText.name">
        </div>
        <div class="ups flex a-c">
          <h4>网站介绍：</h4>
          <input type="text" placeholder="不大于20字" v-model="linkText.content">
        </div>
        <div class="ups flex a-c">
          <h4>URL：</h4>
          <input type="text" v-model="linkText.url">
        </div>
        <div class="ups flex a-c">
          <h4>头像URL：</h4>
          <input type="text" v-model="linkText.logo">
        </div>
      </div>
      <button @click="LinkAction" :class="crl.loading?'op-5':'luminousBox'"
        style="margin-bottom: 30px;">{{crl.butText}}</button>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    @media screen and (max-width:767px) {
        .linkFilde-container {
            flex-direction: column;
            overflow: scroll;
            scrollbar-width: none;
            -ms-overflow-style: none;
        }
        .linkFilde-container::-webkit-scrollbar {
            display: none;
        }
        .inputs-container {
            width: 100%;
        }
    }
    
    @media screen and (min-width:768px) {
        .inputs-container {
            width: 490px;
        }
    }
    
    .linkFilde-container {
        width: max-content;
        max-width: 95vw;
        height: max-content;
        max-height: 90vh;
    }
    
    .inputs {
        width: 90%;
        margin: 30px 0 10px 0;
    }
    
    .ups {
        margin-bottom: 25px;
        border-radius: 50px;
        height: 45px;
        overflow: hidden;
        background-color: var(--color-background-input);
    }
    
    .ups>h4 {
        margin-left: 15px;
        white-space: nowrap;
    }
    
    .ups>input {
        width: 100%;
        height: 25px;
        margin-right: 15px;
        border-bottom: 1px solid var(--color-line);
    }
    
    button {
        background: none;
        transition: 0.75s;
        letter-spacing: 5px;
        font-size: 15px;
        width: 250px;
        height: 45px;
        border-radius: 50px;
        border: 1px solid var(--color-line);
        color: var(--color-font);
    }
    
    .luminousBox:hover {
        border: 1px solid var(--color-theme-1);
    }
</style>