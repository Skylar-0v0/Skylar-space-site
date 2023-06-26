<script setup>
    import {
        shallowRef,
        watch,
        defineAsyncComponent
    } from "vue"
    import {
        usePopUpsStore
    } from '/stores/popUps.js'
    const popUps = usePopUpsStore()
    import Tip from './Tip.vue'
    const login = defineAsyncComponent(() =>
        import ('./login.vue'))
    const link = defineAsyncComponent(() =>
        import ('./link'))
    import aft from './aft.vue'

    const popUpsList = {
        login,
        link,
        aft
    }

    watch(() => popUps.displaying, (n) => {
        displaying.value = popUpsList[n[0]]
    })

    const displaying = shallowRef(null)
</script>

<template>
  <teleport to='body'>
    <Tip></Tip>
  </teleport>
  <teleport to='body'>
    <component :is="displaying"></component>
  </teleport>
</template>

<style scoped>

</style>