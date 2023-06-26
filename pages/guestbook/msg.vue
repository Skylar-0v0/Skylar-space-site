<script setup>
    import {
        useUserStore
    } from '/stores/user.js'
    const user = useUserStore()
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    const db = uniCloud.database()

    defineProps({
        data: Object
    })
    const emit = defineEmits(['deleteMessage'])

    async function deleteMessage(id) {
        try {
            let res = await uni.showModal({
                content: '确定要删除留言吗？',
                confirmText: '删除',
                confirmColor: 'var(--color-warn)'
            })
            if (res.cancel) return
            uni.showLoading()
            await db.collection('messages').doc(id).remove().then(res => {
                popUps.tip('删除成功', false)
                emit('deleteMessage')
            })
        } catch (err) {
            popUps.tip(err, true)
        } finally {
            uni.hideLoading()
        }
    }
</script>

<template>
  <div class="comment flex column">
    <div class="flex" style="margin-bottom: 12px;">
      <h3 style="white-space: nowrap;" :style="data.public?'':'color:var(--color-warn)'">{{data.sender[0].nickname}}:</h3>
      <p class="word-wrap" style="margin-left: 10px;" :style="data.public?'':'color:var(--color-warn)'">{{data.message}}</p>
    </div>
    <div class="flex">
      <uni-dateformat style="opacity: 0.8;margin-bottom: 8px;font-size: 15px;" :date="data.createdAt">
      </uni-dateformat>
      <p v-if="data.sender[0]._id == user.userInfo._id" @click="deleteMessage(data._id)" class="pointer"
        style="color: var(--color-wait);margin-left: auto">删除</p>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .comment {
        width: 90%;
        max-width: 850px;
        padding-left: 5px;
        margin: 10px auto;
        border-bottom: 1px solid var(--color-wait);
    }
    
    .word-wrap {
        width: 90%;
        word-break: break-all;
    }
</style>