<script setup>
    import {
        ref,
        onMounted,
        onBeforeMount,
        watch,
        nextTick
    } from "vue"
    const db = uniCloud.database()

    const nav = ref('all')

    onMounted(async() => {
        // 从数据库获取所有留言
        const nickname = await db.collection('uni-id-users').field('_id,nickname').getTemp()
        await db.collection('messages', nickname).orderBy('_id', 'desc').get().then(res => {
            messages.value = res.result.data
        })
    })

    // 留言数据
    const messages = ref([])

    // 正在查看的留言
    const onfocus = ref(null)

    // 搜索
    const searchInput = ref('')
    const searchOnfocus = ref('')

    // 改变导航
    function changeNav(n) {
        nav.value = n
        onfocus.value = null
        searchInput.value = ''
    }

    function search(user) {
        if (user) {
            searchInput.value = user
        }
        searchOnfocus.value = searchInput.value
        nav.value = 'search'
    }

    async function ban() {
        uni.showLoading()
        let state = !messages.value[onfocus.value].public
        await db.collection('messages').doc(messages.value[onfocus.value]._id).update({
            public: state
        }).then(res => {
            messages.value[onfocus.value].public = state
        })
        uni.hideLoading()
    }
</script>

<template>
  <div class="flex column w-h-100p">
    <!-- 顶部导航 -->
    <div class="messages-nav flex w-100p a-c">
      <button :class="nav=='all'?'but-theme-1':'but-none'" @click="changeNav('all')" style="margin-left: 30px;">所有留言</button>
      <button :class="nav=='ban'?'but-theme-1':'but-none'" @click="changeNav('ban')">被封禁</button>
      <div class="input-container flex">
        <input placeholder="用户搜索" v-model="searchInput">
        <uni-icons @click="search()" type="search" size="22" color="var(--color-font)"></uni-icons>
      </div>
      <h4 style="margin-top:0;margin-left: auto; margin-right: 50px;">总计：{{messages.length}}</h4>
    </div>
    <div class="flex w-100p" style="height: calc(100% - 60px);">
      <!-- 留言列表 -->
      <div class="messages-list flex column a-c">
        <h4>留言列表</h4>
        <div class="list-container">
          <TransitionGroup name="list">
            <div v-for="(item,index) in messages" :key="item._id" class="items car" 
            v-show="nav=='all' ? true : nav=='ban' ? !item.public : item.sender[0].nickname==searchOnfocus" 
            @click="onfocus=index">
              <div class=" item flex column">
                <div class="flex" style="margin-bottom: 12px;">
                  <h3 style="white-space: nowrap;" :style="item.public?'':'color:var(--color-warn)'">{{item.sender[0].nickname}}:</h3>
                  <p class="word-wrap" :style="item.public?'':'color:var(--color-warn)'" style="margin-left: 10px;">{{item.message}}</p>
                </div>
                <div class="flex">
                  <uni-dateformat style="opacity: 0.8;margin-bottom: 8px;font-size: 15px;" :date="item.createdAt">
                  </uni-dateformat>
                </div>
              </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <!-- 留言详情 -->
      <div class="messages-info flex column a-c">
        <h4>留言详细</h4>
        <div class="info flex column" v-if="onfocus != null">
          <p class="content">内容：{{messages[onfocus].message}}</p>
          <p>发送人：{{messages[onfocus].sender[0].nickname}}</p>
          <div class="flex">
            <p>发送时间：</p>
            <uni-dateformat style="opacity: 0.8;margin-bottom: 8px;font-size: 15px;" :date="messages[onfocus].createdAt">
            </uni-dateformat>
          </div>
          <button @click="search(messages[onfocus].sender[0].nickname)" style=" margin-top: auto;" class="but-theme-1">所有留言</button>
          <button @click="ban()" :class="messages[onfocus].public?'but-warn':'but-theme-1'"
          style="margin-bottom: 150px;margin-top:30px;">{{messages[onfocus].public?'封禁':'解封'}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    @import '../articleEditor/articleEditor.css';
    .messages-nav {
        height: 60px;
        border-bottom: 1px solid var(--color-line);
    }
    
    .messages-list {
        flex: 3;
        border-right: 1px solid var(--color-line);
    }
    
    .messages-info {
        height: 100%;
        flex: 2;
    }
    
    h4 {
        margin-top: 10px;
    }
    
    .list-container {
        margin-top: 25px;
        width: 95%;
        height: 90%;
        background-color: var(--color-background-box);
        overflow: scroll;
    }
    
    .list-container::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
    
    .items {
        width: 95%;
        padding: 10px 0;
        margin: 20px auto;
    }
    
    .item {
        width: 90%;
        padding-left: 5px;
        margin: 10px auto;
        border-bottom: 1px solid var(--color-wait);
    }
    
    .word-wrap {
        width: 90%;
        word-break: break-all;
    }
    
    .list-leave-active {
        width: 95%;
        max-width: 680px;
        position: absolute;
    }
    
    .info {
        width: 80%;
        height: 100%;
    }
    
    .info>button {
        align-self: center;
        width: 200px;
    }
    
    .info>p,
    .info>div {
        margin: 20px 0;
    }
    
    .input-container {
        border: 1px solid var(--color-line);
        padding: 7px 13px;
        border-radius: 50px;
        margin-left: 30px;
    }
    
    .input-container>input {
        padding-left: 5px;
        margin-right: 5px;
        border-bottom: 1px solid var(--color-line);
        width: 300px;
    }
    
    .content {
        max-height: 300px;
        overflow: scroll;
    }
    
    .content::-webkit-scrollbar {
        width: 0;
        height: 0;
    }
</style>