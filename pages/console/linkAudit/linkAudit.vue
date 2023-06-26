<script setup>
    import {
        ref,
        onMounted,
        onBeforeMount,
        getCurrentInstance,
        watch
    } from "vue"
    import cf from '/utils/cf.js'
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    import linkListItem from './linkListItem.vue'
    const db = uniCloud.database()

    let _this
    onMounted(() => {
        _this = getCurrentInstance().setupState
        db.collection('link-audit').get().then(res => {
            linkList.value = res.result.data
        })
    })

    const linkList = ref([])
    const onfocus = ref(null)

    const webInfo = ref({
        _id: '',
        name: '',
        content: '',
        url: '',
        logo: '',
        status: '',
        tip: '',
        public: true
    })

    function focus(index) {
        onfocus.value = index
        webInfo.value = {
            ...linkList.value[index]
        }
    }

    // 更新数据操作
    async function update(data) {
        await db.collection('link-audit').doc(webInfo.value._id).update(data).then(res => {
            webInfo.value = Object.assign(webInfo.value, data)
            linkList.value[onfocus.value] = Object.assign(linkList.value[onfocus.value], data)
        })
    }

    // 封禁网站
    async function ban() {
        if (!webInfo.value.public) return
        let tip
        if (!(tip = prompt('输入原因'))) return
        uni.showLoading()
        await Promise.all([await update({
                status: 2,
                tip,
                public: false
            }),
            await db.collection('link').doc(webInfo.value._id).remove()
        ])
        throw 0
    }

    // 通过审核
    async function pass() {
        if (!webInfo.value.status) return
        uni.showLoading()
        await Promise.all([
            await update({
                tip: '',
                status: 0,
                public: true
            }),
            await db.collection('link').add({
                _id: webInfo.value._id,
                name: webInfo.value.name,
                content: webInfo.value.content,
                url: webInfo.value.url,
                logo: webInfo.value.logo
            })
        ])
        throw 0
    }

    //审核不通过
    async function unpass() {
        if (webInfo.value.status != 1) return
        let tip
        if (!(tip = prompt('输入原因'))) return
        uni.showLoading()
        await update({
            status: 2,
            tip
        })
        throw 0
    }

    //编辑提示语
    async function editTip() {
        let tip
        if (!(tip = prompt('输入提示语', webInfo.value.tip))) return
        uni.showLoading()
        await db.collection('link-audit').doc(webInfo.value._id).update({
            tip
        }).then(res => {
            webInfo.value.tip = tip
            linkList.value[onfocus.value].tip = tip
        })
        throw 0
    }

    //前往网站
    function toWeb() {
        window.open(webInfo.value.url, "_blank")
    }

    //操作函数入口
    async function action(fun) {
        if (onfocus.value == null) return
        try {
            await _this[fun]()
        } catch (err) {
            popUps.tip(err ? err : '操作成功', Boolean(err))
        } finally {
            uni.hideLoading()
        }
    }
</script>

<template>
  <div class="link-audit flex column w-h-100p">
    <h3 class="title" style="border-bottom: 1px solid var(--color-line);">友链审核</h3>
    <div class="flex w-h-100p">
      <div class="audit flex column a-c">
        <h4 style="margin-top: 10px;">友链列表</h4>
        <div class="list-container">
          <div class="flex column a-c" v-for="(item, index) in linkList" :key="item._id">
            <linkListItem :data="item" :index="index" :onfocus="onfocus" @focus="focus(index)" v-if="!item.status">
            </linkListItem>
          </div>
        </div>
      </div>
      <div class="audit flex column a-c">
        <h4 style="margin-top: 10px;">待审核</h4>
        <div class="list-container">
          <div class="flex column a-c" v-for="(item, index) in linkList" :key="item._id">
            <linkListItem :data="item" :index="index" :onfocus="onfocus" @focus="focus(index)" v-if="item.status">
            </linkListItem>
          </div>
        </div>
      </div>
      <div class="web-info flex column a-c">
        <h4 style="margin-top: 10px;">网站信息</h4>
        <div class="info-container flex column w-100p">
          <p>网站名称：{{webInfo.name}}</p>
          <p>网站介绍：{{webInfo.content}}</p>
          <p>URL：{{webInfo.url}}</p>
          <p>头像URL：{{webInfo.logo}}</p>
        </div>
        <div class="operate flex column a-c">
          <p style="align-self: flex-start;">公开状态：{{webInfo.public}}</p>
          <p style="align-self: flex-start;">提示语：{{webInfo.tip}}</p>
          <button @click="action('toWeb')" :class="onfocus==null?'op-5':'luminousBox but-interact-h'"
            class="but-interact" style="width: 75%;">前往网站</button>
          <div class="flex w-100p">
            <button @click="action('editTip')" :class="onfocus==null?'op-5':'luminousBox but-interact-h'"
              class="but but-interact">提示语</button>
            <button @click="action('ban')" :class="onfocus==null?'op-5':webInfo.public?'':'op-5'"
              class="but but-warn">封禁</button>
          </div>
          <div class="flex w-100p">
            <button @click="action('pass')"
              :class="onfocus==null?'op-5':webInfo.status?'luminousBox but-interact-h':'op-5'"
              class="but but-interact">通过</button>
            <button @click="action('unpass')" :class="onfocus==null?'op-5':webInfo.status == 1?'':'op-5'"
              class="but but-warn">不通过</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .title {
        border-bottom: 1px solid var(--color-line);
        margin-top: 15px;
        padding: 0 0 15px 20px;
    }
    
    .link-list {
        flex: 1;
    }
    
    .audit {
        flex: 1;
        border-right: 1px solid var(--color-line);
    }
    
    .list-container {
        background-color: var(--color-background-box);
        margin-top: 5%;
        width: 90%;
        height: 90%;
        overflow: scroll;
    }
    
    .info-container::-webkit-scrollbar,
    .list-container::-webkit-scrollbar {
        display: none;
    }
    
    .web-info {
        flex: 1;
    }
    
    .info-container {
        margin-top: 20px;
        width: 419px;
        height: max-content;
        max-height: 450px;
        overflow: scroll;
    }
    
    .info-container>* {
        margin: 10px 15px;
        background-color: var(--color-background-box);
    }
    
    .operate {
        margin-top: auto;
        margin-bottom: 20px;
        width: 90%;
    }
    
    .operate>* {
        margin-bottom: 15px;
    }
    
    button {
        font-size: 15px;
        background: none;
        white-space: nowrap;
        letter-spacing: 5px;
        height: 40px;
        border-radius: 50px;
    }
    
    .but {
        width: 45%;
        margin: 10px 20px;
    }
    
    .but-interact {
        color: var(--color-font);
        border: 1px solid var(--color-line);
    }
    
    .but-interact-h:hover {
        border: 1px solid var(--color-theme-1);
    }
    
    .but-warn {
        background-color: var(--color-warn);
        color: var(--color-but-font);
        border: 1px solid var(--color-warn);
    }
    
    p {
        word-wrap: break-word;
    }
</style>