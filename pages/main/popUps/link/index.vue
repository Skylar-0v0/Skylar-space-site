<script setup>
    import {
        ref,
        shallowRef,
        watch,
        onMounted,
        defineAsyncComponent
    } from "vue"
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    const linkFiled = defineAsyncComponent(() =>
        import ('./linkFiled.vue'))
    const linkInfo = defineAsyncComponent(() =>
        import ('./linkInfo.vue'))

    const popUpsList = {
        linkFiled,
        linkInfo
    }

    onMounted(() => {
        full.value = true
        displaying.value = popUpsList[popUps.displaying[1]]
    })

    function exit() {
        full.value = false
        setTimeout(() => {
            displaying.value = null
            popUps.shutPopUps()
        }, 500)
    }

    const displaying = shallowRef(null)
    const full = ref(false)
</script>

<template>
  <transition name="fade">
    <div class="full flex j-c a-c position-f" v-show="full">
      <transition name="mainFade" style="--active-leave-time:0.5s ease-in">
        <div class=" pop-ups car flex column" v-show="full">
          <uni-icons @click="exit" class="exit pointer" type="closeempty" size="20" color="var(--color-font)">
          </uni-icons>
          <component :is="displaying" @exit="exit"></component>
        </div>
      </transition>
    </div>
  </transition>
</template>

<style scoped>
    .container {
        top: 0;
        background: var(--color-background-mask);
        backdrop-filter: blur(3px);
        width: 100%;
        height: 100vh;
        z-index: 10;
        transform-style: preserve-3d;
    }
    
    .pop-ups {
        width: max-content;
        max-width: max-content;
    }
    
    .exit {
        margin: 15px 0 0 15px;
        align-self: start;
    }
</style>