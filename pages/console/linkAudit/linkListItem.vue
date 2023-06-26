<script setup>
    import {
        ref,
        watch
    } from 'vue'
    let data = defineProps({
        data: Object,
        index: Number,
        onfocus: Number | undefined
    })

    watch(() => data.onfocus, (n) => {
        if (n != data.index) {
            fontColor.value.color = 'var(--color-font)'
            isOnfocus.value = false
        } else {
            isOnfocus.value = true
            fontColor.value.color = 'var(--color-but-font)'
        }
    })

    const isOnfocus = ref(false)
    const fontColor = ref({
        color: 'var(--color-font)'
    })

    const emit = defineEmits(['focus'])

    function em() {
        emit('focus')
    }
</script>

<template>
  <div @click='em' class="list-item flex a-c pointer" :class="isOnfocus?'':'luminousBox'"
    @mouseenter="isOnfocus ? '' : fontColor.color = 'var(--color-but-font)'"
    @mouseleave="isOnfocus ? '' : fontColor.color = 'var(--color-font)'">
    <img :src="data.data.logo" :alt="data.data.name">
    <div class="content flex column">
      <h3 :style="fontColor" style="transition: 0.75s;">{{data.data.name}}</h3>
      <div :style="fontColor" style="transition: 0.75s;">{{data.data.content}}</div>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .list-item {
        width: 95%;
        height: 100px;
        margin: 10px 0;
        background-color: var(--color-box-2);
        background-color: v-bind(isOnfocus?'var(--color-theme-1)': 'var(--color-box-2)');
        box-shadow: 0 0 10px var(--color-shadow);
    }
    
    .list-item * {
        cursor: pointer;
    }
    
    .content {
        margin-left: 15px;
        height: 90px;
        justify-content: space-around;
    }
    
    img {
        border-radius: 100%;
        height: 70px;
        margin-left: 5%;
    }
</style>