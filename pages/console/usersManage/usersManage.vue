<script setup>
    import {
        ref,
        onMounted,
        onBeforeMount,
        watch,
        nextTick
    } from "vue"
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    const db = uniCloud.database()
    const uniIdCo = uniCloud.importObject('uni-id-co')

    const nav = ref('all')

    onMounted(async() => {
        // 从数据库获取所有用户
        await db.collection('uni-id-users')
            .field("email,nickname,register_date,role,last_login_date,last_login_ip,link,status")
            .orderBy('_id', 'desc').get().then(res => {
                users.value = res.result.data
            })
    })

    // 用户数据
    const users = ref([])

    // 正在查看的用户
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

    function search(type) {
        searchOnfocus.value = searchInput.value
        nav.value = type
    }

    // message、link
    async function ban() {
        // 询问是否封禁
        let confirm = await uni.showModal({
            title: '提示',
            content: '是否封禁该用户？',
            confirmText: `${users.value[onfocus.value].status?'解封':'封禁'}`,
            cancelText: '取消'
        })
        if (!confirm.confirm) return
        uni.showLoading()
        let status
        if (users.value[onfocus.value].status) {
            status = 0
        } else {
            status = 1
        }
        Promise.all([await db.collection('uni-id-users').doc(users.value[onfocus.value]._id).update({
                status
            }),
            await db.collection('messages').where(`sender == '${users.value[onfocus.value]._id}'`).update({
                public: status == 0
            }),
            await db.collection('link').doc(users.value[onfocus.value]._id).update({
                public: status == 0
            })
        ]).then(res => {
            popUps.tip(`${users.value[onfocus.value].nickname} ${status?'已封禁':'已解封'}`)
            users.value[onfocus.value].status = status
        })
        uni.hideLoading()
    }
</script>

<template>
  <div class="flex column w-h-100p">
    <!-- 顶部导航 -->
    <div class="users-nav flex w-100p a-c">
      <button :class="nav=='all'?'but-theme-1':'but-none'" @click="changeNav('all')" style="margin-left: 30px;">所有用户</button>
      <button :class="nav=='ban'?'but-theme-1':'but-none'" @click="changeNav('ban')">被封禁</button>
      <div class="input-container flex a-c">
        <input placeholder="用户搜索" v-model="searchInput">
        <button :class="nav=='id_search'?'but-theme-1':'luminousBox'"  @click="search('id_search')">ID搜索</button>
        <button :class="nav=='nickname_search'?'but-theme-1':'luminousBox'"  @click="search('nickname_search')">昵称搜索</button>
      </div>
      <h4 style="margin-top:0;margin-left: auto; margin-right: 50px;">总计：{{users.length}}</h4>
    </div>
    <div class="flex w-100p" style="height: calc(100% - 60px);">
      <!-- 用户列表 -->
      <div class="users-list flex column a-c">
        <h4>用户列表</h4>
        <div class="list-container">
          <TransitionGroup name="list">
            <div v-for="(item,index) in users" :key="item._id" class="items car" 
            v-show="nav=='all' ? true : nav=='ban' ? item.status : nav=='id_search' ? item._id==searchOnfocus : item.nickname==searchOnfocus" 
            @click="onfocus=index">
            <div class="item flex column">
              <p class="op-5">ID：{{item._id}}</p>
              <h4>昵称：{{item.nickname}}</h4>
            </div>
            </div>
          </TransitionGroup>
        </div>
      </div>
      <!-- 用户详情 -->
      <div class="users-info flex column a-c">
        <h4>用户详细</h4>
        <div class="info flex column" v-if="onfocus != null">
          <p>ID：{{users[onfocus]._id}}</p>
          <p>昵称 ：{{users[onfocus].nickname}}</p>
          <p>邮箱 ：{{users[onfocus].email}}</p>
          <p>角色 ：{{users[onfocus].role}}</p>
          <p>状态 ：{{users[onfocus].status?'封禁':'正常'}}</p>
          <p>友链 ：{{users[onfocus].link || '无'}}</p>
          <div class="flex">
            <p>注册时间：</p>
            <uni-dateformat style="opacity: 0.8;margin-bottom: 8px;font-size: 15px;" :date="users[onfocus].register_date">
            </uni-dateformat>
          </div>
          <div class="flex">
            <p>最后登陆时间：</p>
            <uni-dateformat style="opacity: 0.8;margin-bottom: 8px;font-size: 15px;" :date="users[onfocus].last_login_date">
            </uni-dateformat>
          </div>
          <p>最后登陆IP：{{users[onfocus].last_login_ip}}</p>
          <button @click="ban()" :class="users[onfocus].status?'but-theme-1':'but-warn'"
          style="margin-bottom: 50px;margin-top:30px;">{{users[onfocus].status?'解封':'封禁'}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    @import '../articleEditor/articleEditor.css';
    .users-nav {
        height: 60px;
        border-bottom: 1px solid var(--color-line);
    }
    
    .users-list {
        flex: 3;
        border-right: 1px solid var(--color-line);
    }
    
    .users-info {
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
        border-radius: 50px;
        margin-left: 30px;
    }
    
    .input-container>input {
        padding-left: 5px;
        margin: 0 10px;
        border-bottom: 1px solid var(--color-line);
        width: 300px;
    }
    
    .input-container>button {
        height: 33px;
        margin: 0;
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