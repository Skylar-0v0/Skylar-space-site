<script setup>
    import {
        ref,
        watch
    } from 'vue'
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()

    let timeout
    popUps.$onAction(
        ({
            name, // action 名称
            store, // store 实例，类似 `someStore`
            args, // 传递给 action 的参数数组
            after, // 在 action 返回或解决后的钩子
            onError, // action 抛出或拒绝的钩子
        }) => {
            after(() => {
                if (name == 'tip') {
                    status.value.display = true
                    clearTimeout(timeout)
                    timeout = setTimeout(() => {
                        status.value.display = false
                    }, 4000)
                }
            })
        })

    let status = ref({
        display: false
    })
</script>

<template>
  <teleport to='body'>
    <transition name="tip">
      <div class="container position-f" v-show="status.display">{{popUps.tipArgs.message}}</div>
    </transition>
  </teleport>
</template>

<style scoped>
    .container {
        width: 80%;
        max-width: 600px;
        word-wrap: normal;
        background-color: v-bind('popUps.tipArgs.style');
        box-shadow: 0 0 5px v-bind('popUps.tipArgs.style'), 0 0 10px v-bind('popUps.style');
        color: var(--color-but-font);
        padding: 15px;
        z-index: 999;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        font-weight: bold;
        text-align: center;
        border-radius: 75px;
    }
    
    .tip-enter-active,
    .tip-leave-active {
        transition: 1s;
    }
    
    .tip-enter-from,
    .tip-leave-to {
        opacity: 0;
    }
</style>