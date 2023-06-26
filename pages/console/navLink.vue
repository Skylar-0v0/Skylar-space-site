<script setup>
    import {
        useWindowStore
    } from '/stores/window.js'
    const Window = useWindowStore()
    defineProps({
        link: String,
        name: String
    })
</script>

<template>
  <router-link class="link-but link-bottom" :class="Window.route[1]==link?'link-on':'luminousBox'"
    :to="'/console/'+link">{{name}}</router-link>
</template>

<style scoped>
    @import '/pages/main.css';
    .link-but {
        height: 60px;
        line-height: 60px;
        text-align: center;
    }
    
    .link-on {
        color: var(--color-but-font);
        background-color: var(--color-theme-1);
        border-bottom: 1px solid var(--color-theme-1);
    }
    
    .link-bottom {
        border-bottom: 1px solid var(--color-line);
    }
    
    .link-bottom:hover {
        border-bottom: 1px solid var(--color-theme-1);
    }
</style>