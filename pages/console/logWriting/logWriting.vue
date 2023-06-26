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
    onMounted(() => {
        db.collection('development-logs').orderBy('_id', 'desc').get().then(res => {
            logData.value = res.result.data
        })
    })

    const logData = ref([])
    const onfocus = ref(null)
    const logInput = ref('')
    const newLog = ref(false)

    function logOnfocus(index) {
        newLog.value = false
        onfocus.value = index
        logInput.value = logData.value[index].log
    }

    function createdLog() {
        onfocus.value = null
        newLog.value = true
        logInput.value = ''
    }

    function addLog() {
        if (!logInput.value) {
            popUps.tip('请输入日志内容', true)
            return
        }
        db.collection('development-logs').add({
            log: logInput.value,
            createdAt: Date.now()
        }).then(res => {
            logData.value.unshift({
                _id: res.result.id,
                log: logInput.value,
                createdAt: Date.now()
            })
            logOnfocus(0)
            popUps.tip('添加成功', false)
            newLog.value = false
        })
    }

    function updateLog() {
        if (onfocus.value == null) return
        db.collection('development-logs').doc(logData.value[onfocus.value]._id).update({
            log: logInput.value
        }).then(res => {
            logData.value[onfocus.value].log = logInput.value
            popUps.tip('更新成功', false)
        })
    }

    async function deleteLog() {
        if (onfocus.value == null) return
        if (!confirm('确定删除？')) return
        db.collection('development-logs').doc(logData.value[onfocus.value]._id).remove().then(res => {
            logData.value.splice(onfocus.value, 1)
            logInput.value = ''
            onfocus.value = null
            popUps.tip('删除成功', false)
        })
    }
</script>

<template>
  <div class="log-audit flex column w-h-100p">
    <h3 class="title" style="border-bottom: 1px solid var(--color-line);">开发日志</h3>
    <div class="flex w-h-100p">
      <div class="log-history flex column a-c">
        <h4 style="margin-top: 10px;">历史日志</h4>
        <div class="item-container flex column a-c">
          <div class="car log-item" :class="onfocus==index?'onfocus':'pointer'" @click="logOnfocus(index)"
            v-for="(item, index) in logData">
            <uni-dateformat :class="onfocus==index?'onfocus':''" class="date-format op-8" :date="item.createdAt">
            </uni-dateformat>
            <p :class="onfocus==index?'onfocus':''">{{item.log}}</p>
          </div>
        </div>
      </div>
      <div class="log-info flex column a-c">
        <h4 style="margin-top: 10px;">日志编写</h4>
        <textarea v-model="logInput" class="easyinput"></textarea>
        <uni-dateformat v-if="onfocus != null" class="date-format op-8" :date="logData[onfocus].createdAt"></uni-dateformat>
        <p v-if="newLog" class="date-format">编写新日志</p>
        <div class="flex column buts">
          <!-- 新增记录 -->
          <button class="but" style="background-color: var(--color-theme-1);" hover-class="op-8" @click="newLog?addLog():createdLog()">{{newLog?'新增记录':'创建记录'}}</button>
          <!-- 修改记录 -->
          <button class="but" :class="{'op-5':newLog,'op-5':onfocus==null}" style="background-color: var(--color-theme-1);" hover-class="op-8" @click="updateLog">修改记录</button>
          <!-- 删除记录 -->
          <button class="but" :class="{'op-5':newLog,'op-5':onfocus==null}" style="background-color: var(--color-warn);" hover-class="op-8" @click="deleteLog">删除记录</button>
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
    
    .log-history {
        flex: 2;
        border-right: 1px solid var(--color-line);
    }
    
    .log-info {
        flex: 1;
    }
    
    .item-container {
        width: 95%;
        height: 90%;
        overflow: scroll;
        margin-top: 20px;
        background-color: var(--color-background-box);
    }
    
    .item-container::-webkit-scrollbar {
        display: none;
    }
    
    .log-item {
        width: 90%;
        margin-top: 10px;
        padding: 25px 15px;
        transition: 0.75s;
    }
    
    .date-format {
        font-size: 15px;
        margin: 15px;
    }
    
    .onfocus {
        background-color: var(--color-theme-1);
        color: var(--color-but-font);
    }
    
    .easyinput {
        width: 90%;
        height: 250px;
        background-color: var(--color-background-box);
        margin-top: 30px;
    }
    
    .buts {
        margin-top: auto;
        margin-bottom: 50px;
        width: 100%;
    }
    
    .but {
        margin-top: 30px;
        width: 50%;
        border-radius: 50px;
        font-size: 15px;
        height: 40px;
        color: var(--color-but-font);
    }
</style>