<script setup>
    import {
        ref
    } from 'vue'

    defineProps({
        position: Boolean, // true：弹幕区输入框，false：底部输入框
        loading: Boolean
    })
    defineEmits(['publish'])

    const input_value = ref('')
</script>

<template>
  <div class="flex j-c a-c column" style="z-index: 1;">
    <div class="inputUps flex a-c j-c" :class="position?'inputUps-dm':'inputUps-bot'">
      <input maxlength="500" placeholder="留下留言" :class="position?'input-dm':'input-bot'"
      v-model="input_value">
      <button class="luminousBox pointer" :class="[position?'button-dm':'button-bot']"
        @click="$emit('publish',input_value)">发送</button>
    </div>
  </div>
</template>

<style scoped>
    @import '/pages/main.css';
    .inputUps {
        width: 95%;
        max-width: 600px;
        height: 45px;
        border-radius: 75px;
        z-index: 1;
    }
    
    .inputUps-dm {
        border: 1px solid var(--color-message-dm)
    }
    
    .inputUps-bot {
        border: 1px solid var(--color-line);
        background: var(--color-background-box)
    }
    
    input {
        flex: 1;
        background: none;
        outline: none;
        height: 30px;
        border-radius: 0;
        padding-left: 7px;
        margin: 0 5px 0 15px;
        border: 0;
    }
    
    .input-dm {
        border-bottom: 1px solid var(--color-message-dm);
        color: var(--color-but-font);
    }
    
    .input-bot {
        border-bottom: 1px solid var(--color-line);
        color: var(--color-font);
    }
    
    button {
        height: 100%;
        width: 20%;
        min-width: 75px;
        /* color: var(--color-but-font); */
        font-size: 17px;
        border-radius: 75px;
        background: none;
        transition: 0.75s;
        letter-spacing: 5px;
        /* border: 1px solid var(--color-message-dm); */
    }
    
    button:hover {
        border: 1px solid var(--color-theme-1)
    }
    
    .button-dm {
        border: 1px solid var(--color-message-dm);
        color: var(--color-but-font);
    }
    
    .button-bot {
        border: 1px solid var(--color-line);
        color: var(--color-font);
    }
</style>